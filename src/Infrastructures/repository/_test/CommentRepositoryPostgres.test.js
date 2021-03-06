const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');

const NewComment = require('../../../Domains/comments/entities/NewComment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const SavedComment = require('../../../Domains/comments/entities/SavedComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('function addComment', () => {
    it('should add comment correctly to database', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments).toHaveLength(1);
    });

    it('should return SavedComment entity correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'sebuah komentar',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new SavedComment({
        id: 'comment-123',
        content: 'sebuah komentar',
        owner: 'user-123',
      }));
    });
  });

  describe('function verifyCommentIsExists', () => {
    it('should not throw NotFoundError when comment existed', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExists('comment-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when comment does not exist', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentIsExists('comment-123'))
        .rejects.toThrowError(NotFoundError);
    });
  });

  describe('function isAuthorized', () => {
    it('should throw AuthorizationError when user is not authorized to access', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      const otherUser = {
        id: 'user-345',
        username: 'nanang',
        password: '123456',
        fullname: 'Nanang Sutisna',
      };
      await UsersTableTestHelper.addUser(otherUser);

      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      expect(commentRepositoryPostgres.isAuthorized('comment-123', otherUser.id))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error Authorization if user is authorized', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});

      // Action
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Assert
      expect(commentRepositoryPostgres.isAuthorized('comment-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('function deleteComment', () => {
    it('should delete Comment correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('comment-123');

      // Assert
      const result = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('function getThreadComments', () => {
    it('should get all available and deleted comments of a thread correctly', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        content: 'komentar 234',
        thread: 'thread-123',
        owner: 'user-123',
        is_delete: true,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      await commentRepositoryPostgres.deleteComment('comment-234');

      // Action
      const comments = await commentRepositoryPostgres.getThreadComments('thread-123');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-123');
      expect(comments[0].content).toEqual('sebuah komentar');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].date).toBeInstanceOf(Date);
      expect(comments[0].is_delete).toEqual(false);
      expect(comments[0].likeCount).toEqual(0);

      expect(comments[1].id).toEqual('comment-234');
      expect(comments[1].content).toEqual('**komentar telah dihapus**');
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].date).toBeInstanceOf(Date);
      expect(comments[1].is_delete).toEqual(true);
      expect(comments[0].likeCount).toEqual(0);
    });
  });

  describe('function verifyCommentIsLiked', () => {
    it('should return false when user does not like the comment yet', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const status = await commentRepositoryPostgres.verifyCommentIsLiked('comment-123', 'user-123');

      // Assert
      expect(status).toEqual(false);
    });

    it('should return true when user liked the comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      await commentRepositoryPostgres.likeComment('comment-123', 'user-123', false);

      // Action
      const status = await commentRepositoryPostgres.verifyCommentIsLiked('comment-123', 'user-123');

      // Assert
      expect(status).toEqual(true);
    });
  });

  describe('function likeComment', () => {
    it('should add like Comment correctly if is not liked yet', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const isLiked = await commentRepositoryPostgres.verifyCommentIsLiked('comment-123', 'user-123');
      // Action
      const id = await commentRepositoryPostgres.likeComment('comment-123', 'user-123', isLiked);

      // Assert
      const statusLike = await commentRepositoryPostgres.verifyCommentIsLiked('comment-123', 'user-123');
      expect(statusLike).toEqual(true);
      expect(id).toEqual('like-123');
    });
    it('should remove like Comment correctly if is liked', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({});
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const isLiked = await commentRepositoryPostgres.verifyCommentIsLiked('comment-123', 'user-123');
      await commentRepositoryPostgres.likeComment('comment-123', 'user-123', isLiked);

      // Action
      const id = await commentRepositoryPostgres.likeComment('comment-123', 'user-123', !isLiked);

      // Assert
      const statusLike = await commentRepositoryPostgres.verifyCommentIsLiked('comment-123', 'user-123');
      expect(statusLike).toEqual(false);
      expect(id).toEqual('like-123');
    });
  });
});

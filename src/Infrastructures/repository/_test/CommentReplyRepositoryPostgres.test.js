const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentRepliesTableTestHelper = require('../../../../tests/CommentRepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewCommentReply = require('../../../Domains/replies/entities/NewCommentReply');
const CommentReplyRepositoryPostgres = require('../CommentReplyRepositoryPostgres');
const SavedCommentReply = require('../../../Domains/replies/entities/SavedCommentReply');

describe('CommentReplyRepositoryPostgres', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentRepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should add comment reply correctly to database', async () => {
      // Arrange
      const newReply = new NewCommentReply({
        content: 'sebuah balasan komentar',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const replies = await CommentRepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
    });

    it('should return Saved Reply entity correctly', async () => {
      // Arrange
      const newReply = new NewCommentReply({
        content: 'sebuah balasan komentar',
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new SavedCommentReply({
        id: 'reply-123',
        content: 'sebuah balasan komentar',
        owner: 'user-123',
      }));
    });
  });

  describe('function verifyReplyIsExists', () => {
    it('should not throw NotFoundError when reply existed', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyIsExists('reply-123')).resolves.not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when reply does not exist', async () => {
      // Arrange
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.verifyReplyIsExists('reply-123')).rejects.toThrowError(NotFoundError);
    });
  });

  describe('function isAuthorized', () => {
    it('should throw AuthorizationError when user is not authorized to access', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addReply({});

      const otherUser = {
        id: 'user-456',
        username: 'nanang',
        password: '123456',
        fullname: 'Nanang Sutisna',
      };
      await UsersTableTestHelper.addUser(otherUser);

      // Action
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Assert
      expect(replyRepositoryPostgres.isAuthorized('reply-123', otherUser.id))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error Authorization if user is authorized', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addReply({});

      // Action
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Assert
      expect(replyRepositoryPostgres.isAuthorized('reply-123', 'user-123'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('function deleteReply', () => {
    it('should delete Reply correctly', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addReply({});
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply('reply-123');

      // Assert
      const result = await CommentRepliesTableTestHelper.findRepliesById('reply-123');
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('function getCommentReplies', () => {
    it('should get all available and deleted replies of a comment correctly', async () => {
      // Arrange
      await CommentRepliesTableTestHelper.addReply({}); // reply with content, id = reply-123
      await CommentRepliesTableTestHelper.addReply({
        id: 'reply-456',
        commentId: 'comment-123',
        content: 'balasan lain',
        owner: 'user-123',
        is_delete: true,
      }); // deleted reply
      const replyRepositoryPostgres = new CommentReplyRepositoryPostgres(pool, {});
      await replyRepositoryPostgres.deleteReply('reply-456');

      // Action
      const replies = await replyRepositoryPostgres.getCommentReplies();

      // Assert
      expect(replies).toHaveLength(2);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].content).toEqual('sebuah balasan komentar');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].date).toBeInstanceOf(Date);
      expect(replies[0].is_delete).toEqual(false);

      expect(replies[1].id).toEqual('reply-456');
      expect(replies[1].content).toEqual('**balasan telah dihapus**');
      expect(replies[1].username).toEqual('dicoding');
      expect(replies[1].date).toBeInstanceOf(Date);
      expect(replies[1].is_delete).toEqual(true);
    });
  });
});

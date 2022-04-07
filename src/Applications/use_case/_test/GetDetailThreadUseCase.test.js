const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');
const CommentReplyRepository = require('../../../Domains/replies/CommentReplyRepository');
const CommentsReplies = require('../../../Domains/comments/entities/CommentsReplies');
const ThreadComments = require('../../../Domains/threads/entities/ThreadComments');

describe('GetDetailThreadUseCase', () => {
  it('it should orchecstrate the get thread detail action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';
    const expectedComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        date: '2022-03-30T07:20:09.745Z',
        content: 'sebuah komentar',
        is_delete: false,
      },
    ];
    const expectedThread = new DetailThread({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi sebuah thread',
      date: '2022-03-29T07:20:09.745Z',
      username: 'dicoding',
    });
    const commentId = ['comment-123'];
    const expectedReplies = [
      {
        id: 'reply-123',
        content: 'sebuah komentar balasan',
        date: '2022-03-29T07:20:09.745Z',
        username: 'dicoding',
        is_delete: false,
      },
    ];
    const commentsReplies = new CommentsReplies(
      expectedComments,
      expectedReplies,
    );

    const expectedResponse = new ThreadComments(
      expectedThread,
      commentsReplies.comments,
    );

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExists = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getThreadComments = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockCommentReplyRepository.getCommentReplies = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    /** creating use case instance */
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      commentReplyRepository: mockCommentReplyRepository,
    });

    const threadResult = await getDetailThreadUseCase.execute(threadId);
    // Assert
    expect(threadResult).toStrictEqual(expectedResponse);
    expect(mockThreadRepository.verifyThreadIsExists).toBeCalledWith(threadId);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getThreadComments).toBeCalledWith(threadId);
    expect(mockCommentReplyRepository.getCommentReplies).toBeCalled();
  });
});

const CommentReplyRepository = require('../../../Domains/replies/CommentReplyRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DeleteCommentReplyUseCase = require('../DeleteCommentReplyUseCase');

describe('DeleteCommentReplyUseCase', () => {
  it('it should orchestrate the delete reply action correctly', async () => {
    const useCasePayload = {
      id: 'reply-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockCommentReplyRepository = new CommentReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExists = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentIsExists = jest.fn(() => Promise.resolve());
    mockCommentReplyRepository.verifyReplyIsExists = jest.fn(() => Promise.resolve());
    mockCommentReplyRepository.isAuthorized = jest.fn(() => Promise.resolve());
    mockCommentReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    /** creating use case instance */
    const deleteCommentReplyUseCase = new DeleteCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentReplyUseCase.execute(useCasePayload))
      .resolves.not.toThrowError(Error);

    expect(mockThreadRepository.verifyThreadIsExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentReplyRepository.verifyReplyIsExists).toBeCalledWith(useCasePayload.id);
    expect(mockCommentReplyRepository.isAuthorized).toBeCalledWith(
      useCasePayload.id,
      useCasePayload.owner,
    );
    expect(mockCommentReplyRepository.deleteReply).toBeCalledWith(useCasePayload.id);
  });
});

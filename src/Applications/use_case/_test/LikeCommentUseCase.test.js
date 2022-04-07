const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('it should orchestrate add like comment action correctly when it does not exists', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      user: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExists = jest.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsExists = jest.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsLiked = jest.fn(() => Promise.resolve(false));

    mockCommentRepository.likeComment = jest.fn().mockImplementation(
      () => Promise.resolve(),
    );

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    /** action */
    const likedComment = await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadIsExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentIsLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.user,
    );
    expect(mockCommentRepository.likeComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.user,
      false,
    );
  });

  it('it should orchestrate delete like comment action correctly when it does exists', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      user: 'user-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExists = jest.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsExists = jest.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsLiked = jest.fn(() => Promise.resolve(true));

    mockCommentRepository.likeComment = jest.fn().mockImplementation(
      () => Promise.resolve(),
    );

    /** creating use case instance */
    const likeCommentUseCase = new LikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    /** action */
    const likedComment = await likeCommentUseCase.execute(useCasePayload);

    expect(mockThreadRepository.verifyThreadIsExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentRepository.verifyCommentIsLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.user,
    );
    expect(mockCommentRepository.likeComment).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.user,
      true,
    );
  });
});

const NewCommentReply = require('../../../Domains/replies/entities/NewCommentReply');
const SavedCommentReply = require('../../../Domains/replies/entities/SavedCommentReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentReplyRepository = require('../../../Domains/replies/CommentReplyRepository');
const AddCommentReplyUseCase = require('../AddCommentReplyUseCase');

describe('AddCommentReplyUseCase', () => {
  it('it should orchestrate the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'sebuah balasan comment',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };
    const expectedReply = new SavedCommentReply({
      id: 'reply-123',
      content: 'sebuah balasan comment',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockCommentReplyRepository = new CommentReplyRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadIsExists = jest.fn(() => Promise.resolve());

    mockCommentRepository.verifyCommentIsExists = jest.fn(() => Promise.resolve());

    mockCommentReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedReply));

    /** creating use case instance */
    const addCommentReplyUseCase = new AddCommentReplyUseCase({
      commentReplyRepository: mockCommentReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    /** action */
    const savedReply = await addCommentReplyUseCase.execute(useCasePayload);

    expect(savedReply).toStrictEqual(expectedReply);
    expect(mockThreadRepository.verifyThreadIsExists).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyCommentIsExists).toBeCalledWith(useCasePayload.commentId);
    expect(mockCommentReplyRepository.addReply).toBeCalledWith(new NewCommentReply({
      content: 'sebuah balasan comment',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    }));
  });
});

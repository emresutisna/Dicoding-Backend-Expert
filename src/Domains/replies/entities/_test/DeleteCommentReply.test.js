const DeleteCommentReply = require('../DeleteCommentReply');

describe('DeleteCommentReply entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new DeleteCommentReply(payload))
      .toThrowError('DELETE_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      threadId: 345,
      commentId: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new DeleteCommentReply(payload))
      .toThrowError('DELETE_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must create deleteCommentReply entity Correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    // Action
    const {
      id, threadId, commentId, owner,
    } = new DeleteCommentReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(threadId).toEqual(payload.threadId);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});

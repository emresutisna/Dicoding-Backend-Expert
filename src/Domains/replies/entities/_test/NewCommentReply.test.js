const NewCommentReply = require('../NewCommentReply');

describe('a NewCommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan comment',
    };

    // Action and Assert
    expect(() => new NewCommentReply(payload))
      .toThrowError('NEW_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan comment',
      commentId: 123,
      threadId: 1234,
      owner: true,
    };

    // Action and Assert
    expect(() => new NewCommentReply(payload))
      .toThrowError('NEW_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must create newReply object Correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan',
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    const {
      content, commentId, owner, threadId,
    } = new NewCommentReply(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(commentId).toEqual(payload.commentId);
    expect(threadId).toEqual(payload.threadId);
  });
});

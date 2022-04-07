const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
    };

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
      threadId: 123,
      owner: true,
    };

    // Action and Assert
    expect(() => new NewComment(payload))
      .toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('must create newComment object Correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    // Action and Assert
    const { content, threadId, owner } = new NewComment(payload);

    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
    expect(threadId).toEqual(payload.threadId);
  });
});

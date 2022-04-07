const SavedCommentReply = require('../SavedCommentReply');

describe('an savedCommentReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan comment',
    };

    // Action and Assert
    expect(() => new SavedCommentReply(payload))
      .toThrowError('SAVED_COMMENT_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah balasan comment',
      owner: true,
    };

    // Action and Assert
    expect(() => new SavedCommentReply(payload))
      .toThrowError('SAVED_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create savedCommentReply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'sebuah balasan comment',
      owner: 'user-123',
    };

    // Action and Assert
    const { id, content, owner } = new SavedCommentReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});

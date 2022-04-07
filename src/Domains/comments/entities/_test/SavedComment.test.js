const SavedComment = require('../SavedComment');

describe('a savedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
    };

    // Action and Assert
    expect(() => new SavedComment(payload))
      .toThrowError('SAVED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: 'sebuah komentar',
      owner: 345,
    };

    // Action and Assert
    expect(() => new SavedComment(payload))
      .toThrowError('SAVED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create savedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'sebuah komentar',
      owner: 'user-123',
    };

    // Action and Assert
    const { id, content, owner } = new SavedComment(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});

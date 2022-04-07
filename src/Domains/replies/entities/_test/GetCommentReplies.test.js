const GetCommentReplies = require('../GetCommentReplies');

describe('a GetCommentReplies entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah balasan comment',
    };

    // Action and Assert
    expect(() => new GetCommentReplies(payload))
      .toThrowError('GET_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      comment_id: 'comment-123',
      content: 'sebuah balasan comment',
      date: 'hari senin',
      username: true,
      is_delete: 'Status',
    };

    // Action and Assert
    expect(() => new GetCommentReplies(payload))
      .toThrowError('GET_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('leave the content as is if is_delete is false', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      comment_id: 'comment-123',
      content: 'sebuah balasan comment',
      date: '2022-03-02T11:19:08Z',
      username: 'user-123',
      is_delete: false,
    };

    // Action
    const {
      id, content, username, date,
    } = new GetCommentReplies(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('set content to **balasan telah dihapus** if is_delete is true', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      comment_id: 'comment-123',
      content: 'sebuah balasan',
      date: '2022-03-02T11:19:08Z',
      username: 'user-123',
      is_delete: true,
    };

    // Action
    const {
      id, content, username, date,
    } = new GetCommentReplies(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});

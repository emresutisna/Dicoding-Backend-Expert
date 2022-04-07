const GetThreadComments = require('../GetThreadComments');

describe('a GetThreadComments entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah komentar',
    };

    // Action and Assert
    expect(() => new GetThreadComments(payload))
      .toThrowError('GET_THREAD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      date: 'hari senin',
      content: 'sebuah komentar',
      is_delete: 234,
      like_count: 1,
    };

    // Action and Assert
    expect(() => new GetThreadComments(payload))
      .toThrowError('GET_THREAD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('leave the content as is if is_delete is false', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2022-03-02T23:20:06Z',
      content: 'sebuah komentar',
      is_delete: false,
      like_count: 1,
    };

    // Action
    const {
      id, content, username, date,
    } = new GetThreadComments(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
  });

  it('change content to **komentar telah dihapus** if is_delete is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date('2022-03-02T23:20:06Z'),
      content: 'sebuah komentar',
      is_delete: true,
      like_count: 1,
    };

    // Action
    const {
      id, content, username, date, likeCount,
    } = new GetThreadComments(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(likeCount).toEqual(payload.like_count);
    expect(content).toEqual('**komentar telah dihapus**');
  });
});

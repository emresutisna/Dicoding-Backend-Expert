const DetailThread = require('../DetailThread');

describe('a DetailThread entity', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      body: 'isi sebuah thread',
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: 'sebuah thread',
      body: 'isi sebuah thread',
      date: 'Selasa',
      username: 456,
    };

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError('DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('instantiate a new DetailThread instance', () => {
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi sebuah thread',
      date: new Date('2022-03-30T11:55:50Z'),
      username: 'dicoding',
    };

    const detailThread = new DetailThread(payload);

    expect(detailThread.id).toEqual(payload.id);
    expect(detailThread.title).toEqual(payload.title);
    expect(detailThread.body).toEqual(payload.body);
    expect(detailThread.date).toEqual(payload.date);
    expect(detailThread.username).toEqual(payload.username);
  });
});

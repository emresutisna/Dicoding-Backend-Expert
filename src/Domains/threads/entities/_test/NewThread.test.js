/* eslint-disable no-undef */
const NewThread = require('../NewThread');

describe('NewThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 123,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when title contains more than 100 character', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread sebuah thread sebuah thread sebuah thread sebuah thread sebuah thread sebuah thread sebuah thread',
      body: 'isi sebuah thread',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.TITLE_LIMIT_CHAR');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'sebuah thread',
      body: 'isi sebuah thread',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});

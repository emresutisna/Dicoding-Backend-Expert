/* eslint-disable no-undef */
const SavedThread = require('../SavedThread');

describe('a SavedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
    };

    // Action and Assert
    expect(() => new SavedThread(payload)).toThrowError('SAVED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 123,
    };

    // Action and Assert
    expect(() => new SavedThread(payload)).toThrowError('SAVED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create savedThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'sebuah thread',
      owner: 'user-123',
    };

    // Action
    const savedThread = new SavedThread(payload);

    // Assert
    expect(savedThread.id).toEqual(payload.id);
    expect(savedThread.title).toEqual(payload.title);
    expect(savedThread.owner).toEqual(payload.owner);
  });
});

const ThreadComments = require('../ThreadComments');

describe('a ThreadComments entities', () => {
  it('should throw error when detailComments is not an array', () => {
    const payloadThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi sebuah thread',
      date: '2022-03-29T07:15:20.745Z',
      username: 'dicoding',
    };

    const payloadComments = {};

    expect(() => new ThreadComments(payloadThread, payloadComments))
      .toThrowError('DETAIL_THREAD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create detailThread object correctly', () => {
    const payloadThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'isi sebuah thread',
      date: '2022-03-29T07:15:20.745Z',
      username: 'dicoding',
    };

    const payloadComments = [
      {
        id: 'comment-123',
        username: 'nanang',
        date: '2022-03-29T07:15:20.745Z',
        content: '**komentar telah dihapus**',
      },
      {
        id: 'comment-345',
        username: 'nanang',
        date: '2022-03-29T07:15:20.745Z',
        content: 'sebuah komentar',
      },
    ];

    const {
      id,
      title,
      body,
      date,
      username,
      comments,
    } = new ThreadComments(payloadThread, payloadComments);

    expect(id).toEqual(payloadThread.id);
    expect(title).toEqual(payloadThread.title);
    expect(body).toEqual(payloadThread.body);
    expect(date).toEqual(payloadThread.date);
    expect(username).toEqual(payloadThread.username);
    expect(comments).toHaveLength(2);
    expect(comments).toStrictEqual([
      {
        id: payloadComments[0].id,
        username: payloadComments[0].username,
        date: payloadComments[0].date,
        content: '**komentar telah dihapus**',
      },
      {
        id: payloadComments[1].id,
        username: payloadComments[1].username,
        date: payloadComments[1].date,
        content: payloadComments[1].content,
      },
    ]);
  });
});

const CommentsReplies = require('../CommentsReplies');

describe('a CommentsReplies entities', () => {
  it('should throw error when replies or comments is not an array', () => {
    const payloadComment = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'sebuah comment',
      date: '2022-03-31T08:22:23.785Z',
    };

    const payloadReplies = {};

    expect(() => new CommentsReplies(payloadComment, payloadReplies))
      .toThrowError('COMMENTS_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create CommentsReplies object correctly', () => {
    const payloadComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        content: 'sebuah comment',
        date: '2022-03-31T08:22:23.785Z',
      },
      {
        id: 'comment-345',
        username: 'dicoding',
        content: 'ini juga comment',
        date: new Date('2022-04-01T08:22:23.785Z'),
      },
    ];

    const payloadReplies = [
      {
        id: 'reply-123',
        comment_id: 'comment-123',
        content: '**balasan telah dihapus**',
        username: 'nanang',
        date: '2022-03-31T08:25:23.785Z',
      },
      {
        id: 'reply-345',
        comment_id: 'comment-123',
        content: 'sebuah balasan atas comment',
        username: 'nanang',
        date: new Date('2022-04-01T08:22:23.785Z'),
      },
    ];

    const {
      comments,
    } = new CommentsReplies(payloadComments, payloadReplies);

    expect(comments).toHaveLength(2);
    expect(comments).toStrictEqual([
      {
        id: payloadComments[0].id,
        username: payloadComments[0].username,
        date: payloadComments[0].date,
        content: payloadComments[0].content,
        replies: [
          {
            id: payloadReplies[0].id,
            content: payloadReplies[0].content,
            date: payloadReplies[0].date,
            username: payloadReplies[0].username,
          },
          {
            id: payloadReplies[1].id,
            content: payloadReplies[1].content,
            date: payloadReplies[1].date,
            username: payloadReplies[1].username,
          },
        ],
      },
      {
        id: payloadComments[1].id,
        username: payloadComments[1].username,
        date: payloadComments[1].date,
        content: payloadComments[1].content,
        replies: [],
      },
    ]);
  });
});

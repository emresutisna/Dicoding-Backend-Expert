/* eslint-disable no-param-reassign */
class CommentsReplies {
  constructor(comments, detailReplies) {
    if (!Array.isArray(comments) || !Array.isArray(detailReplies)) {
      throw new Error('COMMENTS_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.comments = comments.map((comment) => {
      const replies = detailReplies.filter((reply) => reply.comment_id === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        }));
      return { ...comment, replies };
    });
  }
}

module.exports = CommentsReplies;

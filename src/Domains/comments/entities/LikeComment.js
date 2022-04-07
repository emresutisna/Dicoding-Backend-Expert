class LikeComment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { commentId, threadId, user } = payload;

    this.commentId = commentId;
    this.user = user;
    this.threadId = threadId;
  }

  _verifyPayload({ commentId, threadId, user }) {
    if (!commentId || !user || !threadId) {
      throw new Error('LIKE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof commentId !== 'string' || typeof user !== 'string' || typeof threadId !== 'string') {
      throw new Error('LIKE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeComment;

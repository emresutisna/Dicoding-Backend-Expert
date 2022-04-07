class CommentReplyRepository {
  async addReply(newReply) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async verifyReplyIsExists(replyId) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isAuthorized(replyId, owner) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteReply(replyId) {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getCommentReplies() {
    throw new Error('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = CommentReplyRepository;

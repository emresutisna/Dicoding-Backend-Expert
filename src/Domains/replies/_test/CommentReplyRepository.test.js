const CommentReplyRepository = require('../CommentReplyRepository');

describe('CommentReplyRepository interface', () => {
  it('should throw error when invoke abstract behaviour', async () => {
    // Arrange
    const replyRepository = new CommentReplyRepository();

    // Action and Assert
    await expect(replyRepository.addReply({}))
      .rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.verifyReplyIsExists(''))
      .rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.isAuthorized('', ''))
      .rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.deleteReply(''))
      .rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(replyRepository.getCommentReplies(''))
      .rejects.toThrowError('COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});

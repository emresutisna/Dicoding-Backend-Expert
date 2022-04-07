const DeleteCommentReply = require('../../Domains/replies/entities/DeleteCommentReply');

class DeleteCommentReplyUseCase {
  constructor({ commentReplyRepository, commentRepository, threadRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(useCasePayload) {
    const deleteCommentReply = new DeleteCommentReply(useCasePayload);
    await this._threadRepository.verifyThreadIsExists(deleteCommentReply.threadId);
    await this._commentRepository.verifyCommentIsExists(deleteCommentReply.commentId);
    await this._commentReplyRepository.verifyReplyIsExists(deleteCommentReply.id);
    await this._commentReplyRepository
      .isAuthorized(deleteCommentReply.id, deleteCommentReply.owner);
    await this._commentReplyRepository.deleteReply(deleteCommentReply.id);
  }
}

module.exports = DeleteCommentReplyUseCase;

const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const deleteComment = new DeleteComment(useCasePayload);
    await this._threadRepository.verifyThreadIsExists(deleteComment.threadId);
    await this._commentRepository.verifyCommentIsExists(deleteComment.id);
    await this._commentRepository.isAuthorized(deleteComment.id, deleteComment.owner);
    await this._commentRepository.deleteComment(deleteComment.id);
  }
}

module.exports = DeleteCommentUseCase;

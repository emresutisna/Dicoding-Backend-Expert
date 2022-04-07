const NewCommentReply = require('../../Domains/replies/entities/NewCommentReply');

class AddCommentReplyUseCase {
  constructor({ commentReplyRepository, commentRepository, threadRepository }) {
    this._commentReplyRepository = commentReplyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const newCommentReply = new NewCommentReply(useCasePayload);
    await this._threadRepository.verifyThreadIsExists(newCommentReply.threadId);
    await this._commentRepository.verifyCommentIsExists(newCommentReply.commentId);
    return this._commentReplyRepository.addReply(newCommentReply);
  }
}

module.exports = AddCommentReplyUseCase;

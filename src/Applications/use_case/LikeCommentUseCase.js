const LikeComment = require('../../Domains/comments/entities/LikeComment');

class LikeCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const likeComment = new LikeComment(useCasePayload);
    await this._threadRepository.verifyThreadIsExists(likeComment.threadId);
    await this._commentRepository.verifyCommentIsExists(likeComment.commentId);
    const isLiked = await this._commentRepository.verifyCommentIsLiked(
      likeComment.commentId,
      likeComment.user,
    );
    return this._commentRepository.likeComment(likeComment.commentId, likeComment.user, isLiked);
  }
}

module.exports = LikeCommentUseCase;

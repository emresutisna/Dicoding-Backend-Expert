const CommentsReplies = require('../../Domains/comments/entities/CommentsReplies');
const ThreadComments = require('../../Domains/threads/entities/ThreadComments');

class GetDetailThreadUseCase {
  constructor({ commentRepository, threadRepository, commentReplyRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._commentReplyRepository = commentReplyRepository;
  }

  async execute(threadId) {
    await this._threadRepository.verifyThreadIsExists(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getThreadComments(threadId);
    const replies = await this._commentReplyRepository.getCommentReplies();
    const detailComments = new CommentsReplies(comments, replies);
    return new ThreadComments(thread, detailComments.comments);
  }
}

module.exports = GetDetailThreadUseCase;

const AddCommentReplyUseCase = require('../../../../Applications/use_case/AddCommentReplyUseCase');
const DeleteCommentReplyUseCase = require('../../../../Applications/use_case/DeleteCommentReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postCommentReplyHandler = this.postCommentReplyHandler.bind(this);
    this.deleteCommentReplyHandler = this.deleteCommentReplyHandler.bind(this);
  }

  async postCommentReplyHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    request.payload.threadId = threadId;
    request.payload.commentId = commentId;
    request.payload.owner = owner;

    const addCommentReplyUseCase = this._container.getInstance(AddCommentReplyUseCase.name);
    const addedReply = await addCommentReplyUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        addedReply,
      },
    }).code(201);
  }

  async deleteCommentReplyHandler(request, h) {
    const { threadId, commentId, replyId } = request.params;
    const { id: owner } = request.auth.credentials;
    const payload = {
      id: replyId,
      commentId,
      threadId,
      owner,
    };

    const deleteCommentReplyUseCase = this._container.getInstance(DeleteCommentReplyUseCase.name);
    await deleteCommentReplyUseCase.execute(payload);

    return h.response({
      status: 'success',
    }).code(200);
  }
}

module.exports = RepliesHandler;

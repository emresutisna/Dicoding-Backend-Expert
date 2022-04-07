/* eslint-disable camelcase */
class GetCommentReplies {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.comment_id = payload.comment_id;
    this.content = payload.is_delete ? '**balasan telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
    this.is_delete = payload.is_delete;
  }

  _verifyPayload(payload) {
    const {
      id, comment_id, username, date, content, is_delete,
    } = payload;
    if (!id || !comment_id || !username || !date || !content || is_delete === undefined) {
      throw new Error('GET_COMMENT_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof comment_id !== 'string'
      || typeof username !== 'string'
      || !(typeof date === 'object' || typeof date === 'string')
      || typeof content !== 'string'
      || typeof is_delete !== 'boolean'
    ) {
      throw new Error('GET_COMMENT_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetCommentReplies;

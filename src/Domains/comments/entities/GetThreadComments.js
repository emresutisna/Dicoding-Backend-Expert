/* eslint-disable camelcase */
class GetThreadComments {
  constructor(payload) {
    this._verifyPayload(payload);

    this.id = payload.id;
    this.content = payload.is_delete ? '**komentar telah dihapus**' : payload.content;
    this.date = payload.date;
    this.username = payload.username;
    this.is_delete = payload.is_delete;
    this.likeCount = payload.like_count;
  }

  _verifyPayload(payload) {
    const {
      id, username, date, content, is_delete, like_count,
    } = payload;
    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('GET_THREAD_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || !(typeof date === 'string' || typeof date === 'object')
      || typeof content !== 'string'
      || typeof is_delete !== 'boolean'
      || typeof like_count === 'number'
    ) {
      throw new Error('GET_THREAD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetThreadComments;

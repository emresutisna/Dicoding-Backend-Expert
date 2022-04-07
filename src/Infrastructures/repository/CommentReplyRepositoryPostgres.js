const CommentReplyRepository = require('../../Domains/replies/CommentReplyRepository');
const SavedCommentReply = require('../../Domains/replies/entities/SavedCommentReply');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const GetCommentReplies = require('../../Domains/replies/entities/GetCommentReplies');

class CommentReplyRepositoryPostgres extends CommentReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply) {
    const { content, commentId, owner } = newReply;
    const id = `reply-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comment_replies(id, content, comment_id, owner) VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, commentId, owner],
    };
    const result = await this._pool.query(query);

    return new SavedCommentReply({ ...result.rows[0] });
  }

  async verifyReplyIsExists(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan komentar tidak ditemukan');
    }
  }

  async isAuthorized(id, owner) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini');
    }
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE comment_replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getCommentReplies() {
    const query = {
      text: `SELECT comment_replies.id,
      comment_replies.comment_id,
      users.username,
      comment_replies.date,
      comment_replies.content,
      comment_replies.is_delete
      FROM comment_replies
      INNER JOIN users ON users.id = comment_replies.owner
      ORDER BY comment_replies.date ASC`,
      values: [],
    };

    const result = await this._pool.query(query);
    const replies = result.rows.map((reply) => new GetCommentReplies(reply));
    return replies;
  }
}

module.exports = CommentReplyRepositoryPostgres;

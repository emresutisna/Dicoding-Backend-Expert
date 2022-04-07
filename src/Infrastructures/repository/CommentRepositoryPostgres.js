const CommentRepository = require('../../Domains/comments/CommentRepository');
const SavedComment = require('../../Domains/comments/entities/SavedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const GetThreadComments = require('../../Domains/comments/entities/GetThreadComments');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner],
    };
    const result = await this._pool.query(query);

    return new SavedComment({ ...result.rows[0] });
  }

  async verifyCommentIsExists(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async isAuthorized(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (result.rows[0].owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak menghapus komentar ini');
    }
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getThreadComments(threadId) {
    const query = {
      text: `SELECT comments.*, users.username FROM comments
      INNER JOIN users ON users.id = comments.owner
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    const comments = result.rows.map((comment) => new GetThreadComments(comment));
    return comments;
  }
}

module.exports = CommentRepositoryPostgres;

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

    return new SavedComment(result.rows[0]);
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
      text: 'SELECT owner FROM comments WHERE id = $1',
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
      text: `SELECT comments.*, users.username, CAST(COALESCE(NULLIF(A.total, 0),0) AS INTEGER) as like_count FROM comments
      INNER JOIN users ON users.id = comments.owner
      LEFT JOIN (select comment_id, count(*) as total FROM user_comment_likes
      GROUP BY comment_id) A ON comments.id = A.comment_id
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows.map((comment) => new GetThreadComments(comment));
  }

  async verifyCommentIsLiked(commentId, user) {
    const query = {
      text: 'SELECT COUNT(1) FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2',
      values: [commentId, user],
    };

    const result = await this._pool.query(query);
    return result.rows[0].count !== '0';
  }

  async likeComment(commentId, user, isLiked) {
    const id = `like-${this._idGenerator()}`;
    const query = { text: '', values: [] };
    if (isLiked === true) {
      query.text = 'DELETE FROM user_comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING id';
      query.values = [commentId, user];
    } else {
      query.text = 'INSERT INTO user_comment_likes VALUES($1, $2, $3) RETURNING id';
      query.values = [id, user, commentId];
    }

    const result = await this._pool.query(query);
    return result.rows[0].id;
  }
}

module.exports = CommentRepositoryPostgres;

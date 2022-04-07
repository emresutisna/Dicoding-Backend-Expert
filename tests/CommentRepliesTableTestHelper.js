/* eslint-disable camelcase */
/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentRepliesTableTestHelper = {
  async addReply({
    id = 'reply-123',
    commentId = 'comment-123',
    content = 'sebuah balasan komentar',
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO comment_replies(id, content, comment_id, owner) VALUES($1, $2, $3, $4)',
      values: [id, content, commentId, owner],
    };

    await pool.query(query);
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM comment_replies WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM comment_replies WHERE 1=1');
  },
};

module.exports = CommentRepliesTableTestHelper;

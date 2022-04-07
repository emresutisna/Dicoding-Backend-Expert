const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const SavedThread = require('../../Domains/threads/entities/SavedThread');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, title, owner',
      values: [id, title, body, owner],
    };
    const result = await this._pool.query(query);

    return new SavedThread({ ...result.rows[0] });
  }

  async verifyThreadIsExists(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('thread tidak dapat ditemukan di dalam database');
    }
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT threads.*, users.username FROM threads
      LEFT JOIN users ON users.id = threads.owner
      WHERE threads.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);
    const thread = result.rows[0];

    return new DetailThread(thread);
  }
}

module.exports = ThreadRepositoryPostgres;

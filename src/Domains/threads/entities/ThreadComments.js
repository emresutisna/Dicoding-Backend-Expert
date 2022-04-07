class ThreadComments {
  constructor(detailThread, detailComments) {
    const {
      id, title, body, date, username,
    } = detailThread;

    if (!Array.isArray(detailComments)) {
      throw new Error('DETAIL_THREAD_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = detailComments;
  }
}

module.exports = ThreadComments;

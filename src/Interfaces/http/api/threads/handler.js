const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetDetailThreadUseCase = require('../../../../Applications/use_case/GetDetailThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getDetailThreadHandler = this.getDetailThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    request.payload.owner = owner;

    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const savedThread = await addThreadUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        addedThread: savedThread,
      },
    }).code(201);
  }

  async getDetailThreadHandler(request, h) {
    const { threadId } = request.params;
    const getDetailThreadUseCase = this._container.getInstance(GetDetailThreadUseCase.name);

    const thread = await getDetailThreadUseCase.execute(threadId);

    return h.response({
      status: 'success',
      data: {
        thread,
      },
    }).code(200);
  }
}

module.exports = ThreadsHandler;

import EventEmitter from 'events';
import debug from 'debug';

const log = debug('st-logger:logs:raw');

export default class LogProcessorService extends EventEmitter {
  constructor(ideSocket) {
    super();

    this.ideSocket = ideSocket;
    ideSocket.on('message', this.onSocketMessage.bind(this));
  }

  onSocketMessage(data) {
    log('logs-received', data);

    let dataAsObject;
    try {
      dataAsObject = JSON.parse(data);
    } catch (e) {
      this.emit('logs', { msg: data });
      return;
    }

    if (!('logs' in dataAsObject)) {
      this.emit('logs', dataAsObject);
      return;
    }

    const { logs, ...otherData } = dataAsObject;

    for (const l of logs) {
      const flattenedLog = { ...l, ...otherData };
      this.emit('logs', flattenedLog);
    }
  }
}

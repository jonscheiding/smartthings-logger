import EventEmitter from 'events';

export default class LogProcessorService extends EventEmitter {
  constructor(ideSocket) {
    super();

    this.ideSocket = ideSocket;
    ideSocket.on('message', this.onSocketMessage.bind(this));
  }

  onSocketMessage(data) {
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

    for (const log of logs) {
      const flattenedLog = { ...log, ...otherData };
      this.emit('logs', flattenedLog);
    }
  }
}

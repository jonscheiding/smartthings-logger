import EventEmitter from 'events';
import WebSocket from 'ws';

export default class IdeLoggerService extends EventEmitter {
  async connect(connectionDetails) {
    this.socket = new WebSocket(
      connectionDetails.url,
      { headers: connectionDetails.headers },
    );

    this.socket.on('message', this.onSocketMessage.bind(this));
  }

  async disconnect() {
    this.socket.close();
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
    const flattenedLogs = logs.map(log => ({ ...log, ...otherData }));

    this.emit('logs', flattenedLogs);
  }
}

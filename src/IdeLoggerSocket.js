import debug from 'debug';
import WebSocket from 'ws';

const log = debug('st-logger:websocket');

export default class IdeLoggerSocket extends WebSocket {
  constructor(connectionDetails) {
    super(connectionDetails.url, { headers: connectionDetails.headers });

    for (const event of ['connection', 'open', 'close']) {
      this.on(event, data => IdeLoggerSocket.logWebSocketEvent(event, data));
    }
  }

  static logWebSocketEvent(name, data) {
    log({ name, data });
  }
}

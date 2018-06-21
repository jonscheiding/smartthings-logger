import WebSocket from 'ws';

export default class IdeLoggerSocket extends WebSocket {
  constructor(connectionDetails) {
    super(connectionDetails.url, { headers: connectionDetails.headers });
  }
}

import bunyan from 'bunyan';
import bunyanSeq from 'bunyan-seq';

const bunyanConfig = {
  name: 'smartthings',
  streams: [
    {
      stream: process.stdout,
      level: 'debug',
    },
  ],
};

if (process.env.SEQ_INGEST_URL) {
  bunyanConfig.streams.push(bunyanSeq.createStream({
    serverUrl: process.env.SEQ_INGEST_URL,
    level: 'debug',
  }));
}

export default bunyan.createLogger(bunyanConfig);

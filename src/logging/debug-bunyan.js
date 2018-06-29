import bunyan from 'bunyan';
import bunyanSeq from 'bunyan-seq';
import debug from 'debug';

const logger = bunyan.createLogger({
  name: 'st',
  streams: [
    { stream: process.stdout, level: 'debug' },
    bunyanSeq.createStream({
      serverUrl: 'http://localhost:5341',
      level: 'info',
    }),
  ],
});

function sendDebugToBunyan() {
  const inner = { formatArgs: debug.formatArgs, log: debug.log };

  debug.formatArgs = function formatArgs(args) {
    const structured = {
      timestamp: new Date(),
      namespace: this.namespace,
      args: [...args],
    };

    inner.formatArgs.call(this, args);

    args.unshift(structured);
  };

  debug.log = function log(structured, ...args) {
    // inner.log.apply(this, args);

    const childLogger = logger.child({ namespace: structured.namespace });

    const [message, ...context] = structured.args;

    switch (context.length) {
      case 0:
        childLogger.info(message);
        return;
      case 1:
        childLogger.info(context[0], message);
        return;
      default:
        childLogger.info(context, message);
    }
  };
}

sendDebugToBunyan();

import bunyan from 'bunyan';
import debug from 'debug';

import debugStructured from './debug-structured';

export default function enableBunyan() {
  debugStructured(debug);

  const logger = bunyan.createLogger({
    name: 'smartthings',
  });

  debug.log = function log(data) {
    const { namespace, args } = data;
    const [event, ...context] = args || [];

    let logMessage = event;
    let result;

    if (context.length === 1 && typeof (context[0].msg) === 'string') {
      const { msg, level, ...rest } = context[0];
      logMessage = msg || logMessage;
      result = { originalLevel: level, ...rest };
    } else {
      result = context;
    }

    result.namespace = namespace;
    result.event = event;

    logger.info(result, logMessage);
  };
}

if (process.env.DEBUG_BUNYAN) {
  enableBunyan();
}

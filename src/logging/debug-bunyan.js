import debug from 'debug';

import debugStructured from './debug-structured';
import bunyanLogger from './bunyan';

const inner = { ...debug };

function log(data) {
  const logger = this.bunyan || debug.bunyan;
  if (!logger) {
    inner.log.call(this, data);
    return;
  }

  const { namespace, args } = data;
  const [event, ...context] = args || [];

  let logMessage = event;
  let result;

  if (context.length === 1 && typeof (context[0].msg) === 'string') {
    const {
      msg, level, time, ...rest
    } = context[0];

    logMessage = msg || logMessage;

    result = {
      originalLevel: level,
      originalTime: time,
      ...rest,
    };
  } else {
    result = context;
  }

  result.namespace = namespace;
  result.event = event;

  logger.info(result, logMessage);
}

debug.log = log;

export default function debugBunyan(debugInstance, logger) {
  debugStructured(debugInstance);

  debug.bunyan = logger;
}

if (process.env.DEBUG_BUNYAN) {
  debugBunyan(debug, bunyanLogger);
}

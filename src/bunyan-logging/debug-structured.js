import debug from 'debug';
import util from 'util';

export default function debugStructured(debugInstance) {
  if (debugInstance.structured) {
    return;
  }

  const inner = { ...debugInstance };

  function formatArgs(args) {
    const structured = {
      timestamp: new Date(),
      namespace: this.namespace,
      args: [...args],
    };

    inner.formatArgs.call(this, args);

    args.splice(0, args.length);
    args.push(structured);
  }

  function log(structured) {
    process.stdout.write(`${util.format('%j', structured)}\n`);
  }

  // eslint-disable-next-line no-param-reassign
  [debugInstance.formatArgs, debugInstance.log, debugInstance.structured]
    = [formatArgs, log, true];
}

if (process.env.DEBUG_STRUCTURED) {
  debugStructured(debug);
}

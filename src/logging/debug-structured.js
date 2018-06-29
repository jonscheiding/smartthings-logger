import debug from 'debug';
import util from 'util';

export default function debugStructured(debugInstance) {
  const inner = { ...debugInstance };

  function formatArgs(args) {
    const structured = {
      timestamp: new Date(),
      namespace: this.namespace,
      args: [...args],
    };

    inner.formatArgs.call(this, args);

    args.splice(0, args.length);
    args.push('%j', structured);
  }

  function log(...args) {
    process.stdout.write(`${util.format(...args)}\n`);
  }

  // eslint-disable-next-line no-param-reassign
  [debugInstance.formatArgs, debugInstance.log] = [formatArgs, log];
}

if (process.env.DEBUG_STRUCTURED === '1') {
  debugStructured(debug);
}

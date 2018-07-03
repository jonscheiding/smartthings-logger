import debug from 'debug';

const inner = { ...debug };

function formatArgs(args) {
  const structured = {
    timestamp: new Date(),
    namespace: this.namespace,
    args: [...args],
  };

  inner.formatArgs.call(this, args);

  if (!this.structured && !debug.structured) {
    return;
  }

  args.splice(0, args.length);
  args.push(structured);
}

debug.formatArgs = formatArgs;

export default function debugStructured(debugInstance) {
  // eslint-disable-next-line no-param-reassign
  debugInstance.structured = true;
}

if (process.env.DEBUG_STRUCTURED) {
  debugStructured(debug);
}

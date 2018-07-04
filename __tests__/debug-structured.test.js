import debug from 'debug';

import debugStructured from '../src/logging/debug-structured';

let logger;
let spy;

beforeEach(() => {
  logger = debug('test-namespace');
  logger.enabled = true;
  logger.log = spy = jest.fn();
});

describe('Debug structured logging', () => {
  test('Logs structured data if enabled', () => {
    debugStructured(logger);

    const data = { };
    logger('This is a test message', data);

    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0].length).toBe(1);
    const structured = spy.mock.calls[0][0];

    expect(structured.timestamp).toBeInstanceOf(Date);
    expect(structured.namespace).toBe('test-namespace');
    expect(structured.args).toEqual(['This is a test message', data]);
  });

  test('Does not log structured data if not enabled', () => {
    const data = {};
    logger('This is a test message', data);

    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0].length).toBe(3);

    const [message, arg, timing] = spy.mock.calls[0];

    expect(message).toMatch(/test-namespace/);
    expect(message).toMatch(/This is a test message/);
    expect(arg).toBe(data);
    expect(timing).toMatch(/\d+ms/);
  });
});

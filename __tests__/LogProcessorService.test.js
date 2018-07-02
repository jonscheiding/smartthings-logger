import EventEmitter from 'events';
import LogProcessorService from '../src/smartthings-ide/LogProcessorService';

let emitter;
let handler;
let service;

describe('LoginProcessorService', () => {
  beforeEach(() => {
    emitter = new EventEmitter();
    service = new LogProcessorService(emitter);
    handler = jest.fn();

    service.on('logs', handler);
  });

  test('constructor creates an instance', () => {
    expect(service).toBeInstanceOf(LogProcessorService);
  });

  test('raises non-JSON as msg property', () => {
    emitter.emit('message', 'Hello');

    expect(handler.mock.calls.length).toBe(1);
    expect(handler.mock.calls[0][0]).toMatchObject({
      msg: 'Hello',
    });
  });

  test("raises JSON object as-is if it doesn't have a 'logs' property", () => {
    const message = {
      string: 'something',
      boolean: true,
      nested: {
        string: 'something else',
      },
    };
    emitter.emit('message', JSON.stringify(message));

    expect(handler.mock.calls.length).toBe(1);
    expect(handler.mock.calls[0][0]).toMatchObject(message);
  });

  test("flattens JSON object that has a 'logs' property", () => {
    const message = {
      string: 'something',
      logs: [
        { message: 'first message' },
        { message: 'second message' },
      ],
    };
    emitter.emit('message', JSON.stringify(message));

    expect(handler.mock.calls.length).toBe(2);
    expect(handler.mock.calls[0][0]).toMatchObject({
      string: 'something',
      message: 'first message',
    });
    expect(handler.mock.calls[1][0]).toMatchObject({
      string: 'something',
      message: 'second message',
    });
  });
});

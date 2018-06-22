import LoginService from '../src/LoginService';

let mockGotoIdeConsole;
let mockEnd;
let mockCookiesGet;
let mockEvaluate;

const correctCookies = [
  { name: 'JSESSIONID', value: 'JSESSIONID cookie' },
  { name: '_JTKN', value: '_JTKN cookie' },
  { name: 'SOME_OTHER_COOKIE', value: 'SOME_OTHER_COOKIE cookie' },
];

const correctEvaluateResult = {
  globals: {
    websocket: 'wss://some-websocket-url/',
    client: 'some_client_guid',
  },
};

jest.mock('../src/NightmareSmartThings', () =>
  jest.fn().mockImplementation(() => ({
    gotoIdeConsole: mockGotoIdeConsole,
  })));

describe('LoginService', () => {
  beforeEach(() => {
    mockGotoIdeConsole = jest.fn(() => ({
      end: mockEnd,
      cookies: { get: mockCookiesGet },
      evaluate: mockEvaluate,
    }));

    mockEnd = () => Promise.resolve();
    mockCookiesGet = () => Promise.resolve(correctCookies);
    mockEvaluate = () => Promise.resolve(correctEvaluateResult);
  });

  test('constructor creates an instance', () => {
    const service = new LoginService();

    expect(service).toBeInstanceOf(LoginService);
  });

  test('login() throws if username or password are not provided', () => {
    const service = new LoginService();
    const loginResult = service.login();

    return expect(loginResult).rejects
      .toThrow('Username and password are required.');
  });

  test("login() throws if the page didn't return the expected cookies", () => {
    mockCookiesGet = () => Promise.resolve([
      { name: 'SOME_OTHER_COOKIE', value: 'SOME_OTHER_COOKIE cookie' },
    ]);

    const service = new LoginService();
    const loginResult = service.login('username', 'password');

    return expect(loginResult).rejects
      .toThrow(/Expected cookies to include JSESSIONID and _JTKN/);
  });

  test("login() throws if the page doesn't have the expected JS content", () => {
    mockEvaluate = () => Promise.resolve({ globals: {} });

    const service = new LoginService();
    const loginResult = service.login('username', 'password');

    return expect(loginResult).rejects
      .toThrow(/Unexpected result evaluating the console page/);
  });

  test('login() returns the right cookies and URL if the login is successful', async () => {
    const service = new LoginService();
    const loginResult = await service.login('username', 'password');

    expect(loginResult.headers.Cookie).toBe('JSESSIONID=JSESSIONID cookie;_JTKN=_JTKN cookie;SOME_OTHER_COOKIE=SOME_OTHER_COOKIE cookie');
    expect(loginResult.url).toBe('wss://some-websocket-url/client/some_client_guid');
  });

  test('login() passes the username and password to the browser call', async () => {
    const service = new LoginService();
    await service.login('username', 'password');

    expect(mockGotoIdeConsole.mock.calls[0]).toEqual(['username', 'password']);
  });

  test('login() calls end() on the request', async () => {
    mockEnd = jest.fn();

    const service = new LoginService();
    await service.login('username', 'password');

    expect(mockEnd.mock.calls.length).toBe(1);
  });

  test('login() calls end() on the request even when there was an error', async () => {
    mockEnd = jest.fn();
    mockEvaluate = () => Promise.reject(new Error());

    const service = new LoginService();
    const loginResult = service.login('username', 'password');

    await expect(loginResult).rejects.toBeDefined();
    expect(mockEnd.mock.calls.length).toBe(1);
  });
});

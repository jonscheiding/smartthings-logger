import { LoginService } from '../src/login-service';

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

test('login() returns URL and Cookie header if login is successful', async () => {
  const service = new LoginService();
  const loginResult = await service.login(
    process.env.SMARTTHINGS_USERNAME,
    process.env.SMARTTHINGS_PASSWORD,
  );

  expect(loginResult.url).toMatch(/wss:\/\/(.*)\.smartthings.com\/client\/.*/);
  expect(loginResult.headers).toHaveProperty('Cookie');
}, 10000);

import LoginService from '../src/LoginService';

const {
  RUN_SMARTTHINGS_INTEGRATION_TESTS,
  SMARTTHINGS_USERNAME,
  SMARTTHINGS_PASSWORD,
} = process.env;

const describe = RUN_SMARTTHINGS_INTEGRATION_TESTS === '1' ? global.describe : global.describe.skip;

describe('SmartThings integration test', () => {
  if (!SMARTTHINGS_USERNAME || !SMARTTHINGS_PASSWORD) {
    throw new Error('SMARTTHINGS_USERNAME and SMARTTHINGS_PASSWORD are required in the environment in order to run the SmartThings integration tests.');
  }

  test('Connects to SmartThings successfully and retrieves cookies and URL', async () => {
    const loginService = new LoginService();
    const loginResult = await loginService.login(SMARTTHINGS_USERNAME, SMARTTHINGS_PASSWORD);

    console.log(loginResult);

    expect(loginResult.url).toMatch(/wss:\/\/(.*)\.smartthings.com\/client\/.*/);
    expect(loginResult.headers).toHaveProperty('Cookie');
    expect(loginResult.headers.Cookie).toMatch(/JSESSIONID=/);
    expect(loginResult.headers.Cookie).toMatch(/_JTKN=/);
  }, 10000);
});

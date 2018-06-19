import Nightmare from 'nightmare';

export class LoginService {
  constructor(showBrowser = false) {
    this._browser = new Nightmare({
      typeInterval: 1,
      show: showBrowser,
      waitTimeout: 5000,
    });
  }

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    const request = this._browser
      .goto('http://ide.smartthings.com/ide/logs')
      .wait('#username')
      .type('#username', process.env.SMARTTHINGS_USERNAME)
      .click('#next-step-btn')
      .wait('#password')
      .type('#password', process.env.SMARTTHINGS_PASSWORD)
      .click('#login-user-btn')
      .wait('#ide-console');

    const cookies = await request.cookies.get();
    /* eslint-disable-next-line no-undef */
    const st = await request.evaluate(() => ST);
    await request.end();

    const url = `${st.globals.websocket}client/${st.globals.client}`;
    const headers = {
      'Cookie': cookies.map((c) => c.name + '=' + c.value).join(';'),
    };

    return new ConnectionDetails(url, headers);
  }
}

export class ConnectionDetails {
  constructor(url, headers) {
    this.url = url;
    this.headers = headers;
  }
}

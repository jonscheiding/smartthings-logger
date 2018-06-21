import Nightmare from 'nightmare';

import errors from './errors';

export class ConnectionDetails {
  constructor(url, headers) {
    this.url = url;
    this.headers = headers;
  }
}

export class LoginService {
  constructor(showBrowser = false) {
    this.browser = new Nightmare({
      typeInterval: 1,
      show: showBrowser,
      waitTimeout: 5000,
      gotoTimeout: 5000,
    });
  }

  requestIdeConsole(username, password) {
    return this.browser
      .goto('http://ide.smartthings.com/ide/logs')
      .wait('#username')
      .type('#username', username)
      .click('#next-step-btn')
      .wait('#password')
      .type('#password', password)
      .click('#login-user-btn')
      .wait('#ide-console');
  }

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    const request = this.requestIdeConsole(username, password);

    try {
      const cookies = await request.cookies.get();
      /* eslint-disable-next-line no-undef */
      const st = await request.evaluate(() => ST);

      const url = `${st.globals.websocket}client/${st.globals.client}`;
      const headers = {
        Cookie: cookies.map(c => `${c.name}=${c.value}`).join(';'),
      };

      return new ConnectionDetails(url, headers);
    } catch (e) {
      throw errors.wrap(e, 'Error logging in to SmartThings.  Please check your username and password.');
    } finally {
      await request.end();
    }
  }
}

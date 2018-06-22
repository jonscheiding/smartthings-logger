import NightmareSmartThings from './NightmareSmartThings';

import ConnectionDetails from './ConnectionDetails';

export default class LoginService {
  constructor(showBrowser = false) {
    this.browser = new NightmareSmartThings({
      typeInterval: 1,
      show: showBrowser,
      waitTimeout: 5000,
      gotoTimeout: 5000,
    });
  }

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    const request = this.browser.gotoIdeConsole(username, password);

    try {
      const cookies = await request.cookies.get();
      /* eslint-disable-next-line no-undef */
      const st = await request.evaluate(() => ST);

      if (cookies.filter(c => c.name === 'JSESSIONID' || c.name === '_JTKN').length !== 2) {
        throw new Error(`Expected cookies to include JSESSIONID and _JTKN; the response had cookies [${
          cookies.map(c => `'${c.name}'`).join(', ')
        }].`);
      }

      if (!st || !('globals' in st) || !('websocket' in st.globals) || !('client' in st.globals)) {
        throw new Error(`Unexpected result evaluating the console page: ST = '${JSON.stringify(st)}'.`);
      }

      const url = `${st.globals.websocket}client/${st.globals.client}`;
      const headers = {
        Cookie: cookies.map(c => `${c.name}=${c.value}`).join(';'),
      };

      return new ConnectionDetails(url, headers);
    } catch (e) {
      e.message = `Error logging in to SmartThings.  Please check your username and password.\n${e.message}`;
      throw e;
    } finally {
      await request.end();
    }
  }
}

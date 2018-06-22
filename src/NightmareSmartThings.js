import Nightmare from 'nightmare';

export const IDE_CONSOLE_URL = 'http://ide.smartthings.com/ide/logs';

export default class NightmareSmartThings extends Nightmare {
  gotoIdeConsole(username, password) {
    return this
      .goto(IDE_CONSOLE_URL)
      .wait('#username')
      .type('#username', username)
      .click('#next-step-btn')
      .wait('#password')
      .type('#password', password)
      .click('#login-user-btn')
      .wait('#ide-console');
  }
}

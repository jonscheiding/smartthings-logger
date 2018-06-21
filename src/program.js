import dotenv from 'dotenv';
import yargs from 'yargs';

import LoginService from './LoginService';
import IdeLoggerService from './IdeLoggerService';

dotenv.config();

export default async function run(args) {
  const options = yargs
    .env('SMARTTHINGS')
    .option('username', {
      alias: 'u',
      describe: 'SmartThings username',
    })
    .option('password', {
      alias: 'p',
      describe: 'SmartThings password',
    })
    .option('show-browser', {
      describe: 'Show the browser window when logging in',
    })
    .demandOption(['username', 'password'])
    .boolean('show-browser')
    .help()
    .parse(args);

  const loginService = new LoginService(options.showBrowser);
  const ideLoggerService = new IdeLoggerService();
  ideLoggerService.on('logs', console.log);

  try {
    const connectionDetails = await loginService.login(options.username, options.password);
    ideLoggerService.connect(connectionDetails);
  } catch (e) {
    console.error(e);
  }
}

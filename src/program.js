import 'dotenv/config';
import yargs from 'yargs';

import LoginService from './LoginService';
import IdeLoggerSocket from './IdeLoggerSocket';
import LogProcessorService from './LogProcessorService';

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

  try {
    const connectionDetails = await loginService.login(options.username, options.password);
    const logProcessor = new LogProcessorService(new IdeLoggerSocket(connectionDetails));
    logProcessor.on('logs', console.log);
  } catch (e) {
    console.error(e);
  }
}

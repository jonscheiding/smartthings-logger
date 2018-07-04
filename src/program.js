import debug from 'debug';
import yargs from 'yargs';

import LoginService from './smartthings-ide/LoginService';
import IdeLoggerSocket from './smartthings-ide/IdeLoggerSocket';
import LogProcessorService from './smartthings-ide/LogProcessorService';

const logLogs = debug('st-logger:logs');
const logMessage = debug('st-logger');

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

    logMessage('connecting-socket', connectionDetails);

    const logProcessor = new LogProcessorService(new IdeLoggerSocket(connectionDetails));
    logProcessor.on('logs', (logs) => {
      logLogs('logs-received', logs);
    });
  } catch (e) {
    logMessage('logger-error', e);
  }
}

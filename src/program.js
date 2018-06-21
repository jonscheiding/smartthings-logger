import dotenv from 'dotenv';
import yargs from 'yargs';

import LoginService from './LoginService';

dotenv.config();

export default function run(args) {
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
  loginService.login(options.username, options.password)
    .then(console.log)
    .catch(console.log);
}

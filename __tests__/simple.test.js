import Nightmare from 'nightmare';
import dotenv from 'dotenv';

dotenv.config();
jest.setTimeout(100000);

test(`Aristotle's law of identity`, async () => {
  const browser = new Nightmare({show: true, typeInterval: 1})
    .goto('https://graph.api.smartthings.com/ide/logs')
    .type('#username', process.env.SMARTTHINGS_USERNAME)
    .click('#next-step-btn')
    .wait('#password')
    .type('#password', process.env.SMARTTHINGS_PASSWORD)
    .click('#login-user-btn')
    .wait('#ide-console');

  const cookies = await browser.cookies.get();
  const st = await browser.evaluate(() => ST);
  await browser.end();

  console.log({cookies, st});
});

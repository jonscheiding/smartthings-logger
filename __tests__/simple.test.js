import Nightmare from 'nightmare';
import dotenv from 'dotenv';
import WebSocket from 'ws';

dotenv.config();
jest.setTimeout(30000);

test.skip('Observe log messages coming through', async () => {
  const browser = new Nightmare({ typeInterval: 1 })
    .goto('http://ide.smartthings.com/ide/logs')
    .type('#username', process.env.SMARTTHINGS_USERNAME)
    .click('#next-step-btn')
    .wait('#password')
    .type('#password', process.env.SMARTTHINGS_PASSWORD)
    .click('#login-user-btn')
    .wait('#ide-console');

  const cookies = await browser.cookies.get();
  /* eslint-disable-next-line no-undef */
  const st = await browser.evaluate(() => ST);
  await browser.end();

  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join(';');

  console.log(`Authenticated successfully with cookies '${cookieHeader}.`);

  const socket = new WebSocket(
    `${st.globals.websocket}client/${st.globals.client}`,
    {
      headers: {
        Cookie: cookieHeader,
      },
    },
  );

  socket.on('message', console.log);

  await new Promise(resolve => setTimeout(resolve, 20000));

  socket.close();
});

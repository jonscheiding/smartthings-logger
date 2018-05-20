import Nightmare from 'nightmare';
import dotenv from 'dotenv';
import WebSocket from 'ws';

/* eslint-disable no-console */

dotenv.config();
jest.setTimeout(30000);

test(`Aristotle's law of identity`, async () => {
  const browser = new Nightmare({typeInterval: 1})
    .goto('https://graph.api.smartthings.com/ide/logs')
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

  const cookieHeader = cookies.map((c) => c.name + '=' + c.value).join(';');

  const socket = new WebSocket(
    st.globals.websocket + 'client/' + st.globals.client,
    {
      headers: {
        'Cookie': cookieHeader,
      },
    }
  );

  socket.on('message', console.log);

  await new Promise((resolve) => setTimeout(resolve, 20000));

  socket.close();
});

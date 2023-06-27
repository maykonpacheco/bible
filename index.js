const express = require('express');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const { Client, LocalAuth } = require('whatsapp-web.js');

const app = express();
const port = 3008;

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
    headless: true,
  },
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.get('/qr', (req, res) => {
  const qr = client.getQR();
  qrcode.generate(qr, { small: true });
  res.send(qr);
});

app.post('/message', async (req, res) => {
  const { body } = req.body;

  try {
    const condition = body.indexOf('##');
    if (condition >= 0) {
      const verse = body.replace('##', '');

      const bible = await axios(`https://bible-api.com/${verse}?translation=almeida`).then(
        (res) => res.data
      );

      res.send(bible.text);
    } else {
      res.send('No verse found.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', (msg) => {
  // Handle incoming messages here
});

client.initialize();

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

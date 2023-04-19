const qrcode = require('qrcode-terminal');
const axios = require('axios');
const puppeteer = require('puppeteer');

const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
        headless: true,
    },
});

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    try {
        const condition = msg.body.indexOf("##");
        if (condition >= 0) {
            const verse = msg.body.replace("##", "");
    
            const bible = await axios (`https://bible-api.com/${verse}?translation=almeida`)
            .then(res => res.data);
    
            msg.reply(bible.text);
        }
      } catch (error) {
        console.error(error);
      }
});

client.initialize();
const { Client, LocalAuth } = require('whatsapp-web.js');
const { redisClient } = require('./redis-config');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox']
  }
});

let isAuthenticated = false;
let qrCode;

client.initialize();

client.on('loading_screen', handleLoadingScreen);
client.on('qr', handleQRCode);
client.on('authenticated', handleAuthentication);
client.on('auth_failure', handleAuthFailure);
client.on('ready', handleReady);

async function handleLoadingScreen(percent, message) {
  console.log('LOADING SCREEN', percent, message);
}

function handleQRCode(qr) {
  qrcode.generate(qr, { small: true });
  qrCode = qr;
}

function handleAuthentication() {
  console.log('AUTHENTICATED');
  isAuthenticated = true;
}

function handleAuthFailure(msg) {
  console.error('AUTHENTICATION FAILURE', msg);
}

async function handleReady() {
  console.log('READY, caching current list');
  await cacheChatData();
  console.log('Cached, continue...');
}

async function cacheChatData() {
  const chatData = await client.getChats();

  for (let chat of chatData) {
    let exists = await redisClient.exists(chat.name);

    if (exists !== 1) {
      try {
        await redisClient.set(chat.name, chat.id._serialized);
        console.log('Key set successfully:', chat.name);
      } catch (err) {
        console.error('Error setting key:', err);
      }
    }
  }
}

const authenticated = () => isAuthenticated;

const getCode = () => qrCode;

module.exports = { client, authenticated, getCode };

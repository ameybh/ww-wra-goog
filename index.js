require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');

// setup Wolfram|Alpha API
const appid = process.env.APPID;
const WolframAlphaAPI = require('./lib/WolframAlphaAPI.js');
let wraAPI = WolframAlphaAPI(appid);
const invokeKey = 'ros';

const handleShort = require('./handlers/wra/short');
const handleImage = require('./handlers/wra/image');
const handleGoogle = require('./handlers/google/googleHandler');
let sessionLocal = JSON.parse(process.env.WW_SESSION);
console.log(sessionLocal);

const puppeteerOptions = {
    headless: true,
    args: ["--no-sandbox"],
};

const client = new Client({
    puppeteer: puppeteerOptions,
    session: sessionLocal
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('authenticated', session => {
    // Save this session object in WW_SESSION manually to reuse it next time
    console.log(JSON.stringify(session));
});
client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});
client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', message => {
    /*console.log('\n---\nNew Message at ' + String(Date()));
	console.log('From me? ' + String(message.fromMe));
	console.log(message.body);*/
	console.log(message);
    if (message.body.startsWith('!' + invokeKey + ' ')) {
        let text = message.body.substring(2 + invokeKey.length);
        console.log(text);
        if (text.startsWith('-i ')) {
            let query = text.substring(2);
            console.log(`Querying image result for ${query}`);
            handleImage(message, query, wraAPI);
        } else {
            console.log(`Querying text result for ${text}`);
            handleShort(message, text, wraAPI);
        }
    } else if (message.body.startsWith('!google ')){
	console.log("You asked Google");
    const googleSearch = message.body.slice(8)
	handleGoogle(message, googleSearch);
}
});

client.initialize();

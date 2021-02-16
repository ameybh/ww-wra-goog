require('dotenv').config();
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
var https = require('follow-redirects').https;

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
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', session => {
    // Save this session object in WW_SESSION manually to reuse it next time
    console.log(JSON.stringify(session));
});
client.on('auth_failure', message => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', message);
});
client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', async message => {
    /*console.log('\n---\nNew Message at ' + String(Date()));
    console.log('From me? ' + String(message.fromMe));
    console.log(message.body);*/
    console.log(message);
    if (message.body.startsWith('!ros')) {
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
    } else if (message.body.startsWith('!google ')) {
        console.log("You asked Google");
        const googleSearch = message.body.slice(8)
        handleGoogle(message, googleSearch);
    } else if (message.body == '!joke') {
        https.get(`https://official-joke-api.appspot.com/random_joke`, function (response) {
            var buffer = '';
            response.on('data', function (d) {
                buffer += d;
            }).on('end', function () {
                var body;
                try {
                    obj = JSON.parse(buffer);
                    message.reply(`${obj.setup} \n${obj.punchline}`);
                } catch (err) {
                    return message.reply(err);
                }
            }).setEncoding('utf8');
        });
    } else if (message.body.startsWith('!insult')) {
        https.get(`https://evilinsult.com/generate_insult.php?lang=en&type=json`, function (response) {
            var buffer = '';
            response.on('data', function (d) {
                buffer += d;
            }).on('end', function () {
                var body;
                try {
                    body = JSON.parse(buffer);

                    message.reply(`${body.insult}`);
                } catch (err) {
                    return message.reply(err);
                }
            }).setEncoding('utf8');
        });
    } else if (message.body === '!groupinfo') {
        let chat = await message.getChat();
        if (chat.isGroup) {
            message.reply(`
                *Group Details*
                Name: ${chat.name}
                Description: ${chat.description}
                Created At: ${chat.createdAt.toString()}
                Created By: ${chat.owner.user}
                Participant count: ${chat.participants.length}
            `);
        } else {
            message.reply('This command can only be used in a group!');
        }
    } else if (message.body.startsWith('!compliment')) {
        https.get(`https://complimentr.com/api`, function (response) {
            var buffer = '';
            response.on('data', function (d) {
                buffer += d;
            }).on('end', function () {
                var body;
                try {
                    body = JSON.parse(buffer);
                    message.reply(`${body.compliment}`);
                } catch (err) {
                    return message.reply(err);
                }
            }).setEncoding('utf8');
        });
    } else if (message.body == '!animeq') {
        https.get(`https://animechanapi.xyz/api/quotes/random`, function (response) {
            console.log(response.data);
        });
    } else if (message.body.toLowerCase().startsWith('!ansearch ')) {
        let str = message.body.slice(9);
        let stri = str.replace(/\s/g, "_");
        https.get(`https://api.jikan.moe/v3/search/anime?q=${stri}&limit=1`, function (response) {
            var buffer = '';
            response.on('data', function (d) {
                buffer += d;
            }).on('end', function () {
                var body;
                try {
                    obj = JSON.parse(buffer);
                    obj = obj.results[0];
                    if (obj.hasOwnProperty('title')) {
                        //message.reply(`${response}`);
                        message.reply(`Title:${obj.title} \nAiring? ${obj.airing}\nDescription:${obj.synopsis}\nEpisodes:${obj.episodes}\nURL:${obj.url}`);
                    }
                    else { message.reply("Error! Could not find specified search result!"); }
                } catch (err) {
                    return message.reply(err);
                }
            }).setEncoding('utf8');
        });



    }
});

client.initialize();

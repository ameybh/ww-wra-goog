const google = require('google-it');
const handleGoogle = (message, googleSearch) => {
    if(googleSearch == undefined || googleSearch == ' ') return message.reply(`*Result : ${googleSearch}* not found`)
    google({ 'query': googleSearch }).then(results => {
    let vars = `_*Result : ${googleSearch}*_\n`
    for (let i = 0; i < 1; i++) {
        vars +=  `\n------------------------------------------------\n\n*Title* : ${results[i].title}\n\n*Description* : ${results[i].snippet}\n\n*Link* : ${results[i].link}\n\n`
    }
        message.reply(vars);
    }).catch(e => {
        console.log(e)
        message.reply('I searched the universe but couldn\'t find the answer.');
    })
};
module.exports = handleGoogle;

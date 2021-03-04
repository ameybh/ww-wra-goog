# ww-wra-goog

WolramAlpha and Google search bot using [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) library.

## Installation

Use the package manager [npm](https://www.npmjs.com/) to setup ww-bot.

1. Clone the repository.
```bash
git clone https://github.com/ameybhavsar24/ww-bot-wra.git
```

2. Install dependencies.
```bash
npm i
```

## Usage
Start the project locally.
```bash
npm start
```
Open Whatsapp Web QR Scanner on your phone and scan the QR code shown in terminal.

Note: The bot will stop when the process is terminated. To deploy the bot, see [DEPLOY.md](https://github.com/ameybhavsar24/ww-bot/blob/master/DEPLOY.md)

## Environment variables
You will need to authenticate everytime you start the bot unless you store a session file.
You can store the session locally by creating a `.env` file and setting a environment variable `WW_SESSION` to the session string printed in the terminal.

If you are deploying the bot to Heroku, you can store the session object as `WW_SESSION` to Heroku configs to skip authentication. Read more in [DEPLOY.md](https://github.com/ameybhavsar24/ww-bot/blob/master/DEPLOY.md)
### WolframAlpha `APPID`
Create a app at WolfRamAlpha and set `APPID` in `.env` file.

## License
[ISC](https://choosealicense.com/licenses/isc/)

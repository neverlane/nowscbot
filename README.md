# nowscbot
Telegram bot that show your history from SoundCloud

## Contributing
Feel free to open tickets or send pull requests with improvements. Thanks in advance for your help!

Please follow the [contribution guidelines](https://github.com/neverlane/nowscbot/blob/master/CONTRIBUTING.md).

## Requirements
OSX or Linux or Windows

NodeJS >= 16.0

## Requirements

### Checkout all projects
```sh
git clone git@github.com:neverlane/nowscbot.git
cd nowscbot
```

### Install npm packages
```sh
npm install
```

## Config

### Copy from example
```sh
cp config.example.ts config.ts
```

### Fill
```typescript
export const config: IConfig = {
  telegram_token: 'YOUR_TELEGRAM_TOKEN',
  receiveAudiosUserId: '123123123'
};
```

## Others

### Start bot in prod
```sh
npm run start:prod
```
### Start bot in dev
```sh
npm run start:dev
```
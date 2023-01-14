import { Telegram } from 'puregram';
import config from '~/config';

export const telegram = new Telegram({
  token: config.telegram_token
});
import { Telegram } from 'puregram';
import { PromptManager } from '@puregram/prompt';
import config from '~/config';

export const prompt = new PromptManager();
export const telegram = new Telegram({
  token: config.telegramToken,
  apiBaseUrl: config.apiBaseUrl ?? 'https://api.telegram.org/bot'
});
telegram.updates.use(prompt.middleware);
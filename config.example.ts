export interface IConfig {
  /**
   * Bot Token
   */
  telegramToken: string;
  /**
   * Telegram Bot API Url
   */
  apiBaseUrl?: string;
  /**
   * User ID that should receive Telegram Audios (need for upload arraybuffers and transform to fileId) 
   */
  receiveAudiosUserId: string | number;
}

export const config: IConfig = {
  telegramToken: '',
  receiveAudiosUserId: ''
};

export default config;
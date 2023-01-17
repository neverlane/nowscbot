import { config } from '~/config';
import { telegram } from '~/client';
import { SendAudioParams } from 'puregram/generated';

export type TelegramUploadAudioParams = Partial<SendAudioParams> & Pick<SendAudioParams, 'audio'>;

export const telegramUploadAudio = async (params: TelegramUploadAudioParams) => {
  const message = await telegram.api.sendAudio({
    ...params,
    chat_id: config.receiveAudiosUserId,
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return message.audio!;
};
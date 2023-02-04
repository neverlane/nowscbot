import { InlineQueryContext, MediaSourceType } from 'puregram';
import { TelegramInlineQueryResultCachedAudio } from 'puregram/generated';
import { print, telegramUploadAudio } from '~/helpers';
import { TelegramCache, User } from '~/database';
import { inlineTracksCacheMap, inlineTracksFilesCacheMap } from '~/inline-cache';
import { answerInlineQueryDefaultOptions } from '~/constants';
import { readFileSync } from 'fs';
import { soundcloudGetHistory } from '~/helpers/get-history';

const logInlineQuery = print.create('(inline-query)');
const emptySoundBuffer = readFileSync('assets/empty.mp3').buffer;

export async function onInlineQuery(context: InlineQueryContext) {
  logInlineQuery(`(sender: ${context.senderId})`, `(query[${context.query.length}] -> ${context.query})`);

  const [user] = await User.findOrCreate({
    where: {
      telegramId: context.senderId
    },
    defaults: {
      telegramId: context.senderId
    }
  });

  if (!user.soundcloudToken)
    return context.answerInlineQuery([], {
      ...answerInlineQueryDefaultOptions,
      switch_pm_text: 'Connect your SoundCloud account',
      switch_pm_parameter: 'connect'
    });

  const response = await soundcloudGetHistory(user.soundcloudToken);

  if (typeof response.data !== 'object' || !('collection' in response.data)) return context.answerInlineQuery([], {
    ...answerInlineQueryDefaultOptions,
    switch_pm_text: 'Reconnect your SoundCloud account',
    switch_pm_parameter: 'reconnect'
  });

  const results: TelegramInlineQueryResultCachedAudio[] = [];

  for (const { track } of response.data.collection) {
    const audioCacheId = `soundcloud_${track.id}`;
    inlineTracksCacheMap.set(audioCacheId, track);
    let hasCache = inlineTracksFilesCacheMap.has(audioCacheId);
    let audioFileId = '';
    if (!hasCache) {
      const cachedTrack = await TelegramCache.findOne({
        where: {
          soundcloudId: audioCacheId
        }
      });
      if (!cachedTrack) {
        const audio = await telegramUploadAudio({
          title: track.title,
          performer: track.user.username,
          thumb: {
            type: MediaSourceType.Url,
            value: track.artwork_url
          },
          audio: {
            type: MediaSourceType.ArrayBuffer,
            value: emptySoundBuffer,
            filename: track.title
          },
        });
        audioFileId = audio.file_id;
        // inlineTracksFilesCacheMap.set(audioCacheId, audio.file_id);
      } else {
        hasCache = cachedTrack.isCached;
        audioFileId = cachedTrack.telegramFileId;
        inlineTracksFilesCacheMap.set(audioCacheId, cachedTrack.telegramFileId);
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      audioFileId = inlineTracksFilesCacheMap.get(audioCacheId)!;
    }

    results.push({
      type: 'audio',
      id: audioCacheId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      audio_file_id: audioFileId,
      caption: `[listen](${track.permalink_url})`,
      parse_mode: 'MarkdownV2',
      reply_markup: {
        inline_keyboard: [[!hasCache ? {
          text: 'Loading audio...',
          callback_data: `track_${track.id}`
        } : {
          text: '❤️ Like',
          callback_data: `like_track:${track.id}`
        }]]
      },
    });
  }

  await context.answerInlineQuery([
    {
      type: 'article',
      title: 'History from SoundCloud',
      id: `user${user.id}_history`,
      url: `https://t.me/${context.telegram.bot.username}`,
      input_message_content: {
        message_text: `Use @${context.telegram.bot.username} with me`,
      }
    },
    ...results
  ], answerInlineQueryDefaultOptions);
}
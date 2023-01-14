import { InlineQueryContext } from 'puregram';
import { print } from '~/helpers';
import { SoundcloudTrack } from 'soundcloud.ts';
import axios from 'axios';
import { TelegramInlineQueryResultAudio } from 'puregram/generated';
import { User } from '~/database';
import { inlineTracksCacheMap } from '~/inline-cache';

const logInlineQuery = print.create('(inline-query)');
const SOUNDCLOUD_CLIENT = 'ZQvaVYuPpe0Pg7Ga7V24qFseYl6eTK73';
const iqopts = {
  cache_time: 5,
  is_personal: true
};

export async function onInlineQuery(context: InlineQueryContext) {
  logInlineQuery(`(sender: ${context.senderId})`, `(query[${context.query.length}] -> ${context.query})`);
  
  const [user] = await User.findOrCreate({
    where: {
      telegram_id: context.senderId
    },
    defaults: {
      telegram_id: context.senderId
    }
  });

  if (!user.soundcloud_token)
    return context.answerInlineQuery([], {
      ...iqopts,
      switch_pm_text: 'Connect your SoundCloud account',
      switch_pm_parameter: 'connect'
    });

  const response = await axios.get<Record<'collection', Array<Record<'track', SoundcloudTrack>>>>('https://api-v2.soundcloud.com/me/play-history/tracks', {
    validateStatus: null,
    params: {
      client_id: SOUNDCLOUD_CLIENT,
      limit: 5,
      offset: 0,
      linked_partitioning: 1,
      app_version: 1673268527,
      app_locale: 'en'
    },
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      authorization: `OAuth ${user.soundcloud_token}`,
      referer: 'https://soundcloud.com/'
    }
  });

  if (typeof response.data !== 'object' || !('collection' in response.data)) return context.answerInlineQuery([], {
    ...iqopts,
    switch_pm_text: 'Reconnect your SoundCloud account',
    switch_pm_parameter: 'reconnect'
  });

  const results: TelegramInlineQueryResultAudio[] = [];

  for (const { track } of response.data.collection) {
    const id = `user${user.id}_track_${track.id}`;
    inlineTracksCacheMap.set(id, track);
    results.push({
      type: 'audio',
      id,
      audio_url: 'https://st.neverlane.xyz/empty.mp3',
      input_message_content: {
        // eslint-disable-next-line no-useless-escape
        message_text: `via @${context.telegram.bot.username} \\| [listen](${track.permalink_url})`,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      },
      reply_markup: {
        inline_keyboard: [[{
          text: 'Loading audio...',
          callback_data: `track_${track.id}`
        }]]
      },
      title: track.title,
      performer: track.user.username,
      audio_duration: (track.duration / 1000) | 0,
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
  ], iqopts);
}
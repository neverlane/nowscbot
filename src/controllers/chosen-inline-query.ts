import { ChosenInlineResultContext, InlineKeyboardBuilder, MediaSourceType } from 'puregram';
import { print, soundcloudStreamLink, telegramUploadAudio } from '~/helpers';
import { inlineTracksCacheMap, inlineTracksFilesCacheMap } from '~/inline-cache';
import axios from 'axios';
import { TelegramCache, User } from '~/database';

const logChosenInlineQuery = print.create('(chosen-inline-query)');

export async function onChosenInlineQuery(context: ChosenInlineResultContext) {
  logChosenInlineQuery(`(sender: ${context.senderId} | resultId: ${context.resultId})`, `(query[${context.query.length}] -> ${context.query})`);
  if (!context.inlineMessageId) return;
  const user = await User.findOne({
    where: {
      telegramId: context.senderId,
    }
  });
  const { inlineMessageId } = context;
  if (!user || !user.soundcloudToken) return await context.telegram.api.editMessageText({
    inline_message_id: inlineMessageId,
    text: '🐱 Can\'t download song (#1)'
  });
  const hasTrack = inlineTracksCacheMap.has(context.resultId);
  if (!hasTrack) return context.telegram.api.editMessageText({
    inline_message_id: inlineMessageId,
    text: '🐱 Can\'t find song'
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const track = inlineTracksCacheMap.get(context.resultId)!;
  inlineTracksCacheMap.delete(context.resultId);
  
  try {
    const audioUrl = await soundcloudStreamLink(user.soundcloudToken, track.permalink_url);
    if (!audioUrl) throw new Error('🐱 Can\'t download song');
    const audioResponse = await axios.get<ArrayBuffer>(audioUrl, {
      responseType: 'arraybuffer'
    });
    const audio = await telegramUploadAudio({
      title: track.title,
      performer: track.user.username,
      thumb: {
        type: MediaSourceType.Url,
        value: track.artwork_url
      },
      audio: {
        type: MediaSourceType.ArrayBuffer,
        value: audioResponse.data,
        filename: track.title
      },
    });
    const trackCacheId = `soundcloud_${track.id}`;
    inlineTracksFilesCacheMap.set(trackCacheId, audio.file_id);
    const [cacheTrack] = await TelegramCache.findOrCreate({
      where: {
        soundcloudId: trackCacheId
      },
      defaults: {
        soundcloudId: trackCacheId,
        telegramFileId: audio.file_id,
        isCached: true
      }
    });
    if (!cacheTrack.isCached) {
      cacheTrack.isCached = true;
      await cacheTrack.save();
    }
    await context.telegram.api.editMessageMedia({
      inline_message_id: inlineMessageId,
      media: {
        type: 'audio',
        caption: `[listen](${track.permalink_url})`,
        parse_mode: 'MarkdownV2',
        media: {
          type: MediaSourceType.FileId,
          value: audio.file_id
        }
      },
      reply_markup: new InlineKeyboardBuilder().textButton({
        text: '❤️ Like',
        payload: `like_track:${track.id}`
      })
    });
  } catch (error) {
    console.error(error);
    await context.telegram.api.editMessageText({
      inline_message_id: inlineMessageId,
      text: '🐱 Can\'t download song (#2)'
    });
  }
}
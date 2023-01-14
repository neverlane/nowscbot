import { ChosenInlineResultContext, MediaSourceType } from 'puregram';
import { print } from '~/helpers';
import SoundCloud from 'soundcloud.ts';
import { inlineTracksCacheMap } from '~/inline-cache';

const logChosenInlineQuery = print.create('(chosen-inline-query)');
const soundcloud = new SoundCloud();

export async function onChosenInlineQuery(context: ChosenInlineResultContext) {
  logChosenInlineQuery(`(sender: ${context.senderId} | resultId: ${context.resultId})`, `(query[${context.query.length}] -> ${context.query})`);
  if (!context.inlineMessageId) return;
  const { inlineMessageId } = context;
  const hasTrack = inlineTracksCacheMap.has(context.resultId);
  if (!hasTrack) return context.telegram.api.editMessageText({
    inline_message_id: inlineMessageId,
    text: '😖 Cannot find track'
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const track = inlineTracksCacheMap.get(context.resultId)!;
  inlineTracksCacheMap.delete(context.resultId);
  const audio_url = await soundcloud.util.streamLink(track.permalink_url);
  await context.telegram.api.editMessageMedia({
    inline_message_id: inlineMessageId,
    media: {
      type: 'audio',
      caption: `via @${context.telegram.bot.username} \\| [listen](${track.permalink_url})`,
      parse_mode: 'MarkdownV2',
      thumb: {
        type: MediaSourceType.Url,
        value: track.artwork_url,
      },
      title: track.title,
      media: {
        type: MediaSourceType.Url,
        value: audio_url,
        filename: track.title,
        forceUpload: true
      }
    }
  });
  
}
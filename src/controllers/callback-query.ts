import { CallbackQueryContext } from 'puregram';
import { User } from '~/database';
import { print } from '~/helpers';
import { soundcloudGetMe } from '~/helpers/get-me';
import { soundcloudLikeTrack } from '~/helpers/like-track';

const logCallbackQuery = print.create('(callback-query)');

export async function onCallbackQuery(context: CallbackQueryContext) {
  logCallbackQuery(`(sender: ${context.senderId} | id: ${context.id})`, `(data: ${context.hasData() ? context.data : 'nil'})`);
  if (!context.hasData()) return;
  const [user] = await User.findOrCreate({
    where: {
      telegramId: context.senderId
    },
    defaults: {
      telegramId: context.senderId
    }
  });
  if (context.data.startsWith('like_track:')) {
    const trackId = context.data.slice(11);
    if (!trackId) return;
    const scuser = await soundcloudGetMe(user.soundcloudToken);
    const userId = parseInt(scuser?.urn?.slice(17) ?? '-1');
    if (userId <= -1) return context.answerCallbackQuery({
      show_alert: true,
      text: 'Cannot get user. Please re-authorize your token'
    });
    await soundcloudLikeTrack(user.soundcloudToken, userId, trackId);
    return context.answerCallbackQuery({
      show_alert: true,
      text: 'You like this track'
    });
  }
}
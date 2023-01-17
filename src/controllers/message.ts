import { PromptContext } from '@puregram/prompt';
import { MessageContext } from 'puregram';
import { User } from '~/database';
import { print } from '~/helpers';
import { soundcloudGetHistory } from '~/helpers/get-history';

type MessagePromptContext = MessageContext & PromptContext;
const logMessage = print.create('(message)');

export async function onMessage(context: MessagePromptContext) {
  logMessage(`(sender: ${context.senderId})`, `(text[${context.text?.length ?? 0}] -> ${context.text ?? ''})`);
  if (!context.senderId || !context.text) return;
  const entity = context.entities?.[0];
  if (entity && entity.type === 'bot_command' && entity.offset === 0) {
    const command = context.text.slice(1, entity.length);
    const args = context.text.slice(entity.length + 1);
    if ((command === 'start' && (args === 'connect' || args === 'reconnect')) || (command === 'connect' || command === 'reconnect')) {
      return onConnect(context);
    }
  }
  context.send('🐈 Hello!\nUse /connect for connect your SoundCloud account');
  // context.prompt('')
}


async function onConnect(context: MessagePromptContext) {
  if (!context.senderId) return;
  let token = '';
  
  while (!token) {
    const tokenContext = await context.prompt('✍️ Enter your SoundCloud token\nUse /cancel for cancel action');
    if (tokenContext.text === '/cancel') {
      await context.send('❌ You cancel this action');
      return;
    }
    try {
      if (!tokenContext.text) continue;
      const _token = tokenContext.text.trim();
      const response = await soundcloudGetHistory(_token);
      if (typeof response.data === 'object' && ('collection' in response.data)) 
        token = _token;
      else
        await context.send('❌ Please enter corrent SoundCloud token!');
    } catch (error) {
      break;
    }
  }

  const [user] = await User.findOrCreate({
    where: {
      telegramId: context.senderId,
    },
    defaults: {
      telegramId: context.senderId,
      soundcloudToken: token
    }
  });

  if (!user.soundcloudToken) {
    user.soundcloudToken = token;
    await user.save();
  }

  context.send('🎉 Hooray! Now you can use @nowscbot in inline mode.');

}
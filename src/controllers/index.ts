import { telegram } from '~/client';
import { onChosenInlineQuery } from './chosen-inline-query';
import { onInlineQuery } from './inline-query';
import { onMessage } from './message';

telegram.updates.on('inline_query', onInlineQuery);
telegram.updates.on('chosen_inline_result', onChosenInlineQuery);
telegram.updates.on('message', onMessage);
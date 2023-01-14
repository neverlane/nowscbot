import { telegram } from '~/client';
import { onChosenInlineQuery } from './chosen-inline-query';
import { onInlineQuery } from './inline-query';

telegram.updates.on('inline_query', onInlineQuery);
telegram.updates.on('chosen_inline_result', onChosenInlineQuery);
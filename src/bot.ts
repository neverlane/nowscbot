import { telegram } from './client';
import { print } from './helpers';
import './controllers';
import { initializeConnection } from './database';

async function main() {
  await initializeConnection();
  print('launch bot...');
  await telegram.updates.startPolling();
  print('bot started');
}

main().catch(e => console.error(e));
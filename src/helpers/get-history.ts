import axios from 'axios';
import { SOUNDCLOUD_CLIENT_ID } from '~/constants';
import { SoundCloudTrack } from '~/types/soundcloud';

export const soundcloudGetHistory = async (token: string) => {
  return await axios.get<Record<'collection', Array<Record<'track', SoundCloudTrack>>>>('https://api-v2.soundcloud.com/me/play-history/tracks', {
    validateStatus: null,
    params: {
      client_id: SOUNDCLOUD_CLIENT_ID,
      limit: 5,
      offset: 0,
      linked_partitioning: 1,
      app_version: 1673268527,
      app_locale: 'en'
    },
    headers: {
      accept: 'application/json, text/javascript, */*; q=0.01',
      authorization: `OAuth ${token}`,
      referer: 'https://soundcloud.com/'
    }
  });
};
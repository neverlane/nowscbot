import axios from 'axios';
import { SOUNDCLOUD_CLIENT_ID } from '~/constants';
import { SoundCloudUserResponse } from '~/types/soundcloud';

export const soundcloudGetMe = (token: string) => axios.get<SoundCloudUserResponse>('https://api-v2.soundcloud.com/me', {
  validateStatus: null,
  params: {
    client_id: SOUNDCLOUD_CLIENT_ID,
    app_version: 1673268527,
    app_locale: 'en'
  },
  headers: {
    accept: 'application/json, text/javascript, */*; q=0.01',
    authorization: `OAuth ${token}`,
    referer: 'https://soundcloud.com/'
  }
}).then(response => !response.data ? null : response.data);

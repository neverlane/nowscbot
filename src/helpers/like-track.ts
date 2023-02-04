import axios from 'axios';
import { SOUNDCLOUD_CLIENT_ID } from '~/constants';

export const soundcloudLikeTrack = async (token: string, userId: string | number, id: string | number) => {
  try {
    await axios.put(`https://api-v2.soundcloud.com/users/${userId}/track_likes/${id}`, null, {
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
    });
  } catch (error) {
    return false;
  }
  return true;
};

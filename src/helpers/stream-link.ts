import axios from 'axios';
import { SOUNDCLOUD_CLIENT_ID } from '~/constants';

export interface SoundCloudTranscoding {
  format: {
    mime_type: string;
    protocol: string;
  };
  url: string;
}

export const soundcloudStreamLink = async (songUrl: string): Promise<string | null> => {
  const host = 'https://soundcloud.com';
  const { pathname } = new URL(songUrl, host);
  const headers = {
    referer: host,
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
  };
  try {
    const html = await axios.get<string>(`${host}/${pathname}`, {
      headers
    }).then((r) => r.data);
    const jsonText = html.match(/(\[{)(.*)(?=;)/gm)?.[0];
    if (!jsonText) return null;
    const transcodings = JSON.parse(jsonText).at(-1).data.media.transcodings as SoundCloudTranscoding[];
    const transcoding = transcodings.find(({ format: { mime_type, protocol } }) => mime_type === 'audio/mpeg' && protocol === 'progressive');
    if (!transcoding) return null;
    const sourceUrlSong = await axios.get(`${transcoding.url}${transcoding.url.includes('secret_token') ? '&' : '?'}client_id=${SOUNDCLOUD_CLIENT_ID}`, { headers })
      .then((r) => r.data.url);
    return sourceUrlSong;
  } catch (error) {
    return null;
  }
};
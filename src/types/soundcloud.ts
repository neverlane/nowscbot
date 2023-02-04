export interface SoundCloudTrack {
  id: number;
  permalink_url: string;
  description: string;
  title: string;
  duration: number;
  artwork_url: string;
  user: {
    username: string;
  };
}

export interface SoundCloudUserResponse {
  full_name: string;
  permalink: string;
  urn: string;
}
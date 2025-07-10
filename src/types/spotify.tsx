export interface Track {
  id: string;
  name: string;
  artist: string;
  preview_url: string | null;
  image: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  images: SpotifyImage[];
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  preview_url: string | null;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: SpotifyImage[];
  owner: {
    display_name: string;
  };
}

export interface SpotifySearchResponse {
  albums?: {
    items: SpotifyAlbum[];
  };
  playlists?: {
    items: SpotifyPlaylist[];
  };
}

export interface SpotifyTracksResponse {
  items: (SpotifyTrack | { track: SpotifyTrack })[];
}
import type { SpotifySearchResponse, SpotifyTracksResponse } from '../types/spotify';

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = 'playlist-read-private playlist-read-collaborative';

const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export const getAuthUrl = async (): Promise<string> => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  return `https://accounts.spotify.com/authorize?${params}`;
};

export const getTokenFromUrl = async (): Promise<string | null> => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    const codeVerifier = localStorage.getItem('code_verifier');
    if (!codeVerifier) {
      console.error('No code verifier found');
      return null;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          code_verifier: codeVerifier,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.removeItem('code_verifier');
        window.history.replaceState({}, document.title, "/");
        return data.access_token;
      }
    } catch (error) {
      console.error('Token exchange error:', error);
    }
  }

  return null;
};

export const searchTracks = async (query: string, token: string): Promise<SpotifySearchResponse> => {
  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track,album,playlist&limit=10`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

export const getAlbumTracks = async (albumId: string, token: string): Promise<SpotifyTracksResponse> => {
  const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  
  const trackIds = data.items.map((track: any) => track.id).join(',');
  const tracksResponse = await fetch(`https://api.spotify.com/v1/tracks?ids=${trackIds}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const tracksData = await tracksResponse.json();
  
  return {
    ...data,
    items: tracksData.tracks
  };
};

export const getPlaylistTracks = async (playlistId: string, token: string): Promise<SpotifyTracksResponse> => {
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};
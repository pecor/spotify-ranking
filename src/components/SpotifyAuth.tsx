import React from 'react';
import { getAuthUrl } from '../services/spotifyApi';

const SpotifyAuth = () => {
  const handleLogin = async () => {
    const authUrl = await getAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <div className="auth-container">
      <h1>Spotify Music Tournament</h1>
      <p>Zaloguj się do Spotify, aby rozpocząć turniej muzyczny</p>
      <button onClick={handleLogin}>Zaloguj się do Spotify</button>
    </div>
  );
};

export default SpotifyAuth;
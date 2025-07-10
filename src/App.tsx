import React, { useState, useEffect } from 'react';
import SpotifyAuth from './components/SpotifyAuth';
import PlaylistSearch from './components/PlaylistSearch';
import TrackList from './components/TrackList';
import Tournament from './components/Tournament';
import { getTokenFromUrl } from './services/spotifyApi';
import type { Track } from './types/spotify';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [tournamentStarted, setTournamentStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkForToken = async () => {
      const savedToken = localStorage.getItem('spotify_token');
      const tokenExpiry = localStorage.getItem('spotify_token_expiry');
      
      if (savedToken && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
        console.log('DEBUG - Using saved token');
        setToken(savedToken);
        setLoading(false);
        return;
      }

      const tokenFromUrl = await getTokenFromUrl();
      if (tokenFromUrl) {
        console.log('DEBUG - Got new token from URL');
        setToken(tokenFromUrl);
        
        // Token w localStorage przez 50min (tokeny spotify są ważne 1h)
        localStorage.setItem('spotify_token', tokenFromUrl);
        localStorage.setItem('spotify_token_expiry', (Date.now() + 50 * 60 * 1000).toString());
      }
      
      setLoading(false);
    };
    
    checkForToken();
  }, []);

  const handleTracksLoaded = (loadedTracks: Track[]): void => {
    setTracks(loadedTracks);
  };

  const startTournament = (): void => {
    if (tracks.length >= 2) {
      setTournamentStarted(true);
    }
  };

  const handleLogout = (): void => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiry');
    setToken(null);
    setTracks([]);
    setTournamentStarted(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <SpotifyAuth />;
  }

  if (tournamentStarted) {
    return <Tournament tracks={tracks} onBack={() => setTournamentStarted(false)} />;
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Spotify Music Tournament</h1>
        <button onClick={handleLogout} className="logout-btn">
          Wyloguj się
        </button>
      </div>
      <PlaylistSearch token={token} onTracksLoaded={handleTracksLoaded} />
      {tracks.length > 0 && (
        <>
          <TrackList tracks={tracks} />
          <button onClick={startTournament} disabled={tracks.length < 2}>
            Start Tournament ({tracks.length} tracks)
          </button>
        </>
      )}
    </div>
  );
}

export default App;
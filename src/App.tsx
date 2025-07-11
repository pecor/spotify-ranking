import React, { useState, useEffect } from 'react';
import SpotifyAuth from './components/SpotifyAuth';
import PlaylistSearch from './components/PlaylistSearch';
import TrackList from './components/TrackList';
import Tournament from './components/Tournament';
import TournamentOptions from './components/TournamentOptions';
import { getTokenFromUrl, getAlbumTracks, getPlaylistTracks } from './services/spotifyApi';
import type { Track } from './types/spotify';
import './App.css';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [tournamentStarted, setTournamentStarted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSources, setSelectedSources] = useState<{id: string, name: string, type: 'album' | 'playlist'}[]>([]);
  const [view, setView] = useState<'auth' | 'playlists' | 'tournament-options' | 'tournament'>('auth');

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

  const handleSourceToggle = (source: {id: string, name: string, type: 'album' | 'playlist'}) => {
    setSelectedSources(prev => {
      const exists = prev.find(s => s.id === source.id);
      if (exists) {
        return prev.filter(s => s.id !== source.id)
      } else {
        return [...prev, source];
      }
    });
  };

  const loadAllSelectedTracks = async () => {
    if (!token || selectedSources.length === 0) return;
    
    setLoading(true);
    try {
      let allTracks: Track[] = [];
      
      for (const source of selectedSources) {
        let sourceTracks: Track[];
        if (source.type === 'album') {
          sourceTracks = await getAlbumTracks(source.id, token);
        } else {
          sourceTracks = await getPlaylistTracks(source.id, token);
        }
        allTracks = [...allTracks, ...sourceTracks];
      }
      
      setTracks(allTracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTournament = (finalTracks: Track[]) => {
    setTracks(finalTracks);
    setTournamentStarted(true);
  };

  const handleLogout = (): void => {
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiry');
    setToken(null);
    setTracks([]);
    setTournamentStarted(false);
  };

  const handleTracksSelected = (tracks: Track[]) => {
    setTracks(tracks);
    setView('tournament-options');
  };

  const handleBackToPlaylists = () => {
    setView('playlists');
    setTracks([]);
  };

  const handleBackToOptions = () => {
    setView('tournament-options');
  };

  const startTournament = (): void => {
    if (tracks.length >= 2) {
      setView('tournament-options');
    }
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

  if (view === 'tournament-options') {
    return (
      <div className="App">
        <div className="header">
          <h1>Spotify Music Tournament</h1>
        </div>
        <TournamentOptions 
          tracks={tracks}
          onStartTournament={handleStartTournament}
          onBack={handleBackToPlaylists}
        />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <h1>Spotify Music Tournament</h1>
        <button onClick={handleLogout} className="logout-btn">
          Wyloguj się
        </button>
      </div>
      <PlaylistSearch 
        token={token} 
        onTracksLoaded={handleTracksLoaded}
        selectedSources={selectedSources}
        onSourceToggle={handleSourceToggle}
      />
      
      {selectedSources.length > 0 && (
        <div className="selected-sources">
          <h3>Wybrane źródła ({selectedSources.length})</h3>
          <div className="sources-list">
            {selectedSources.map(source => (
              <div key={source.id} className="selected-source">
                <span>{source.name} ({source.type})</span>
                <button onClick={() => handleSourceToggle(source)}>×</button>
              </div>
            ))}
          </div>
          <button onClick={loadAllSelectedTracks} disabled={loading}>
            {loading ? 'Ładowanie...' : `Załaduj wszystkie piosenki (${selectedSources.length} źródeł)`}
          </button>
        </div>
      )}
      
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
import React, { useState } from 'react';
import { searchTracks, getAlbumTracks, getPlaylistTracks } from '../services/spotifyApi';
import type { Track, SpotifySearchResponse } from '../types/spotify';

interface PlaylistSearchProps {
  token: string;
  onTracksLoaded: (tracks: Track[]) => void;
  selectedSources: {id: string, name: string, type: 'album' | 'playlist'}[];
  onSourceToggle: (source: {id: string, name: string, type: 'album' | 'playlist'}) => void;
}

const PlaylistSearch: React.FC<PlaylistSearchProps> = ({ 
  token, 
  onTracksLoaded, 
  selectedSources, 
  onSourceToggle 
}) => {
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SpotifySearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchTracks(query, token);
      console.log('DEBUG - Search results:', results);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const loadTracks = async (type: 'album' | 'playlist', id: string) => {
    setLoading(true);
    try {
      let tracksData: Track[];
      
      if (type === 'album') {
        tracksData = await getAlbumTracks(id, token);
      } else {
        tracksData = await getPlaylistTracks(id, token);
      }
      
      console.log('DEBUG - Tracks loaded:', tracksData);
      
      if (tracksData && tracksData.length > 0) {
        console.log('DEBUG - Final tracks array:', tracksData);
        onTracksLoaded(tracksData);
      } else {
        console.log('DEBUG - No tracks found');
      }
    } catch (error) {
      console.error('Error loading tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSelected = (id: string) => selectedSources.some(s => s.id === id);

  return (
    <div className="search-container">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Wyszukaj artystę, album lub playlistę..."
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Wyszukiwanie...' : 'Szukaj'}
        </button>
      </form>

      {searchResults && (
        <div className="search-results">
          <div className="albums-section">
            <h3>Albumy</h3>
            {searchResults.albums?.items?.filter(album => album && album.id).map(album => (
              <div 
                key={album.id} 
                className={`search-item ${isSelected(album.id) ? 'selected' : ''}`}
                onClick={() => onSourceToggle({
                  id: album.id,
                  name: album.name,
                  type: 'album'
                })}
              >
                <img 
                  src={
                    album.images && 
                    Array.isArray(album.images) && 
                    album.images.length > 0 && 
                    album.images[0] && 
                    album.images[0].url 
                      ? album.images[0].url 
                      : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiM5OTkiPk5PIElNRzwvdGV4dD4KPHN2Zz4='
                  } 
                  alt={album.name || 'Unknown Album'} 
                  width="50" 
                />
                <div>
                  <h4>{album.name || 'Unknown Album'}</h4>
                  <p>{
                    album.artists && 
                    Array.isArray(album.artists) && 
                    album.artists.length > 0 && 
                    album.artists[0] && 
                    album.artists[0].name 
                      ? album.artists[0].name 
                      : 'Unknown Artist'
                  }</p>
                </div>
              </div>
            ))}
          </div>

          <div className="playlists-section">
            <h3>Playlisty</h3>
            {searchResults.playlists?.items?.filter(playlist => playlist && playlist.id).map(playlist => (
              <div 
                key={playlist.id} 
                className={`search-item ${isSelected(playlist.id) ? 'selected' : ''}`}
                onClick={() => onSourceToggle({
                  id: playlist.id,
                  name: playlist.name,
                  type: 'playlist'
                })}
              >
                <img 
                  src={
                    playlist.images && 
                    Array.isArray(playlist.images) && 
                    playlist.images.length > 0 && 
                    playlist.images[0] && 
                    playlist.images[0].url 
                      ? playlist.images[0].url 
                      : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjEycHgiIGZpbGw9IiM5OTkiPk5PIElNRzwvdGV4dD4KPHN2Zz4='
                  } 
                  alt={playlist.name || 'Unknown Playlist'} 
                  width="50"
                />
                <div>
                  <h4>{playlist.name || 'Unknown Playlist'}</h4>
                  <p>{playlist.owner?.display_name || 'Unknown Owner'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="loading">Ładowanie...</div>}
    </div>
  );
};

export default PlaylistSearch;
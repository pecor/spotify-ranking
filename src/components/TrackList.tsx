import React from 'react';
import type { Track } from '../types/spotify';

interface TrackListProps {
  tracks: Track[];
}

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  return (
    <div className="track-list">
      <h2>Załadowane piosenki ({tracks.length})</h2>
      <div className="tracks">
        {tracks.map((track, index) => (
          <div key={track.id || `track-${index}`} className="track-item">
            {track.image ? (
              <img src={track.image} alt={track.name} width="50" />
            ) : (
              <div
                className="no-image-placeholder"
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: '#999',
                }}
              >
                NO IMG
              </div>
            )}
            <div className="track-info">
              <h4>{track.name}</h4>
              <p>{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackList;
import React, { useState, useEffect } from 'react';
import type { Track } from '../types/spotify';

interface TournamentProps {
  tracks: Track[];
  onBack: () => void;
}

const Tournament: React.FC<TournamentProps> = ({ tracks, onBack }) => {
  const [currentRound, setCurrentRound] = useState<Track[]>([]);
  const [currentPair, setCurrentPair] = useState<number>(0);
  const [winners, setWinners] = useState<Track[]>([]);
  const [champion, setChampion] = useState<Track | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);

  useEffect(() => {
    // Shuffle tracks and start first round
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setCurrentRound(shuffled);
  }, [tracks]);

  const selectWinner = (winner: Track): void => {
    const newWinners = [...winners, winner];
    setWinners(newWinners);

    if (currentPair + 1 < Math.floor(currentRound.length / 2)) {
      // More pairs in current round
      setCurrentPair(currentPair + 1);
    } else {
      // Round finished
      if (newWinners.length === 1) {
        // Tournament finished
        setChampion(newWinners[0]);
      } else {
        // Start next round
        setCurrentRound(newWinners);
        setWinners([]);
        setCurrentPair(0);
        setRoundNumber(roundNumber + 1);
      }
    }
  };

  if (champion) {
    return (
      <div className="tournament-finished">
        <h1>🏆 Zwycięzca Turnieju! 🏆</h1>
        <div className="champion">
          <img 
            src={champion.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE2cHgiIGZpbGw9IiM5OTkiPldJTk5FUjwvdGV4dD4KPHN2Zz4='} 
            alt={champion.name} 
            width="200" 
          />
          <h2>{champion.name}</h2>
          <h3>{champion.artist}</h3>
          {champion.preview_url && (
            <audio controls src={champion.preview_url}></audio>
          )}
        </div>
        <button onClick={onBack}>Nowy turniej</button>
      </div>
    );
  }

  if (currentRound.length < 2) {
    return <div>Potrzebujesz przynajmniej 2 piosenki do turnieju!</div>;
  }

  const track1 = currentRound[currentPair * 2];
  const track2 = currentRound[currentPair * 2 + 1];

  if (!track1 || !track2) {
    return <div>Ładowanie następnej rundy...</div>;
  }

  return (
    <div className="tournament">
      <h1>Turniej Muzyczny - Runda {roundNumber}</h1>
      <p>Wybierz lepszą piosenkę ({currentPair + 1}/{Math.floor(currentRound.length / 2)})</p>
      
      <div className="battle">
        <div className="track-option" onClick={() => selectWinner(track1)}>
          <img 
            src={track1.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTkiPk5PIElNQUdFPC90ZXh0Pgo8L3N2Zz4='} 
            alt={track1.name} 
            width="150" 
          />
          <h3>{track1.name}</h3>
          <p>{track1.artist}</p>
          {track1.preview_url ? (
            <audio controls src={track1.preview_url}></audio>
          ) : (
            <p style={{color: '#666', fontSize: '0.8em'}}>Brak podglądu</p>
          )}
        </div>
        
        <div className="vs">VS</div>
        
        <div className="track-option" onClick={() => selectWinner(track2)}>
          <img 
            src={track2.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjE0cHgiIGZpbGw9IiM5OTkiPk5PIElNQUdFPC90ZXh0Pgo8L3N2Zz4='} 
            alt={track2.name} 
            width="150" 
          />
          <h3>{track2.name}</h3>
          <p>{track2.artist}</p>
          {track2.preview_url ? (
            <audio controls src={track2.preview_url}></audio>
          ) : (
            <p style={{color: '#666', fontSize: '0.8em'}}>Brak podglądu</p>
          )}
        </div>
      </div>
      
      <button onClick={onBack}>Powrót</button>
    </div>
  );
};

export default Tournament;
import React, { useState, useEffect } from 'react';
import TournamentBracket from './TournamentBracket';
import type { Track } from '../types/spotify';

interface TournamentProps {
  tracks: Track[];
  onBack: () => void;
}

interface RoundHistory {
  roundNumber: number;
  pairs: { track1: Track; track2: Track; winner: Track }[];
}

const Tournament: React.FC<TournamentProps> = ({ tracks, onBack }) => {
  const [currentRound, setCurrentRound] = useState<Track[]>([]);
  const [currentPair, setCurrentPair] = useState<number>(0);
  const [winners, setWinners] = useState<Track[]>([]);
  const [champion, setChampion] = useState<Track | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [tournamentHistory, setTournamentHistory] = useState<RoundHistory[]>([]);
  const [eliminatedTracks, setEliminatedTracks] = useState<Track[]>([]);

  useEffect(() => {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setCurrentRound(shuffled);
  }, [tracks]);

  const selectWinner = (winner: Track): void => {
    const track1 = currentRound[currentPair * 2];
    const track2 = currentRound[currentPair * 2 + 1];
    const loser = winner.id === track1.id ? track2 : track1;

    setEliminatedTracks(prev => [...prev, loser]);

    setTournamentHistory(prev => {
      const existingRound = prev.find(h => h.roundNumber === roundNumber);
      if (existingRound) {
        const pairExists = existingRound.pairs.some(p => 
          (p.track1.id === track1.id && p.track2.id === track2.id) ||
          (p.track1.id === track2.id && p.track2.id === track1.id)
        );
        if (!pairExists) {
          existingRound.pairs.push({ track1, track2, winner });
        }
        return [...prev];
      } else {
        return [...prev, {
          roundNumber,
          pairs: [{ track1, track2, winner }]
        }];
      }
    });

    setWinners([...winners, winner]);
    setCurrentPair(currentPair + 1);

    if (currentPair + 1 >= Math.floor(currentRound.length / 2)) {
      const roundWinners = [...winners, winner];
      
      if (roundWinners.length === 1) {
        setChampion(roundWinners[0]);
      } else {
        let nextRound = [...roundWinners];
        
        if (nextRound.length % 2 !== 0 && eliminatedTracks.length > 0) {
          const randomLoser = eliminatedTracks[Math.floor(Math.random() * eliminatedTracks.length)];
          nextRound.push(randomLoser);
          
          setEliminatedTracks(prev => prev.filter(t => t.id !== randomLoser.id));
        }
        
        setCurrentRound(nextRound);
        setCurrentPair(0);
        setWinners([]);
        setRoundNumber(roundNumber + 1);
      }
    }
  };

  const resetTournament = (): void => {
    const shuffled = [...tracks].sort(() => Math.random() - 0.5);
    setCurrentRound(shuffled);
    setCurrentPair(0);
    setWinners([]);
    setChampion(null);
    setRoundNumber(1);
    setTournamentHistory([]);
    setEliminatedTracks([]);
  };

  const track1 = currentRound[currentPair * 2];
  const track2 = currentRound[currentPair * 2 + 1];

  if (champion) {
    return (
      <div className="tournament-finished">
        <div className="champion">
          <h2>🏆 CHAMPION! 🏆</h2>
          <div className="champion-card">
            <img src={champion.image} alt={champion.name} />
            <div className="champion-info">
              <div className="champion-name">{champion.name}</div>
              <div className="champion-artist">{champion.artist}</div>
            </div>
          </div>
          <button onClick={resetTournament} className="new-tournament-btn">
            Nowy turniej
          </button>
        </div>
        
        <TournamentBracket history={tournamentHistory} champion={champion} />
        
        <button onClick={onBack} className="new-tournament-btn">
          Wróć do wyboru źródeł
        </button>
      </div>
    );
  }

  if (!track1 || !track2) {
    return <div>Ładowanie...</div>;
  }

  return (
    <div className="tournament">
      <h2>Turniej: Runda {roundNumber}</h2>
      <p>Mecz {currentPair + 1} z {Math.floor(currentRound.length / 2)}</p>
      
      {/* Pokaż listę przegranych jeśli są */}
      {/* {eliminatedTracks.length > 0 && (
        <div style={{ 
          fontSize: '12px', 
          color: '#666', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px'
        }}>
          Przegrani ({eliminatedTracks.length}): {eliminatedTracks.map(t => t.name).join(', ')}
        </div>
      )} */}
      
      <div className="battle">
        <div className="track-option" onClick={() => selectWinner(track1)}>
          <img src={track1.image} alt={track1.name} />
          <h3>{track1.name}</h3>
          <p>{track1.artist}</p>
        </div>
        
        <div className="vs">VS</div>
        
        <div className="track-option" onClick={() => selectWinner(track2)}>
          <img src={track2.image} alt={track2.name} />
          <h3>{track2.name}</h3>
          <p>{track2.artist}</p>
        </div>
      </div>
      
      <button onClick={onBack} className="new-tournament-btn">
        Wróć do wyboru źródeł
      </button>
    </div>
  );
};

export default Tournament;
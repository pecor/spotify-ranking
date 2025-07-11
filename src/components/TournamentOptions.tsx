import React, { useState } from 'react';
import type { Track } from '../types/spotify';

interface TournamentOptionsProps {
  tracks: Track[];
  onStartTournament: (tracks: Track[]) => void;
  onBack: () => void;
}

const TournamentOptions: React.FC<TournamentOptionsProps> = ({ tracks, onStartTournament, onBack }) => {
  const [selectedOption, setSelectedOption] = useState<'keep' | 'pad'>('keep');

  const getNextPowerOf2 = (n: number): number => {
    return Math.pow(2, Math.ceil(Math.log2(n)));
  };

  const padTracksTo2Power = (originalTracks: Track[]): Track[] => {
    const targetCount = getNextPowerOf2(originalTracks.length);
    const neededTracks = targetCount - originalTracks.length;
    
    if (neededTracks === 0) return originalTracks;
    
    const paddedTracks = [...originalTracks];
    const shuffledOriginals = [...originalTracks].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < neededTracks; i++) {
      const trackToAdd = shuffledOriginals[i % shuffledOriginals.length];
      
      let canAdd = true;
      const currentRoundSize = Math.floor(paddedTracks.length / 2) * 2;
      
      for (let j = currentRoundSize; j < paddedTracks.length; j += 2) {
        if (paddedTracks[j] && paddedTracks[j].id === trackToAdd.id) {
          canAdd = false;
          break;
        }
        if (paddedTracks[j + 1] && paddedTracks[j + 1].id === trackToAdd.id) {
          canAdd = false;
          break;
        }
      }
      
      if (canAdd) {
        paddedTracks.push(trackToAdd);
      } else {
        const alternativeTrack = shuffledOriginals.find(t => {
          let isAlternativeOk = true;
          for (let j = currentRoundSize; j < paddedTracks.length; j += 2) {
            if (paddedTracks[j] && paddedTracks[j].id === t.id) {
              isAlternativeOk = false;
              break;
            }
            if (paddedTracks[j + 1] && paddedTracks[j + 1].id === t.id) {
              isAlternativeOk = false;
              break;
            }
          }
          return isAlternativeOk;
        });
        
        paddedTracks.push(alternativeTrack || trackToAdd);
      }
    }
    
    return paddedTracks;
  };

  const handleStart = () => {
    const finalTracks = selectedOption === 'pad' ? padTracksTo2Power(tracks) : tracks;
    onStartTournament(finalTracks);
  };

  const nextPowerOf2 = getNextPowerOf2(tracks.length);

  return (
    <div className="tournament-options">
      <h2>Opcje Turnieju</h2>
      <p>Wybrane piosenki: <strong>{tracks.length}</strong></p>
      
      <div className="options">
        <label className="option">
          <input
            type="radio"
            name="tournament-type"
            value="keep"
            checked={selectedOption === 'keep'}
            onChange={() => setSelectedOption('keep')}
          />
          <div>
            <strong>Zostaw jak jest ({tracks.length} piosenek)</strong>
            <p>Turniej z obecną liczbą piosenek. Niektóre rundy mogą być niesymetryczne.</p>
          </div>
        </label>
        
        <label className="option">
          <input
            type="radio"
            name="tournament-type"
            value="pad"
            checked={selectedOption === 'pad'}
            onChange={() => setSelectedOption('pad')}
          />
          <div>
            <strong>Dopełnij do {nextPowerOf2} piosenek</strong>
            <p>Niektóre piosenki pojawią się wielokrotnie, ale nie w tej samej rundzie. Turniej będzie symetryczny.</p>
            {nextPowerOf2 > tracks.length && (
              <small>Zostanie dodanych {nextPowerOf2 - tracks.length} dodatkowych piosenek</small>
            )}
          </div>
        </label>
      </div>
      
      <div className="tournament-actions">
        <button onClick={onBack} className="back-btn">
          Wróć do wyboru piosenek
        </button>
        <button onClick={handleStart} className="start-tournament-btn">
          Rozpocznij turniej
        </button>
      </div>
    </div>
  );
};

export default TournamentOptions;
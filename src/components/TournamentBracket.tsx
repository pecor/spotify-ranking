import React from 'react';
import type { Track } from '../types/spotify';

interface RoundHistory {
  roundNumber: number;
  pairs: { track1: Track; track2: Track; winner: Track }[];
}

interface TournamentBracketProps {
  history: RoundHistory[];
  champion: Track;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ history, champion }) => {
  const sortedHistory = [...history].sort((a, b) => a.roundNumber - b.roundNumber);
  
  // Finał (ostatnia runda) idzie do środka
  const finalRound = sortedHistory[sortedHistory.length - 1];
  const otherRounds = sortedHistory.slice(0, -1); // Wszystkie rundy OPRÓCZ finału
  
  // Podział pozostałych rund między lewą i prawą stronę
  const leftRounds: RoundHistory[] = [];
  const rightRounds: RoundHistory[] = [];
  
  otherRounds.forEach(round => {
    const totalPairs = round.pairs.length;
    const leftPairsCount = Math.ceil(totalPairs / 2);
    
    // Lewa strona - pierwsza połowa par
    leftRounds.push({
      roundNumber: round.roundNumber,
      pairs: round.pairs.slice(0, leftPairsCount)
    });
    
    // Prawa strona - druga połowa par (NIE odwracaj kolejności par)
    rightRounds.push({
      roundNumber: round.roundNumber,
      pairs: round.pairs.slice(leftPairsCount)
    });
  });

  // ODWRÓĆ kolejność rund po prawej stronie (żeby było lustrzane)
  const reversedRightRounds = rightRounds.reverse();

  const BracketSeed = ({ track, isWinner }: { track: Track; isWinner: boolean }) => (
    <div className={`bracket-seed ${isWinner ? 'winner' : 'loser'}`}>
      <img src={track.image} alt={track.name} />
      <div className="seed-info">
        <div className="seed-name">{track.name}</div>
        <div className="seed-artist">{track.artist}</div>
      </div>
    </div>
  );

  return (
    <div className="tournament-bracket">
      <h3>Tournament Bracket</h3>
      
      {/* CHAMPION - WYCIĄGNIĘTY Z BRACKET-CENTER */}
      {/* <div className="champion-final">
        <h4>🏆 CHAMPION 🏆</h4>
        <div className="champion-card">
          <img src={champion.image} alt={champion.name} />
          <div className="champion-info">
            <div className="champion-name">{champion.name}</div>
            <div className="champion-artist">{champion.artist}</div>
          </div>
        </div>
      </div> */}
      
      <div className="bracket-wrapper">
        {/* Lewa strona - rundy 1, 2, 3...*/}
        <div className="bracket-side bracket-left">
          <div className="bracket-rounds">
            {leftRounds.map((round, roundIndex) => (
              <div key={`left-${roundIndex}`} className="bracket-round">
                <div className="round-label">Runda {round.roundNumber}</div>
                {round.pairs.map((pair, pairIndex) => (
                  <div key={`left-${round.roundNumber}-${pairIndex}`} className="bracket-match">
                    <BracketSeed track={pair.track1} isWinner={pair.winner.id === pair.track1.id} />
                    <BracketSeed track={pair.track2} isWinner={pair.winner.id === pair.track2.id} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Środek - TYLKO FINAŁ */}
        <div className="bracket-center">
          <div className="final-round">
            <div className="round-label">FINAŁ - Runda {finalRound.roundNumber}</div>
            {finalRound.pairs.map((pair, pairIndex) => (
              <div key={`final-${pairIndex}`} className="bracket-match final-match">
                <BracketSeed track={pair.track1} isWinner={pair.winner.id === pair.track1.id} />
                <BracketSeed track={pair.track2} isWinner={pair.winner.id === pair.track2.id} />
              </div>
            ))}
          </div>
        </div>

        {/* Prawa strona - rundy w odwrotnej kolejności (..., 3, 2, 1) */}
        <div className="bracket-side bracket-right">
          <div className="bracket-rounds">
            {reversedRightRounds.map((round, roundIndex) => (
              <div key={`right-${roundIndex}`} className="bracket-round">
                <div className="round-label">Runda {round.roundNumber}</div>
                {round.pairs.map((pair, pairIndex) => (
                  <div key={`right-${round.roundNumber}-${pairIndex}`} className="bracket-match">
                    <BracketSeed track={pair.track1} isWinner={pair.winner.id === pair.track1.id} />
                    <BracketSeed track={pair.track2} isWinner={pair.winner.id === pair.track2.id} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
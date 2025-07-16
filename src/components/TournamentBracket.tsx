import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import type { Track } from '../types/spotify';
import './TournamentBracket.css';

interface RoundHistory {
  roundNumber: number;
  pairs: { track1: Track; track2: Track; winner: Track }[];
}

interface TournamentBracketProps {
  history: RoundHistory[];
  champion: Track;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ history, champion }) => {
  const bracketRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const downloadBracket = async () => {
    if (!bracketRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const originalStyle = bracketRef.current.style.cssText;
      
      bracketRef.current.style.cssText = `
        position: absolute;
        left: -9999px;
        top: 0;
        width: auto !important;
        height: auto !important;
        overflow: visible !important;
        max-width: none !important;
        max-height: none !important;
        margin: 0 !important;
        padding: 20px !important;
        background-color: #f9f9f9 !important;
        transform: none !important;
      `;
      
      const wrapperElements = bracketRef.current.querySelectorAll('.bracket-wrapper');
      const originalWrapperStyles: string[] = [];
      
      wrapperElements.forEach((element, index) => {
        const el = element as HTMLElement;
        originalWrapperStyles[index] = el.style.cssText;
        el.style.cssText = `
          width: auto !important;
          min-width: auto !important;
          max-width: none !important;
          overflow: visible !important;
          display: flex !important;
          gap: 30px !important;
          padding: 20px !important;
        `;
      });
      
      const columnElements = bracketRef.current.querySelectorAll('.bracket-side, .bracket-center');
      const originalColumnStyles: string[] = [];
      
      columnElements.forEach((element, index) => {
        const el = element as HTMLElement;
        originalColumnStyles[index] = el.style.cssText;
        el.style.cssText = `
          min-width: 350px !important;
          max-width: none !important;
          overflow: visible !important;
          flex-shrink: 0 !important;
        `;
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const canvas = await html2canvas(bracketRef.current, {
        backgroundColor: '#f9f9f9',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        width: bracketRef.current.scrollWidth,
        height: bracketRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        windowWidth: bracketRef.current.scrollWidth,
        windowHeight: bracketRef.current.scrollHeight,
      });
      
      bracketRef.current.style.cssText = originalStyle;
      
      wrapperElements.forEach((element, index) => {
        const el = element as HTMLElement;
        el.style.cssText = originalWrapperStyles[index];
      });
      
      columnElements.forEach((element, index) => {
        const el = element as HTMLElement;
        el.style.cssText = originalColumnStyles[index];
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const link = document.createElement('a');
      link.download = `tournament-bracket-${champion.name.replace(/[^a-zA-Z0-9]/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      
      console.log('Drabinka pobrana!', `${canvas.width}x${canvas.height}px`);
      
    } catch (error) {
      console.error('Błąd przy generowaniu obrazu:', error);
      alert('Nie udało się wygenerować obrazu. Spróbuj ponownie.');
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div>
      {/* Overlay ładowania */}
      {isGenerating && (
        <div className="bracket-loading-overlay">
          <div className="bracket-loading-content">
            <div className="bracket-loading-spinner"></div>
            <div className="bracket-loading-title">Generowanie drabinki...</div>
            <div className="bracket-loading-subtitle">Przygotowujemy obraz w wysokiej jakości</div>
            
            <div className="bracket-loading-steps">
              <div className="bracket-loading-step">
                <div className="bracket-loading-step-icon">1</div>
                <span>Przygotowanie layoutu</span>
              </div>
              <div className="bracket-loading-step">
                <div className="bracket-loading-step-icon">2</div>
                <span>Renderowanie wszystkich elementów</span>
              </div>
              <div className="bracket-loading-step">
                <div className="bracket-loading-step-icon">3</div>
                <span>Generowanie obrazu PNG</span>
              </div>
              <div className="bracket-loading-step">
                <div className="bracket-loading-step-icon">4</div>
                <span>Pobieranie pliku</span>
              </div>
            </div>
            
            <div className="bracket-loading-progress">
              <div className="bracket-loading-progress-bar"></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="tournament-bracket" ref={bracketRef}>
        <h3>Tournament Bracket</h3>
        
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
        
        <div className="bracket-wrapper" style={{ minWidth: `${300 * (leftRounds.length + reversedRightRounds.length + 1)}px` }}>
          {/* Lewa strona - rundy 1, 2, 3...*/}
          <div className="bracket-side bracket-left">
            <div className="bracket-rounds">
              {leftRounds.map((round, roundIndex) => (
                <div key={`left-${roundIndex}`} className="bracket-round">
                  {/* <div className="round-label">Runda {round.roundNumber}</div> */}
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
              {/* <div className="round-label">FINAŁ - Runda {finalRound.roundNumber}</div> */}
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
                  {/* <div className="round-label">Runda {round.roundNumber}</div> */}
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
      
      <div className="bracket-actions">
        <button 
          onClick={downloadBracket} 
          className="download-bracket-btn"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generowanie...' : '📥 Pobierz pełną drabinkę'}
        </button>
      </div>
    </div>
  );
};

export default TournamentBracket;
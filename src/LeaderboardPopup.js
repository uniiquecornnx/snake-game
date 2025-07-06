import React from 'react';
import './LeaderboardPopup.css';

const LeaderboardPopup = ({ leaderboard, playerName, score, onRestart, onClose }) => {
  const isNewHighScore = leaderboard.length > 0 && leaderboard[0].score === score;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <h2>🏆 Game Over!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="game-result">
          <p className="final-score">Final Score: <strong>{score} 🍎</strong></p>
          <p className="player-name">Player: <strong>{playerName}</strong></p>
          {isNewHighScore && (
            <p className="new-record">🎉 New High Score! 🎉</p>
          )}
        </div>

        <div className="leaderboard-section">
          <h3>🏆 Leaderboard</h3>
          {leaderboard.length === 0 ? (
            <p className="no-scores">No scores yet! You're the first to play!</p>
          ) : (
            <div className="scores-list">
              {leaderboard.map((entry, index) => (
                <div 
                  key={index} 
                  className={`score-entry ${entry.name === playerName && entry.score === score ? 'current-player' : ''}`}
                >
                  <span className="rank">#{index + 1}</span>
                  <span className="player-name">{entry.name}</span>
                  <span className="score-value">{entry.score} 🍎</span>
                  <span className="score-date">{entry.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="popup-actions">
          <button className="restart-btn" onClick={onRestart}>
            🐍 Play Again 🐍
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPopup; 
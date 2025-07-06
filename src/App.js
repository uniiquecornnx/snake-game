import React, { useState, useEffect } from 'react';
import './App.css';
import sdk from "@farcaster/frame-sdk";


const App = () => {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  // Load leaderboard from localStorage on component mount
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('snakeGameLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // Save leaderboard to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('snakeGameLeaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  // Update leaderboard when game ends
  useEffect(() => {
    if (isGameOver && score > 0) {
      const newScore = {
        name: playerName,
        score: score,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
      };
      
      const updatedLeaderboard = [...leaderboard, newScore]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10); // Keep only top 10 scores
      
      setLeaderboard(updatedLeaderboard);
    }
  }, [isGameOver, score, leaderboard, playerName]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) return;
      
      switch (e.key) {
        case 'ArrowUp':
          setDirection('UP');
          break;
        case 'ArrowDown':
          setDirection('DOWN');
          break;
        case 'ArrowLeft':
          setDirection('LEFT');
          break;
        case 'ArrowRight':
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  useEffect(() => {
    if (isGameOver || !gameStarted) return;

    const move = () => {
      const head = [...snake[snake.length - 1]];
      switch (direction) {
        case 'UP':
          head[1] -= 1;
          break;
        case 'DOWN':
          head[1] += 1;
          break;
        case 'LEFT':
          head[0] -= 1;
          break;
        case 'RIGHT':
          head[0] += 1;
          break;
        default:
          break;
      }

      if (head[0] < 0 || head[1] < 0 || head[0] >= 10 || head[1] >= 10) {
        setIsGameOver(true);
        return;
      }

      for (let part of snake) {
        if (part[0] === head[0] && part[1] === head[1]) {
          setIsGameOver(true);
          return;
        }
      }

      let newSnake = [...snake, head];

      if (head[0] === food[0] && head[1] === food[1]) {
        setFood([
          Math.floor(Math.random() * 10),
          Math.floor(Math.random() * 10)
        ]);
        setScore(score + 1);
      } else {
        newSnake.shift();
      }

      setSnake(newSnake);
    };

    const interval = setInterval(move, 200);
    return () => clearInterval(interval);
  }, [snake, direction, isGameOver, gameStarted]);

  const restartGame = () => {
    setSnake([[0, 0]]);
    setFood([5, 5]);
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setShowLeaderboard(false);
    setShowNameInput(true);
    setGameStarted(false);
  };

  const startGame = () => {
    if (playerName.trim()) {
      setShowNameInput(false);
    }
  };

  const startSnakeGame = () => {
    setGameStarted(true);
  };
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

useEffect(() => {
  const load = async () => {
    await sdk.context; // You can store this if you want context info
    sdk.actions.ready(); // This hides the loading screen in Farcaster
  };

  if (!isSDKLoaded) {
    setIsSDKLoaded(true);
    load();
  }
}, [isSDKLoaded]);

  return (
    <div className="game-container">
      <h1>Snake Game 🐍</h1>
      
      {showNameInput ? (
        <div className="name-input-screen">
          <h2>Enter Your Name</h2>
          <div className="name-input-container">
            <input
              type="text"
              placeholder="Enter your name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
              className="name-input"
              maxLength={20}
            />
            <button 
              onClick={startGame}
              disabled={!playerName.trim()}
              className="start-game-btn"
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <>
          <h2>Score: {score}</h2>
          <p className="player-info">Playing as: <strong>{playerName}</strong></p>
          
          {!gameStarted ? (
            <div className="game-start-screen">
              <div className="start-game-container">
                <h3>Ready to Play?</h3>
                <p>Click the button below to start the snake game!</p>
                <button 
                  onClick={startSnakeGame}
                  className="start-snake-btn"
                >
                  🐍 Start Snake Game 🐍
                </button>
              </div>
            </div>
          ) : (
            <div className="game-layout">
              <div className="game-section">
                <div className="board">
                  {[...Array(10)].map((_, row) => (
                    <div className="row" key={row}>
                      {[...Array(10)].map((_, col) => {
                        const isSnake = snake.some(([x, y]) => x === col && y === row);
                        const isFood = food[0] === col && food[1] === row;
                        return (
                          <div
                            key={col}
                            className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* 👇 Always visible controls */}
                <div className="controls">
                  <button 
                    onClick={() => setDirection('UP')}
                    disabled={!gameStarted}
                    className={!gameStarted ? 'disabled' : ''}
                  >
                    ⬆️
                  </button>
                  <div>
                    <button 
                      onClick={() => setDirection('LEFT')}
                      disabled={!gameStarted}
                      className={!gameStarted ? 'disabled' : ''}
                    >
                      ⬅️
                    </button>
                    <button 
                      onClick={() => setDirection('DOWN')}
                      disabled={!gameStarted}
                      className={!gameStarted ? 'disabled' : ''}
                    >
                      ⬇️
                    </button>
                    <button 
                      onClick={() => setDirection('RIGHT')}
                      disabled={!gameStarted}
                      className={!gameStarted ? 'disabled' : ''}
                    >
                      ➡️
                    </button>
                  </div>
                </div>
              </div>

            <div className="leaderboard-section">
              <div className="leaderboard-header">
                <h3>🏆 Leaderboard</h3>
                <button 
                  className="toggle-leaderboard"
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                >
                  {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
                </button>
              </div>
              
              {showLeaderboard && (
                <div className="leaderboard">
                  {leaderboard.length === 0 ? (
                    <p className="no-scores">No scores yet! Play to set a record!</p>
                  ) : (
                    <div className="scores-list">
                      {leaderboard.map((entry, index) => (
                        <div key={index} className="score-entry">
                          <span className="rank">#{index + 1}</span>
                          <span className="player-name">{entry.name}</span>
                          <span className="score-value">{entry.score} 🍎</span>
                          <span className="score-date">{entry.date}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          )}

          {isGameOver && (
            <div className="game-over">
              <h2>Game Over!!!!</h2>
              <p>Final Score: {score} 🍎</p>
              <p>Player: <strong>{playerName}</strong></p>
              {leaderboard.length > 0 && leaderboard[0].score === score && (
                <p className="new-record">🎉 New High Score! 🎉</p>
              )}
              <button onClick={restartGame}>Restart</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;

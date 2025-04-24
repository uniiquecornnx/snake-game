import React, { useState, useEffect } from 'react';
import './App.css';
import sdk from "@farcaster/frame-sdk";
import { useEffect, useState } from "react";


const App = () => {
  const [snake, setSnake] = useState([[0, 0]]);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
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
  }, []);

  useEffect(() => {
    if (isGameOver) return;

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
  }, [snake, direction, isGameOver]);

  const restartGame = () => {
    setSnake([[0, 0]]);
    setFood([5, 5]);
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
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
      <h2>Score: {score}</h2>
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
        <button onClick={() => setDirection('UP')}>⬆️</button>
        <div>
          <button onClick={() => setDirection('LEFT')}>⬅️</button>
          <button onClick={() => setDirection('DOWN')}>⬇️</button>
          <button onClick={() => setDirection('RIGHT')}>➡️</button>
        </div>
      </div>

      {isGameOver && (
        <div className="game-over">
          <h2>Game Over!!!!</h2>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;

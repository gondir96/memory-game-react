// Game.js
import React, { useState, useEffect } from 'react';
import GameBoard from './GameBoard';

const Game = () => {
  const [totalPairs, setTotalPairs] = useState(6); // Default to 6 pairs
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [currentTries, setCurrentTries] = useState(0);
  const [bestScore, setBestScore] = useState(Number.MAX_SAFE_INTEGER); // New state for Best Score
  const [isFlipping, setIsFlipping] = useState(false);

  // Helper function to shuffle an array
  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Function to load card images
  const loadCardImages = async (totalPairs) => {
    const cardImages = [];
    for (let i = 1; i <= totalPairs; i++) {
      const response = await fetch(`cards/${i}.png`);
      const blob = await response.blob();
      cardImages.push(URL.createObjectURL(blob));
    }
    return cardImages;
  };

  // Function to handle card click
  const handleCardClick = (id) => {
    // Don't allow clicking if an animation is in progress
    if (isFlipping) {
      return;
    }

    const flippedCard = cards.find((card) => card.id === id);

    if (flippedCards.length === 1) {
      const newCards = cards.map((card) =>
        card.id === id ? { ...card, flipped: true } : card
      );
      setFlippedCards((prevFlipped) => [...prevFlipped, flippedCard]);
      setCards(newCards);
      setIsFlipping(true);

      if (flippedCard.id !== flippedCards[0].id) {
        setTimeout(() => {
          const newFlippedCards = cards.map((c) =>
            c.id === id || c.id === flippedCards[0].id
              ? { ...c, flipped: false }
              : c
          );
          setFlippedCards([]);
          setIsFlipping(false);

          if (flippedCard.image !== flippedCards[0].image) {
            setCards(newFlippedCards);
          }
        }, 1000);
      } else {
        setFlippedCards([]);
        setIsFlipping(false);

        // Check if all cards are flipped
        const allFlipped = newCards.every((card) => card.flipped);
        if (allFlipped) {
          startNewGame();
        }
      }
    } else {
      const newCards = cards.map((card) =>
        card.id === id ? { ...card, flipped: true } : card
      );
      setFlippedCards([flippedCard]);
      setCards(newCards);
      setCurrentTries((prevTries) => prevTries + 1); // Increment the counter
    }
  };

  // Function to start a new game
  const startNewGame = async () => {
    // Check if the current score is better than the best score
    if (currentTries < bestScore || bestScore === 0) {
      setBestScore(currentTries);
    }

    setCurrentTries(0);
    setIsFlipping(false);

    // Initialize cards array with pairs and shuffle
    const cardImages = await loadCardImages(totalPairs);
    const allCards = [];
    for (let i = 0; i < totalPairs; i++) {
      allCards.push({ id: i * 2, image: cardImages[i], flipped: false });
      allCards.push({ id: i * 2 + 1, image: cardImages[i], flipped: false });
    }
    const shuffledCards = shuffleArray(allCards);
    setCards(shuffledCards);
  };

  // Implement game logic (flipping cards, checking matches, etc.)
  useEffect(() => {
    // Check if all cards are flipped
    const allFlipped = cards.every((card) => card.flipped);

    if (allFlipped) {
      // Start a new game
      startNewGame();
    }
  }, [cards]);

  // Initial game setup
  useEffect(() => {
    startNewGame();
  }, [totalPairs]);

  // Function to handle "Reset" button click
  const handleResetClick = () => {
    startNewGame();
  };

  return (
    <div className="game-container">
      <div className="game-controls">
        <button onClick={handleResetClick}>Reset</button>
        <label htmlFor="pairsSelect">Pairs: </label>
        <select
          id="pairsSelect"
          value={totalPairs}
          onChange={(e) => setTotalPairs(parseInt(e.target.value))}
        >
          {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <GameBoard cards={cards} onCardClick={handleCardClick} />
      <div className="current-tries-counter">Current Tries: {currentTries}</div>
      <div className="best-score">Best Score: {bestScore}</div>
    </div>
  );
};

export default Game;

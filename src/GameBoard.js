// GameBoard.js
import React from 'react';
import Card from './Card';
import './GameBoard.css';

const GameBoard = ({ cards, onCardClick }) => {
  return (
    <div className="game-board">
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          image={card.image}
          flipped={card.flipped}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default GameBoard;

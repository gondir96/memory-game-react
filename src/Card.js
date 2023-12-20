// Card.js
import React from 'react';
import './Card.css';

const Card = ({ id, image, flipped, onClick }) => {
  return (
    <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => onClick(id)}>
      {flipped && <img src={image} alt={`card-${id}`} />}
    </div>
  );
};

export default Card;

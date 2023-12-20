// App.js
import React from 'react';
import Game from './Game';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Card Matching Game</h1>
      <Game totalPairs={6} />
    </div>
  );
}

export default App;

import React from 'react';
import Hangman from './Components/Hangman/Hangman';
import Header from './Components/Header/Header';
import './App.css'

function App() {
  return (
    <div className="App">
      <Header/>
      <Hangman />
    </div>
  );
}

export default App;

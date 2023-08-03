import React, { useState, useEffect } from 'react';
import './Hangman.css'
import image0 from './images/0.png';
import image1 from './images/1.png';
import image2 from './images/2.png';
import image3 from './images/3.png';
import image4 from './images/4.png';
import image5 from './images/5.png';
import image6 from './images/6.png';
import image7 from './images/7.png';

const Hangman = () => {
  let mistakesMax = 7;
  // use a state to store letters which have already been guessed
  const [guessedLetters, setGuessLetters] = useState([]);
  const [word, setWord] = useState('');
  const [currentMistakes, setCurrentMistakes] = useState(0);
  // wordState is used for our array of underscores
  const [wordState, setWordState] = useState([]);
  const [guess, setGuess] = useState('');
  // use empty dependecy array [], such that useEffect is only called once.
  useEffect(() => { retrieveWord(); }, []);

  async function retrieveWord() {
    const response = await fetch("https://random-words-api.vercel.app/word/");
    if(response.status === 400){
        console.log("Error while retrieving word from API.")
    }
    else{
        const data = await response.json();
        const randomWord = data[0].word.toLowerCase();
        const definition = data[0].definition;
        setWord(randomWord);
        setWordState(Array(randomWord.length).fill('_'));
        console.log(randomWord);
        console.log(definition);
        // use Template Literals to include variables into a string
        document.querySelector(".definition").innerHTML = `Definition: ${definition}`;

    }
  }

  const imagesArray = [
    image0,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7
  ]

  function handleGuess() {
    const isLetter = /^[a-zA-Z]$/.test(guess);
  
    if (!isLetter) {
      console.log("Invalid input. Please enter an alphabet.");
      setGuess('');
      return;
    }
  
    if (!guessedLetters.includes(guess)) {
      guessedLetters.push(guess);
      setGuessLetters(guessedLetters);
      console.log(guessedLetters);
  
      if (word.includes(guess)) {
        const updatedWordState = wordState.map((letter, index) =>
          word[index] === guess ? guess : letter
        );
        setWordState(updatedWordState);
        console.log(updatedWordState);
  
        if (!updatedWordState.includes('_')) {
          console.log("You Win!");
          displayResult("You Won! :)");
          return;
        }
      } else {
        setCurrentMistakes(currentMistakes => currentMistakes + 1);
        document.querySelector(".hangmanDrawing").src = imagesArray[currentMistakes+1];
      }
      if (currentMistakes >= mistakesMax-1) {
        console.log("You Lose!");
        displayResult("Game Over!");
      }
    }
    setGuess('');
  }
  
  // Allows use of Enter key instead of clicking on Guess Button
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleGuess();
    }
  };

  const refreshPage = () => {
    window.location.reload(false);
  }
  const displayResult = (message) => {
    document.querySelector(".endGame").style.border = "1px solid black";
    document.querySelector(".endGame").style.borderRadius = "14px";
    document.querySelector(".resultText").innerHTML = message;  
    document.querySelector(".resultText").style.display = "block";     
    document.querySelector(".wordReveal").style.display = "block";   
    document.querySelector(".retryButton").style.display = "block";   
    document.querySelector(".definition").style.display = "block";
    document.querySelector(".endGame").scrollIntoView();
    document.querySelector(".inputDiv").style.display = "none";     

  }

  return (
    <div className = "gameContainer">
        <div>
            Current Mistakes : {currentMistakes} <br/>
        </div>
        <div>
          (7 Mistakes = Lose)
        </div>
        
      {/* Add Hangman drawing here */}
        <div className='hangmanDrawingDiv'>
          <img src = {image0} alt = "placeholder img" className='hangmanDrawing'/>
        </div>
        <div>
            Guessed Letters : {guessedLetters.join(' ')}
        </div>
        <div>
            Word : {wordState.join(' ')}
        </div>
      <div className='inputDiv'>
        <input type="text" value={guess}  onChange={(e) => setGuess(e.target.value)} maxLength={1} placeholder='Enter Guess Here' className='inputBar' onKeyDown ={handleKeyDown}/>
        <button onClick={handleGuess} className='guessButton'>Guess</button>
      </div>
      
      <div className='endGame'>
        <div className='resultText'>
          placeholder result
        </div>
        <div className='wordReveal'>
          The word was: "{word}" <br/>
        </div>
        <div className='definition'>
          placeholder definition
        </div>
        <button onClick = {refreshPage} className='retryButton'> Play Again? </button>
      </div>
      
    </div>
  );
};

export default Hangman;

import React, { useState, useEffect, useRef } from "react";
import "./Hangman.css"
import image0 from "./images/0.png";
import image1 from "./images/1.png";
import image2 from "./images/2.png";
import image3 from "./images/3.png";
import image4 from "./images/4.png";
import image5 from "./images/5.png";
import image6 from "./images/6.png";
import image7 from "./images/7.png";
import winMP3 from "./win.mp3";
import loseMP3 from "./lose.mp3";
import Popup from "./Popup";

const Hangman = () => {
  let mistakesMax = 7;
  // use a state to store letters which have already been guessed
  const [guessedLetters, setGuessLetters] = useState([]);
  const [word, setWord] = useState("");
  const [currentMistakes, setCurrentMistakes] = useState(0);
  // wordState is used for our array of underscores
  const [wordState, setWordState] = useState([]);
  const [guess, setGuess] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [category, setCategory] = useState("");

  const inputDivRef = useRef(null);

  useEffect(() => { retrieveWordAndDefinition(); }, []);
  useEffect(() => {
    console.log("showPopup state changed: ", showPopup);
  }, [showPopup]);

  async function retrieveWordAndDefinition() {
    const roll = Math.floor(Math.random() * 3);
    let url;
    switch(roll){
      case 0:
        url = "https://random-word-form.herokuapp.com/random/noun";
        setCategory('nouns');
        break;
      case 1:
        url = "https://random-word-form.herokuapp.com/random/adjective";
        setCategory('adjectives');
        break;
      default:
        url = "https://random-word-form.herokuapp.com/random/animal;";
        setCategory('animals');
        break;
    }
    const response = await fetch(url);
    if (response.status === 400) {
      console.log("Error while retrieving word from API.");
    } else {
      const data = await response.json();
      const randomWord = data[0].toLowerCase();
      console.log(category, randomWord);
      setWord(randomWord);
      setWordState(Array(randomWord.length).fill("_"));
      // Fetch definition after setting the word
      const dictResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
      const dictData = await dictResponse.json();
      if(dictData.title === "No Definitions Found") {
        console.log(dictData.title);
        document.querySelector(".definition").innerHTML = `Definition: ${dictData.title}`;
      }
      else{
        const definition = dictData[0].meanings[0].definitions[0].definition;
        console.log(definition);
        document.querySelector(".definition").innerHTML = `Definition: ${definition}`;
      }
    }
  }

  const winAudioPlay = () => {
    const winAudio = new Audio(winMP3);
    winAudio.volume = 0.1;
    winAudio.play();
  }

  const loseAudioPlay = () => {
    const loseAudio = new Audio(loseMP3);
    loseAudio.volume = 0.1;
    loseAudio.play();
  }

  const handleInvalidInput = () =>{
    console.log("invalid input, pop up should appear");
    setShowPopup(true);
    setGuess("");
    return;
  }

  // Close popup when user clicks outside of it
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (inputDivRef.current && !inputDivRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };
    document.body.addEventListener('click', handleOutsideClick);

    return () => {
      document.body.removeEventListener('click', handleOutsideClick);
    };
  }, []);
  
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
      handleInvalidInput();
      return;
    }
    setShowPopup(false);
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
  
        if (!updatedWordState.includes("_")) {
          console.log("You Win!");
          displayResult("You Win! :)");
          winAudioPlay();
          return;
        }
      } else {
        setCurrentMistakes(currentMistakes => currentMistakes + 1);
        document.querySelector(".hangmanDrawing").src = imagesArray[currentMistakes+1];
      }
      if (currentMistakes >= mistakesMax-1) {
        console.log("You Lose!");
        displayResult("Game Over!");
        loseAudioPlay();
      }
    }
    setGuess("");
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
    document.querySelector(".endGame").style.backgroundColor  = "#ffffffc7";
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
      <div className = "mistakesDiv">
        Current Mistakes : {currentMistakes} <br/>
        (7 Mistakes = Lose)
      </div>
      <div className="hangmanDrawingDiv">
        <img src = {image0} alt = "placeholder img" className="hangmanDrawing"/>
      </div>
      <div className = "guessedDiv">
          Guessed Letters : {guessedLetters.join(" ")} <br/>
          Hint: Category is {category} <br/>
          Word : {wordState.join(" ")}
      </div>
      <div className="inputDiv" ref={inputDivRef}>
        {showPopup && <Popup message="Invalid input. Please enter an alphabet." />}
        <input type="text" value={guess}  onChange={(e) => setGuess(e.target.value)} maxLength={1} placeholder="Enter Guess Here" className="inputBar" onKeyDown ={handleKeyDown}/>
        <button onClick={handleGuess} className="guessButton">Guess</button>
      </div>
      <div className="endGame">
        <div className="resultText">
          placeholder result
        </div>
        <div className="wordReveal">
          The word was: "{word}" <br/>
        </div>
        <div className="definition">
          placeholder definition
        </div>
        <button onClick = {refreshPage} className="retryButton"> Play Again? </button>
      </div>
      
    </div>
  );
};

export default Hangman;

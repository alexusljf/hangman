import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareGithub } from '@fortawesome/free-brands-svg-icons'
import './Header.css';

const Header = () =>{
    return(
        <div className='header'>
            <div className='left'>
                <h1 className='hangmanTitle'>
                    Hangman
                </h1>
            </div>
            <div className='right'>
                <a href = "https://github.com/alexusljf" target = "_blank">
                    <FontAwesomeIcon icon = {faSquareGithub} className = 'githubIcon'/>
                </a>
            </div>
        </div>
    )
}
export default Header;
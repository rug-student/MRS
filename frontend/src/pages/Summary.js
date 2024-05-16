import React from 'react';
import './Summary.css'; // Assicurati di importare il file CSS per lo stile
import Header from './HeaderLoggedIn.js';


function OpenQuestionSummary({ question, onSubmit }) {
  return (
    <div>
      <Header/>
      <div id="head1">      
        <h1 className="subtitle1">Summary</h1>
        <p>Question: {question}</p>
        <button className="submit-button" onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
}


function ClosedQuestionSummary({ question, options, onSubmit }) {
  return (
    <div>
      <Header/>
      <div id="head1">      
        <h1 className="subtitle1">Summary</h1>
        <p>Question: {question}</p>
        <p>Options:</p>
        <ul>
          {options.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
        <button className="submit-button" onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
}

export { OpenQuestionSummary, ClosedQuestionSummary };

import React, { useState } from 'react';
import './login.css';
import Header from './HeaderLoggedIn.js'

function InsertQuestion({ onNext }) {
  const [question, setQuestion] = useState('');
  const [placeholder, setPlaceholder] = useState('Enter your question');

  const handleNext = () => {
    onNext(question);
  };

  const handleInputFocus = () => {
    setPlaceholder('');
  };

  const handleInputBlur = () => {
    if (question === '') {
      setPlaceholder('Enter your question');
    }
  };

  return (
    <div>
      <Header/>
      <div className="centered-container">
        <div className="form-container" id="uno">
          <h1 className="subtitle">New Question</h1>
          <input
            className="inbar"
            type="text"
            placeholder={placeholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <button className="b" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}

function SelectType({ onTypeSelected }) {
  return (
    <div>
      <Header />
      <div className="centered-container">
        <div className="form-container">
          <h1 className="subtitle">Question Type</h1>
          <button id="firstbutton" onClick={() => onTypeSelected(true)}>Open Question</button>
          <button id="secondbutton" onClick={() => onTypeSelected(false)}>Closed Question</button>
        </div>
      </div>
    </div>
  );
}

function InsertOptions({ options, onOptionsChange, onNext }) {
  const handleAddOption = () => {
    if (options.length < 10) {
      onOptionsChange([...options, '']);
    } else {
      alert('You cannot add more than 10 options.');
    }
  };

  return (
    <div> 
      <Header/>
      <div className="centered-container">
        <div className="form-container">
          <h1 className="subtitle">Insert Options</h1>
          {options.map((option, index) => (
            <div key={index}>
              <input id = "inoption"
                type="text"
                placeholder={"Add a new option"}
                value={option || ''}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  onOptionsChange(newOptions);
                }}
              />
            </div>
          ))}
          <button onClick={handleAddOption}>Add Option</button>
          <button id="secondbutton" onClick={onNext}>Next</button>
        </div>
      </div>
    </div>
  );
}

function Summary({ question, options, onSubmit }) {
  return (
    <div>
      <Header/>
      <div className="centered-container">
        <div className="form-container">
          <h1 className="subtitle">Summary</h1>
          <p>Question: {question}</p>
          {options.length > 0 && (
            <div>
              <p>Options:</p>
              <ul>
                {options.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          )}
          <button id="thirdutton" onClick={onSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
}

function NewQuestionPage() {
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState('');
  const [isOpen, setIsOpen] = useState(null);
  const [options, setOptions] = useState([]);


  const handleQuestionNext = (questionData) => {
    setQuestion(questionData);
    setStep(2); // Torna alla prima schermata
  };

  const handleTypeSelected = (open) => {
    setIsOpen(open);
    setStep(3); // Torna alla prima schermata
  };

  const handleOptionsNext = () => {
    setStep(3); // Torna alla prima schermata
  };

  const handleSubmit = () => {
    console.log('New question data:', { question, isOpen, options });
    // Esegui la logica per la gestione del submit...
    setStep(1); // Torna alla prima schermata
  };

  return (
    <>
      {step === 1 && <InsertQuestion onNext={handleQuestionNext} />}
      {step === 2 && <SelectType onTypeSelected={handleTypeSelected} />}
      {step === 3 && isOpen === true && (
        <Summary question={question} options={options} onSubmit={handleSubmit}/>
      )}
      {step === 3 && isOpen === false && (
        <InsertOptions options={options} onOptionsChange={setOptions} onNext={handleOptionsNext} />
      )}
      {step === 4 && isOpen === false &&(  <Summary question={question} options={options} onSubmit={handleSubmit}/>)}
    </>
  );
}

export default NewQuestionPage;

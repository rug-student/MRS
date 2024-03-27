import React, { useState } from 'react';
import './login.css';
import Header from './HeaderLoggedIn.js'


function InsertQuestion({ onNext }) {
  
  const [question, setQuestion] = useState('');

  const handleNext = () => {
    onNext(question);
  };

  return (
    <div>
      <Header/>
      <div className="centered-container">
        <div className="form-container">
          <h1 className="subtitle">New Question</h1>
          <style>
        {`
          .subtitle {
            transform: translate(0, -30px);
            margin:0 auto;
          }
          
        `}
      </style>
          
          <div>
            <label className="littletext">Enter your question: </label>
            <style>
        {`
          .littletext {
            transform: translate(0, -30px);
            margin: 0 auto;
            color:grey;
            font-size:12px;
          }
          
        `}
      </style>
            <input className="inbar"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
                <style>
        {`
          .inbar {
            transform: translate(-112px, -0);
            margin: 0 auto;
          }
          
        `}
      </style>
            <button className="b" onClick={handleNext}>Next</button>
            <style>
        {`
          .b {
            transform: translate(-100px, -0);
            margin: 0 auto;
          }
          
        `}
      </style>
          </div>
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
          <h1 className="subtitle">  Question Type</h1>
          <div>
            <button onClick={() => onTypeSelected(true)}>Open Question</button>
            <button id="secondbutton" onClick={() => onTypeSelected(false)}>Closed Question</button>
          </div>
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
          <div>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
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
    </div>
  );
}

function Summary({ question, options, onSubmit }) {
  return (
    <div>
      <Header/>
      <div className="centered-container">
        <div className="form-container">
          <h1>Summary</h1>
          <div>
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
            <button onClick={onSubmit}>Submit</button>
          </div>
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

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleQuestionNext = (questionData) => {
    setQuestion(questionData);
    handleNextStep();
  };

  const handleTypeSelected = (open) => {
    setIsOpen(open);
    handleNextStep();
  };

  const handleOptionsNext = () => {
    handleNextStep();
  };


  // POST request 
  const handleSubmit = () => { 
    console.log('New question data:', { question, isOpen, options });
    fetch('localhost:8000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question_description: question, 
        is_open: isOpen,
        answers: options,
      })
    })
    .then(response => {
      if (response.ok) {
        console.log('Question created successfully');
      } else {
        console.error('Failed to create question');
      }
    })
    .catch(error => {
      // Handle network error
      console.error('Error occurred while creating question:', error);
    });
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
      {step === 4 && (
        <Summary question={question} options={options} onSubmit={handleSubmit} />
      )}
    </>
  );
}

export default NewQuestionPage;

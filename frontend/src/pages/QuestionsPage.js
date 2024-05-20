import React, { useState, useEffect } from 'react';
import './login.css';
import Header from './HeaderLoggedIn.js';
import InsertOptions from './InsertOptions';
import { OpenQuestionSummary, ClosedQuestionSummary } from './Summary';


function InsertQuestion({ onNext, onAddQuestion }) {
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

  const handleAddQuestion = () => {
    onAddQuestion(question);
    setQuestion('');
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

function DeleteQuestion({ questions, onDeleteQuestion }) {

  // loads questions into form upon page load
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Gets all the questions from the database
  const fetchQuestions = () => {
    fetch(`http://localhost:8000/api/questions?active=true`, {
      method: 'GET',
      headers: {
        'Accept' : 'application/json'
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch questions');
        }
      })
      .then(questions => {
        setSelectedQuestion(questions);
      })
      .catch(error => {
        console.error('Error occurred while fetching questions:', error);
      });
  };
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const handleDelete = () => {
    onDeleteQuestion(selectedQuestion);
    setSelectedQuestion('');
  };

  return (
    <div>
      <Header />
      <div className="centered-container">
        <div className="form-container" id="uno">
          <h1 className="subtitle">Delete Question</h1>
          <select value={selectedQuestion} onChange={(e) => setSelectedQuestion(e.target.value)}>
            <option value="">Select a question to delete</option>
            {questions.map((question, index) => (
              <option key={index} value={question}>{question}</option>
            ))}
          </select>
          <button className="b" id="delete" onClick={handleDelete}>Delete</button>
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


function NewQuestionPage() {
  const [step, setStep] = useState(0); // 0: initial, 1: add question, 2: delete question, 3: select question type
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isOpen, setIsOpen] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [options, setOptions] = useState([]);

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
    setOptions([]); 
    setStep(3); 
  };
  
  const handleDeleteQuestion = (question) => {
    const updatedQuestions = questions.filter(q => q !== question);
    setQuestions(updatedQuestions);
    setIsActive(0); // Imposta isActive a 0
    setStep(0); // Reimposta lo step a 0
  };

  const handleQuestionNext = (questionData) => {
    setCurrentQuestion(questionData);
    setStep(3); 
  };

  const handleTypeSelected = (open) => {
    setIsOpen(open);
    setStep(4); 
  };

  const handleOptionsNext = () => {
    setStep(5); 
  };
  
  const handleSubmit = () => {
      setStep(0)
      console.log('New question data:', { currentQuestion, isOpen, options,isActive });
      fetch(`${process.env.REACT_APP_API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_description: currentQuestion, 
          is_open: isOpen,
          answers: options,
          is_active: isActive,
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
      {step === 0 && (
        <div>
          <Header />
          <div className="centered-container">
            <div className="form-container" id="uno">
              <h1 className="subtitle">Select Action</h1>
              <button className="b" onClick={() => setStep(1)}>Add Question</button>
              <button className="b" id="delete" onClick={() => setStep(2)}>Delete Question</button>
            </div>
          </div>
        </div>
      )}
      {step === 1 && <InsertQuestion onNext={handleQuestionNext} onAddQuestion={handleAddQuestion} />}
      {step === 2 && <DeleteQuestion questions={questions} onDeleteQuestion={handleDeleteQuestion} />}
      {step === 3 && (
        <SelectType onTypeSelected={handleTypeSelected} />
      )}
      {step === 4 && isOpen === true && (
       <OpenQuestionSummary question={currentQuestion} is_active={1} onSubmit={handleSubmit} />
      )}
      {step === 4 && isOpen === false && (
        <InsertOptions options={options} onOptionsChange={setOptions} onNext={handleOptionsNext} />
      )}
      {step === 5 && (
            <ClosedQuestionSummary question={currentQuestion} options={options} is_active={1} onSubmit={handleSubmit} />
      )}
    </>
  );
}

export default NewQuestionPage;

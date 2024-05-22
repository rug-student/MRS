import React, { useState, useEffect } from 'react';
import './login.css';
import Header from './HeaderLoggedIn.js';
import InsertOptions from './InsertOptions';
import { OpenQuestionSummary, ClosedQuestionSummary } from './Summary';
import { submitQuestion } from '../api/questions.api.js';
import { submitQuestion, getQuestions } from '../api/questions.api.js';

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
      <Header />
      <div className="centered-container">
        <div className="form-container" id="uno">
          <h1 className="subtitle" id="tre">New Question</h1>
          <input
            className="inbar"
            type="text"
            placeholder={placeholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          <button id="b" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
}

function DeleteQuestion({ questions, onDeleteQuestion }) {
  const handleDelete = (questionId) => {
    onDeleteQuestion(questionId);
  };

  const activeQuestions = questions.filter(question => question.is_active);

  return (
    <div>
      <Header />
      <div className="centered-container">
        <div className="form-container" id="quattro">
          <h1 className="subtitle">Delete Question</h1>
          <div className="table-container">
            <table className="question-table">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeQuestions.map((question) => (
                  <tr key={question.id}>
                    <td>{question.question_description}</td>
                    <td>
                      <button className="delete-button" onClick={() => handleDelete(question.id)}>
                        <span role="img" aria-label="delete">➖</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <h1 className="subtitle" id="select">Question Type</h1>
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

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/questions?active=true`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
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
        setQuestions(questions);
      })
      .catch(error => {
        console.error('Error occurred while fetching questions:', error);
      });
  };

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
    setOptions([]);
    setStep(3);
  };

  const handleDeleteQuestion = (questionId) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? { ...q, is_active: 0 } : q
    );
    setQuestions(updatedQuestions);
  
    fetch(`${process.env.REACT_APP_API_BASE_URL}/questions/${questionId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ is_active: 0 })
    })
      .then(response => {
        if (response.ok) {
          console.log('Question deactivated successfully');
        } else {
          throw new Error('Failed to deactivate question');
        }
      })
      .catch(error => {
        console.error('Error occurred while deactivating question:', error);
      });
  
    setIsActive(0);
    setStep(0);
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
    console.log('New question data:', { currentQuestion, isOpen, options});
    try {
      const response = submitQuestion(currentQuestion, isOpen, options);
      console.log(response);
    } catch(error) {
      console.log(error);
    }
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
      {step === 3 && <SelectType onTypeSelected={handleTypeSelected} />}
      {step === 4 && isOpen && <OpenQuestionSummary question={currentQuestion} is_active={1} onSubmit={handleSubmit} />}
      {step === 4 && !isOpen && <InsertOptions options={options} onOptionsChange={setOptions} onNext={handleOptionsNext} />}
      {step === 5 && <ClosedQuestionSummary question={currentQuestion} options={options} is_active={1} onSubmit={handleSubmit} />}
    </>
  );
}

export default NewQuestionPage;
import React, { useState, useEffect } from 'react';
import '../styleSheets/QuestionsPage.css';
import Header from '../components/Header.jsx';
import InsertOptions from '../components/question/InsertOptions.jsx';
import { OpenQuestionSummary, ClosedQuestionSummary } from '../components/question/QuestionSummary.jsx';
import {getQuestions, submitQuestion, DeleteQue} from '../api/questions.api.js';
import useAuthContext from '../context/AuthContext.jsx';
import { useNavigate } from "react-router-dom";

function BackButton({ onClick }) {
  return (
    <button className="back-button" onClick={onClick}>Back</button>
  );
}

function BackButton2({ onClick }) {
  return (
    <button className="back-button2" onClick={onClick}>Back</button>
  );
}
function InsertQuestion({ onNext, onAddQuestion, onBack }) {
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
    // onAddQuestion(question);
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
          <BackButton onClick={onBack} />
        </div>
      </div>
    </div>
  );
}

function DeleteQuestion({ questions, onDeleteQuestion, onBack }) {
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
        <BackButton2 onClick={onBack} />
      </div>
      
    </div>
  );
}

function SelectType({ onTypeSelected, onBack }) {
  return (
    <div>
      <Header />
      <div className="centered-container">
        <div className="form-container1">
          <h1 className="subtitle" id="select">Question Type</h1>
          <button id="firstbutton" onClick={() => onTypeSelected(true)}>Open Question</button>
          <button id="secondbutton" onClick={() => onTypeSelected(false)}>Closed Question</button>
          <BackButton onClick={onBack} />
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
  const { user, checkLoggedIn } = useAuthContext();
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkLoggedIn(false, '/login');

    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions();
        console.log(fetchedQuestions);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error occurred while fetching questions:', error);
      }
    };
    
    fetchQuestions();
  }, []);

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
  
    DeleteQue(questionId);
  
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

  const handleSubmit = async () => {
    setError(null); 
    setStep(0);
    console.log('New question data:', { currentQuestion, isOpen, options });
    try {
      const response = await submitQuestion(currentQuestion, isOpen, options);
      console.log(response);
      if (!isOpen) {
        setOptions([]); // Clear options after submitting a closed question
      }
    } catch (error) {
      console.log(error);
      setError('Failed to submit the question. Please try again.');
    }
  };

  const handleBack = () => {
    if (step === 1 || step === 2) {
      setStep(0);
    } else if (step === 3) {
      setStep(1);
    } else if (step === 4) {
      setStep(3);
    } else if (step === 5) {
      setStep(4);
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
            {error && <div className="error-message">{error}</div>}
          </div>
        </div>
      )}
      {step === 1 && <InsertQuestion onNext={handleQuestionNext} onAddQuestion={handleAddQuestion} onBack={handleBack} />}
      {step === 2 && <DeleteQuestion questions={questions} onDeleteQuestion={handleDeleteQuestion} onBack={handleBack} />}
      {step === 3 && <SelectType onTypeSelected={handleTypeSelected} onBack={handleBack} />}
      {step === 4 && isOpen && <OpenQuestionSummary question={currentQuestion} is_active={1} onSubmit={handleSubmit} onBack={handleBack} />}
      {step === 4 && !isOpen && <InsertOptions options={options} onOptionsChange={setOptions} onNext={handleOptionsNext} onBack={handleBack} />}
      {step === 5 && <ClosedQuestionSummary question={currentQuestion} options={options} is_active={1} onSubmit={handleSubmit} onBack={handleBack} />}
    </>
  );
}

export default NewQuestionPage;

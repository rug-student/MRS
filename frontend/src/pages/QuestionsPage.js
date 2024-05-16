import React, { useState } from 'react';
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
  const [options, setOptions] = useState([]);

  const handleAddQuestion = (question) => {
    setQuestions([...questions, question]);
    setOptions([]); 
    setStep(3); 
  };
  
  const handleDeleteQuestion = (question) => {
    const updatedQuestions = questions.filter(q => q !== question);
    setQuestions(updatedQuestions);
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
  
  /*
  const handleSubmit = (event) => {
    event.preventDefault();

    // Update answers for custom questions 
    questions.forEach(question => { 
        const response = fetch(`http://localhost:8000/api/questions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept' : 'application/json'
        },
        body: JSON.stringify({
          question_id: question.id,
          question_description: 
          is_open: 
          is_active: 1
        })
      });
      
      if (!response.ok) {
        console.error(`Failed to update answer for question ${question.id}`);
        return;
      }
      
    })
  };
  */

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
       <OpenQuestionSummary question={currentQuestion} onSubmit={() => setStep(0)} />
      )}
      {step === 4 && isOpen === false && (
        <InsertOptions options={options} onOptionsChange={setOptions} onNext={handleOptionsNext} />
      )}
      {step === 5 && (
            <ClosedQuestionSummary question={currentQuestion} options={options} onSubmit={() => setStep(0)} />
      )}
    </>
  );
}

export default NewQuestionPage;

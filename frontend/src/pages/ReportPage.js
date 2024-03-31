import React, { useState, useEffect } from 'react';
import './ReportPage.css';
import Header from './Header';

function CreateReport() {
  
  // State variables to hold form data
  const [email, setEmail] = useState('');
  const [malfunctionDescription, setMalfunctionDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});

  // loads questions into form upon page load
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Gets all the questions from the database
  const fetchQuestions = () => {
    fetch(`http://localhost:8000/api/questions?active=true`)
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
  
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setMalfunctionDescription(event.target.value);
  };

  const handleQuestionResponseChange = (event, questionId) => {
    const newAnswers = { ...questionAnswers };
    newAnswers[questionId] = event.target.value;
    setQuestionAnswers(newAnswers);
  };



  // -------- SUBMITTING FORM --------
  const handleSubmit = (event) => {
    event.preventDefault();

    // Update answers for custom questions 
    questions.forEach(question => { 
      if (question.is_open) {
        const response = fetch(`http://localhost:8000/api/answers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_id: question.id,
          answer: questionAnswers[question.id]
        })
      });
      
      if (!response.ok) {
        console.error(`Failed to update answer for question ${question.id}`);
        return;
      }
      }
    })

    // Perform POST request with form data
    fetch(`http://localhost:8000/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: malfunctionDescription, 
        submitter_email: email,
        responses: Object.keys(questionAnswers).map(questionId => ({
          question_id: questionId,
          answer_id: questionAnswers[questionId] // TO FIX 
        }))
      })
    })
    .then(response => {
      if (response.ok) {
        // Handle successful response
        console.log('Report submitted successfully');
      } else {
        // Handle error response
        console.error('Failed to submit report');
      }
    })
    .catch(error => {
      // Handle network error
      console.error('Error occurred while submitting report:', error);
    });
  };


  return (
    /* ------ REPORT PAGE ------ */
    <div>
      <Header /> 
      <form onSubmit={handleSubmit}>

        <div className='question-container'>
          <div className='question'>01. What is your email?</div>
          <input type="email" className='answer' value={email} onChange={handleEmailChange}/>
        </div>

        <div className='question-container'>
          <div className='question'>02. Describe the malfunction.</div>
          <textarea className='answer' value={malfunctionDescription} onChange={handleDescriptionChange}/>
        </div>

        {/* adds the questions made my maintenance personel */}
        {questions.map(question => (
          <div className='question-container' key={question.id}>
            <div className='question'>{question.question_description}</div>
            
            {question.is_open ? (
              
              // If the question is open, render a text input
              <input type="text" className='answer' value={question.answer.id} onChange={e => handleQuestionResponseChange(e, question.id)}/>
              ) : (
              
              // If the question is not open, dropdown menu with the MC answers
              <select className='answer' value={question.answer.answer} onChange={e => handleQuestionResponseChange(e, question.id)}>
                <option value="">-- Select Answer --</option>
                {/* Map through question answers to populate the dropdown */}
                {question.answer.map(answer => (
                  <option key={answer.id} value={answer.answer}>{answer.answer}</option>
                 ))}
              </select>
            )}
          </div>
        ))}
        
        <button type="submit" onClick={handleSubmit}>Submit</button>
      
      </form>
    
    </div>
  );
}

export default CreateReport;

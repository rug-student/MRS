import React, { useState, useEffect } from 'react';
import './ReportPage.css';
import Header from './Header';

function CreateReport() {
  
  // State variables to hold form data
  const [email, setEmail] = useState('');
  const [malfunctionDescription, setMalfunctionDescription] = useState('');
  const [priority, setPriority] = useState(5); // Default priority set to 5
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});

  // loads questions into form upon page load
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Gets all the questions from the database
  const fetchQuestions = () => {
    fetch('localhost:8000/api/questions?active=true')
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

  const handlePriorityChange = (event) => {
    setPriority(parseInt(event.target.value));
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
      const response = fetch(`http://localhost:8000/api/answers/${question.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          answer: questionResponses[question.id]
        })
      });
      
      if (!response.ok) {
        console.error(`Failed to update answer for question ${question.id}`);
        return;
      }
    })

    // Perform POST request with form data
    fetch('localhost:8000/api/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: malfunctionDescription, 
        priority: priority,
        submitter_email: email,
        responses: Object.keys(questionAnswers).map(questionId => ({
          question_id: questionId,
          answer: questionAnswers[questionId] // TO FIX 
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

        <div className='question-container'>
          <div className='question'>03. How much of a priority is the malfunction (1 = Low, 10 = High)?</div>
          <input type="range" min="1" max="10" value={priority} onChange={handlePriorityChange}/>
          <span className='answer'>{priority}</span>
        </div>

        {/* adds the questions made my maintenance personel */}
        {questions.map(question => (
          <div className='question-container' key={question.id}>
            <div className='question'>{question.question_description}</div>
            <input type="text" className='answer' value={question.answer} onChange={e => handleQuestionResponseChange(e, question.id)}/>
          </div>
        ))}
        
        <button type="submit" onClick={handleSubmit}>Submit</button>
      
      </form>
    
    </div>
  );
}

export default CreateReport;

import React, { useState, useEffect } from 'react';
import './ReportPage.css';
import Header from './Header';

function CreateReport() {
  
  // State variables to hold form data
  const [email, setEmail] = useState('');
  const [malfunctionDescription, setMalfunctionDescription] = useState('');
  const [priority, setPriority] = useState(5); // Default priority set to 5
  const [questions, setQuestions] = useState([]);

  // loads questions into form upon page load
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = () => {
    fetch('https://example.com/api/questions')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch questions');
        }
      })
      .then(data => {
        setQuestions(data.questions);
      })
      .catch(error => {
        console.error('Error occurred while fetching questions:', error);
      });
  };
  
  
  // Event handler to update state when form fields change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setMalfunctionDescription(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(parseInt(event.target.value));
  };


  // Submit form 
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform POST request with form data
    fetch('https://example.com/api/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        malfunctionDescription: malfunctionDescription,
        priority: priority
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
        
        <button type="submit">Submit</button>
      
      </form>
    
    </div>
  );
}

export default CreateReport;

import React, { useState, useEffect } from 'react';
import './ReportPage.css';
import Header from './Header';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function CreateReport() {
  
  // State variables to hold form data
  const [email, setEmail] = useState('');
  const [malfunctionDescription, setMalfunctionDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showOtherTextInput, setShowOtherTextInput] = useState({});
  const [uploadedFile, setUploadedFile] = useState([]);
  const [uploadedFileInfo, setUploadedFileInfo] = useState();
  let questionNumber = 1; // Initialize the question number



  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  

  // loads questions into form upon page load
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Gets all the active questions from the database
  const fetchQuestions = () => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/questions?active=true`, {
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

  const handleFilePathChange = (event) => {
    setUploadedFileInfo(uploadedFile);
    setUploadedFile(event.target.files[0]);
  };

  const handleQuestionResponseChange = (event, questionId) => {
    const newAnswers = { ...questionAnswers };
    newAnswers[questionId] = event.target.value;
    setQuestionAnswers(newAnswers);
  };

  const handleSelectChange = (event, questionId) => {
    const value = event.target.value;
    const newAnswers = { ...questionAnswers };
    newAnswers[questionId] = value;
    setQuestionAnswers(newAnswers);
    
    const newShowOtherTextInput = { ...showOtherTextInput };
    newShowOtherTextInput[questionId] = value === 'Other';
    setShowOtherTextInput(newShowOtherTextInput);
  };



  // -------- SUBMITTING FORM --------
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const questionAnswerIDs = {};
  
    // Create new answers for open questions
    for (const question of questions) {
      if (question.is_open || showOtherTextInput[question.id]) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/answers/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              answer: questionAnswers[question.id],
              question_id: null
            })
          });
  
          if (!response.ok) {
            console.error(`Failed to update answer for question ${question.id}`);
            return;
          } else {
            const responseData = await response.json();
            questionAnswerIDs[question.id] = parseInt(responseData[1].id, 10);
          }
        } catch (error) {
          console.error('Error occurred while updating answer:', error);
        }
      } else {
        let id;
        question.answer.forEach(answer => {
          if (answer.answer === questionAnswers[question.id]) {
            id = answer.id;
          }
        });
        questionAnswerIDs[question.id] = id;
      }
    }

  
    // Perform POST request with form data
    try {
      console.log("question answers: ", questionAnswerIDs); // testing
      
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          description: malfunctionDescription,
          submitter_email: email,
          responses: Object.keys(questionAnswerIDs).map(questionId => ({
            question_id: questionId,
            answer_id: questionAnswerIDs[questionId]
          })),
          files: {
            file_path: uploadedFile
          }
        })
      });
  
      if (response.ok) {
        // Handle successful response
        console.log('Report submitted successfully');
      } else {
        // Handle error response
        console.error('Failed to submit report');
      }
    } catch (error) {
      // Handle network error
      console.error('Error occurred while submitting report:', error);
    }
  };

  return (
    /* ------ REPORT PAGE ------ */
    <div>
      <Header /> 
      <form onSubmit={handleSubmit}>

        <div className='question-container'>
          <div className='question'>{questionNumber++}. What is your email?</div>
          <input type="email" className='answer' value={email} onChange={handleEmailChange}/>
        </div>

        <div className='question-container'>
          <div className='question'>{questionNumber++}. Describe the malfunction.</div>
          <textarea className='answer' value={malfunctionDescription} onChange={handleDescriptionChange}/>
        </div>

        {/* displaying questions created by maintenance personel */}
        {questions.map(question => (
          <div className='question-container' key={question.id}>
            <div className='question'>{questionNumber++}. {question.question_description}</div>
          
            {question.is_open ? (
              /* If the question is open, render a text input*/
              <input type="text" className='answer' value={question.answer.id} onChange={e => handleQuestionResponseChange(e, question.id)}/>
              ) : (
              <>
              {/* If the question is not open, dropdown menu with the MC answers */}
              <select className='answer' value={question.answer.answer} onChange={e => handleSelectChange(e, question.id)}>
                <option value="">-- Select Answer --</option>
                {/* Map through question answers to populate the dropdown */}
                {question.answer.map(answer => (
                  <option key={answer.id} value={answer.answer}>{answer.answer}</option>
                 ))}
                <option value="Other">Other</option>
              </select>
              {showOtherTextInput[question.id] && (
                <input type="text" className='answer' value={question.answer.id} onChange={e => handleQuestionResponseChange(e, question.id)}/>
              )}
              </>
            )}
          </div>
        ))}

        <div className='question-container'>
          <div className='question'>{questionNumber++}. Upload a photo of the malfunction.</div>
          <Button className='upload-btn'
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{
              backgroundColor: '#1AA9EC' // Custom background color
            }}
          >
            Upload file
            <VisuallyHiddenInput type="file" onChange={handleFilePathChange}/>
          </Button>
          {uploadedFileInfo && (
          <section>
            File details:
            <ul>
              <li>Name: {uploadedFile.name}</li>
              <li>Type: {uploadedFile.type}</li>
              <li>Size: {uploadedFile.size} bytes</li>
            </ul>
          </section>
      )}
        </div>
        
        <button type="submit" onClick={handleSubmit}>Submit</button>
      
      </form>
    
    </div>
  );
}

export default CreateReport;
import React, { useState, useEffect } from 'react';
import '../styleSheets/ReportPage.css';
import Header from '../components/Header.jsx';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Popup from '../components/popups/Popup.jsx';

import { submitReport } from '../api/reports.api.js';
import { getQuestions } from '../api/questions.api.js';


function CreateReport() {
  
  const [email, setEmail] = useState('');
  const [malfunctionDescription, setMalfunctionDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showOtherTextInput, setShowOtherTextInput] = useState({}); 
  const [uploadedFile, setUploadedFile] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);
  let questionNumber = 1;

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
  
  // populates report with questions upon page load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const fetchedQuestions = await getQuestions();
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error('Error occurred while fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);
  
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNotifyBoxChange = (event) => {
    setNotifyMe(event.target.checked);
  };

  const handleDescriptionChange = (event) => {
    setMalfunctionDescription(event.target.value);
  };

  // -------- Handling file upload --------
  const handleFileChange = (event) => {
    const file = event.target.files[0]; 
    if (file) {
      setUploadedFile(file);
    } else {
      setUploadedFile(null);
    }
  };

  // -------- Handling change in answer to open questions --------
  const handleQuestionResponseChange = (event, questionId) => {
    const newAnswers = { ...questionAnswers };
    newAnswers[questionId] = event.target.value;
    setQuestionAnswers(newAnswers);
  };

  // -------- Handling change in answer to closed questions (dropdown menu) --------
  const handleSelectChange = (event, questionId) => {
    const value = event.target.value;
    const newAnswers = { ...questionAnswers };
    newAnswers[questionId] = value;
    setQuestionAnswers(newAnswers);
    
    const newShowOtherTextInput = { ...showOtherTextInput };
    newShowOtherTextInput[questionId] = value === 'Other';
    setShowOtherTextInput(newShowOtherTextInput);
  };
  
  // -------- Resetting form (for after successfull submit) --------
  const resetForm = () => {
    setEmail('');
    setMalfunctionDescription('');
    setQuestionAnswers({});
    setShowOtherTextInput({});
    setUploadedFile(null);
    setNotifyMe(false);
      
    // Clear textboxes for open questions
    const openQuestionIds = questions.filter(question => question.is_open).map(question => question.id);
    openQuestionIds.forEach(questionId => {
      const input = document.getElementById(`question-${questionId}`);
      if (input) {
        input.value = '';
      }
    });
    
    // Reset dropdown menus for closed questions
    const closedQuestionIds = questions.filter(question => !question.is_open).map(question => question.id);
    closedQuestionIds.forEach(questionId => {
      const select = document.getElementById(`question-${questionId}`);
      if (select) {
        select.selectedIndex = 0; // Reset to the first option (placeholder)
      }
    });

    setFormSubmitted(false);
    setOpenPopup(true);
  }
 
  // -------- SUBMITTING FORM --------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    const submitted = await submitReport(
      malfunctionDescription,
      email,
      notifyMe,
      questionAnswers,
      questions,
      showOtherTextInput,
      uploadedFile, 
    );
    if (submitted) {
      setPopupContent("Report successfully submitted");
      resetForm();
    } else {
      setPopupContent("Please correctly fill in all fields.");
      setOpenPopup(true);
    }
  };

  return (
    /* ------ REPORT PAGE ------ */
    <div>
      <Header /> 
      <form onSubmit={handleSubmit} id='report-page'>

        <div className='question-container'>
          <div className='question'>{questionNumber++}. What is your email?</div>
          <input 
            required 
            type="email" 
            className={`answer ${formSubmitted ? 'submitted' : 'notSubmitted'}`} 
            value={email} 
            onChange={handleEmailChange}
          />
          <div className="notify-btn">
            <input type='checkbox' onChange={handleNotifyBoxChange} checked={notifyMe}/>
            Notify me on status updates
          </div>
        </div>

        <div className='question-container'>
          <div className='question'>{questionNumber++}. Describe the malfunction.</div>
          <input 
            required 
            type="text" 
            className={`answer ${formSubmitted ? 'submitted' : 'notSubmitted'}`} 
            value={malfunctionDescription} 
            onChange={handleDescriptionChange}
          />
        </div>

        {/* displaying questions created by maintenance personel */}
        {questions.map(question => (
          <div className='question-container' key={question.id}>
            <div className='question'>{questionNumber++}. {question.question_description}</div>
          
            {question.is_open ? (
              /* If the question is open, render a text input*/
              <input 
                required 
                type="text" 
                className={`answer ${formSubmitted ? 'submitted' : 'notSubmitted'}`} 
                id={`question-${question.id}`} 
                value={question.answer.id }
                onChange={e => handleQuestionResponseChange(e, question.id)}
              />
              ) : (
              <>
              {/* If the question is not open, dropdown menu with the MC answers */}
              <select 
                required 
                className={`answer ${formSubmitted ? 'submitted' : 'notSubmitted'}`} 
                id={`question-${question.id}`} 
                value={question.answer.answer} 
                onChange={e => handleSelectChange(e, question.id)}
              >
                <option disabled selected value="">-- Select Answer --</option>
                {question.answer.map(answer => (
                  <option key={answer.id} value={answer.answer}>{answer.answer}</option>
                ))}
                <option value="Other">Other</option>
              </select>
              
              {showOtherTextInput[question.id] && (
                <input 
                  required 
                  type="text" 
                  className={`answer ${formSubmitted ? 'submitted' : 'notSubmitted'}`} 
                  id={`question-${question.id}`} 
                  value={question.answer.id }
                  onChange={e => handleQuestionResponseChange(e, question.id)}
                />
              )}
              </>
            )}
          </div>
        ))}


        {/* File upload question */}
        <div className='question-container'>
          <div className='question'>{questionNumber++}. Upload a photo of the malfunction. (optional)</div>
          <Button className='upload-btn'
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{
              backgroundColor: '#1AA9EC' 
            }}
          >
            Upload file
            <VisuallyHiddenInput className='answer' type="file" onChange={handleFileChange}/>
          </Button>
          { (uploadedFile != null) && (
          <section>
            <ul>
              <li>Name: {uploadedFile.name}</li>
              <li>Type: {uploadedFile.type}</li>
              <li>Size: {uploadedFile.size} bytes</li>
            </ul>
          </section>
      )}
        </div>
        <button type="submit" onClick={handleSubmit}>Submit</button>
        <Popup content={popupContent} open={openPopup} onClose={() => setOpenPopup(false)} />
      </form>
    </div>
  );
}

export default CreateReport;
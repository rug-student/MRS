import React, { useState, useEffect } from 'react';
import './ReportPage.css';
import Header from '../components/Header';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Popup from '../components/Popup.js';
import { useNavigate } from "react-router-dom";


import { submitReport } from '../api/reports.api.js';
import { getQuestions } from '../api/questions.api.js';


function CreateReport() {
  
  // State variables to hold form data
  const [email, setEmail] = useState('');
  const [malfunctionDescription, setMalfunctionDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState({});
  const [showOtherTextInput, setShowOtherTextInput] = useState({});
  const [uploadedFile, setUploadedFile] = useState([]);
  const [uploadedFilePath, setUploadedFilePath] = useState('');
  const [uploadedFileInfo, setUploadedFileInfo] = useState();
  const [openPopup, setOpenPopup] = useState(false);
 
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

  const handleDescriptionChange = (event) => {
    setMalfunctionDescription(event.target.value);
  };

  const handleFilePathChange = (event) => {
    setUploadedFileInfo(uploadedFile);
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      setUploadedFilePath(URL.createObjectURL(file)); // Create a local URL for the file
    }
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
  
  const resetForm = () => {
    setEmail('');
    setMalfunctionDescription('');
    setQuestionAnswers({});
    setShowOtherTextInput({});
    setUploadedFile(null);
    setUploadedFilePath('');
    setOpenPopup(true);
  };
 
  // -------- SUBMITTING FORM --------
  const handleSubmit = async (event) => {
    event.preventDefault();
    await submitReport(
      malfunctionDescription,
      email,
      questionAnswers,
      questions,
      showOtherTextInput,
      uploadedFilePath, 
      resetForm
    );
  };

  return (
    /* ------ REPORT PAGE ------ */
    <div>
      <Header /> 
      <form onSubmit={handleSubmit} id='report-page'>

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
                <option disabled selected value="">-- Select Answer --</option>
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

        {/* File upload question */}
        <div className='question-container'>
          <div className='question'>{questionNumber++}. Upload a photo of the malfunction.</div>
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
            <VisuallyHiddenInput className='answer' type="file" onChange={handleFilePathChange}/>
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
        
        <Popup content={"Report successfully submitted!"} open={openPopup} onClose={() => setOpenPopup(false)} />
      </form>
    
    </div>
  );
}

export default CreateReport;
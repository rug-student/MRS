
/**
 * Submits a new report with given data.
 * 
 * @param {string} malfunctionDescription The description of the malfunction.
 * @param {string} email The email of the report submitter.
 * @param {Object} questionAnswers Key-value pairs of question IDs and their answers.
 * @param {Array} questions List of questions.
 * @param {Object} showOtherTextInput Key-value pairs of question IDs and whether "Other" text input is shown.
 * @param {string} uploadedFilePath Path to the uploaded file.
 * @returns {Boolean} True if report was successfully submitted, false otherwise.
 */
export async function submitReport(malfunctionDescription, email, questionAnswers, questions, showOtherTextInput, uploadedFilePath) {
  try {
    const questionAnswerIDs = await createAnswers(questions, questionAnswers, showOtherTextInput);
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reports`, {
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
        files: uploadedFilePath ? [{ file_path: uploadedFilePath }] : []
      })
    });

    if (response.ok) {
      // Handle successful response
      console.log('Report submitted successfully');
      return(true);
    } else {
      // Handle error response
      console.error('Failed to submit report');
      return(false);
    }
  } catch (error) {
    // Handle network error
    console.error('Error occurred while submitting report:', error);
  }
};

/**
 * Creates answers for the open questions.
 * 
 * @param {Array} questions List of questions.
 * @param {Object} questionAnswers Key-value pairs of question IDs and their answers.
 * @param {Object} showOtherTextInput Key-value pairs of question IDs and whether "Other" text input is shown.
 * @returns {Object} Key-value pairs of question IDs and answer IDs.
 */
export async function createAnswers(questions, questionAnswers, showOtherTextInput) {
  
  const questionAnswerIDs = {};
    // Create new answers for open questions
    for (const question of questions) {
      if (question.is_open || showOtherTextInput[question.id]) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/answers/`, {
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
    return questionAnswerIDs;
}



/**
 * GETs a detailed single report with specified id.
 * @param reportID The ID of the report.
 * @returns all information on the report with the given ID. 
 *
 */
export async function getReport(reportID) {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reports/${reportID}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const reportSummary = await response.json();
      return reportSummary;
    } else {
      throw new Error('Failed to fetch report');
    }
  } catch (error) {
    console.error('Error occurred while fetching report:', error);
    throw error;
  }
}


/**
 * GETs a list of all existing reports.
 * @returns list of reports that are in database.
 */
export const getReports = async (page) => {
  try{
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reports?page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (response.ok) {
      const reports = await response.json();
      return reports;
    } else {
      console.error("Fetch error: ", response.statusText);
    }

  } catch(error) {
    console.error('Error occurred while fetching reports:', error);
    throw error;
  }
}

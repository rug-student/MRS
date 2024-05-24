/**
 * GETs all active questions to populate the report.
 * @returns array of active questions
 *
 */
export const getQuestions = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/questions?active=true`, {
      method: 'GET',
      headers: {
        'Accept' : 'application/json'
      }
    });

    if (response.ok) {
      const questions = await response.json();
      return questions;
    } else {
      throw new Error('Failed to fetch questions');
    }
  } catch (error) {
    console.error('Error occurred while fetching questions:', error);
    throw error;
  }
};



/**
 * POSTs a new question from given params.
 * 
 * @param description The description of the question.
 * @param isOpen Boolean value that gives info if the question is open or closed.
 * @param options Array containing the multiple choice options.
 */
export function submitQuestion(description, isOpen, options) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question_description: description, 
          is_open: isOpen,
          answers: options,
        })
      })
      .then(response => {
        if (response.ok) {
          console.log('Question created successfully');
          return response;
        } else {
          console.error('Failed to create question');
        }
      })
      .catch(error => {
        console.error('Error occurred while creating question:', error);
      });
}


/**
 * POSTs a new report with given data.
 * 
 * @param questionID ID of the selected question.
 */
export function DeleteQue(questionId) {
  fetch(`${process.env.REACT_APP_API_BASE_URL}/api/questions/${questionId}`, {
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
  }
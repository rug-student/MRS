/**
 * Gets all active questions.
 * 
 * @returns response.
 */
export function getQuestions() {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/questions?active=true`, {
        method: 'GET',
        headers: {
            'Accept' : 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
    })
    .catch(error => {
        throw error;
    });
}

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
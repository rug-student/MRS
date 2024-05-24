
/**
 * POSTs a new report with given data.
 * 
 * @param description The description of report.
 * @param email The email of report submitter.
 * @param questionAnswerIDs Form data in questionIDs & answerIDs key-value pairs.
 */
export function submitReport(description, email, questionAnswerIDs) {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reports`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Accept' : 'application/json'
        },
        body: JSON.stringify({
            description: description, 
            submitter_email: email,
            responses: Object.keys(questionAnswerIDs).map(questionId => ({
                question_id: questionId,
                answer_id: questionAnswerIDs[questionId]
            }))
        })
    })
    .catch(error => {
        throw error;
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
    });
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

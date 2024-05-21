
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
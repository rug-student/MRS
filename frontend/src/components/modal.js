import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState, useEffect } from 'react';
import { getReport } from '../api/reports.api.js';



const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BasicModal({ open, handleClose, reportID }) {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchReportData = async () => {
        if (reportID && open) {
          try {
            const data = await getReport(reportID);
            setReportData(data[0]);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching report data:', error);
          }
        }
      };
  
      fetchReportData();
    }, [reportID, open]);
  

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
                Report #{reportID}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Description: {reportData.description}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Priority: {reportData.priority}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Status: {reportData.status}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Submitter Email: {reportData.submitter_email}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Created at: {reportData.created_at}
            </Typography>
            
            {/* Reponses to questions (if they exist) */}
            {reportData.response && reportData.response.length > 0 && (
              <div>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mt: 2 }}>
                  Responses
                </Typography>
                {reportData.response.map((r, index) => (
                  <Typography key={index} id="modal-modal-description" sx={{ mt: 1 }}>
                    {r.question.question_description}: {r.answer.answer}
                  </Typography>
                ))}
              </div>
            )}
            {/* TO DO: ADD RESPONSES */}

                
            
           
        </Box>
      </Modal>
    </div>
  );
}
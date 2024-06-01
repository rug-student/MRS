import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReport, downloadFile } from "../api/reports.api";
import { getPriorityText, getStatusText } from "../helpers/mapReports";
import moment from "moment";
import { Container } from "react-bootstrap";
import { IoIosArrowBack } from "react-icons/io";
import Header from "../components/Header";
import useAuthContext from "../context/AuthContext";
import { formatDate } from "../helpers/formDate";
import styles from '../styleSheets/SingleReport.module.css'

const SingleReport = () => {
  const { ReportId } = useParams();
  const [report, setReport] = useState({});
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthContext();

  const fetchReport = async () => {
    const data = await getReport(ReportId);
    if (data === null) {
      console.log("Report does not exist: redirecting")
      navigate('/dashboard')
    } else {
      console.log("data is:", data);
      setReport(data);
    }
  };
  console.log(report);
 

  useEffect(() => {
    if (isLoggedIn()) {
      fetchReport();
    } else {
      navigate('/login')
    }

  }, [ReportId]);

  // Function to handle file display
  const displayFile = async (fileId) => {
    try {
      const fileBlob = await downloadFile(fileId);
      // Create a URL for the blob
      const fileUrl = URL.createObjectURL(fileBlob);
      // Set the file URL in the report state
      setReport(prevState => ({
        ...prevState,
        fileUrl
      }));
    } catch (error) {
      console.error('Error displaying file:', error);
    }
  };


  return (
    <div>
      <Header />
      <Container className="pt-5">
        <div className="d-flex justify-content-end align-items-center w-100">
          <IoIosArrowBack
            size={30}
            className="back_report_icon"
            onClick={() => navigate(-1)}
          />
        </div>
        <h1 className={styles.reportTitle}>Single Report</h1>
        <div class={`table-responsive ${styles.myTableResponsive}`}>
        <table className="table table-lg table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>EMAIL</th>
              <th>DESCRIPTION</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>CREATED AT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{report.id}</td>
              <td>{report.submitter_email}</td>
              <td>{report.description}</td>
              <td>{getPriorityText(report.priority)} </td>
              <td>{getStatusText(report.status)}</td>
              <td>{moment(formatDate(report.created_at)).fromNow()}</td>
            </tr>
          </tbody>
        </table>
        </div>
        <div class={`table-responsive ${styles.myTableResponsive}`}>
        <table className="table table-lg table-striped table-bordered">
          <thead>
            <tr>
              <th>RESPONSES</th>
            </tr>
          </thead>
          <tbody>
            {report.response?.length > 0 ? (
              report.response.map((element, index) => (
                <tr key={index}>
                  <td>
                    <p>
                      <strong>{index+1}. {element.question.question_description}: </strong>
                      <span>{element.answer.answer}</span>
                    </p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>
                  <p>The Report does not have Responses</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

      {/* Display files */}
      <div className={`table-responsive ${styles.myTableResponsive}`}>
          <table className="table table-lg table-striped table-bordered">
            <thead>
              <tr>
                <th>FILES</th>
              </tr>
            </thead>
            <tbody>
              {report.files?.length > 0 ? (
                report.files.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <button onClick={() => displayFile(file.id)}>Display File {index + 1}</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No files attached</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Display the file */}
        {report.fileUrl && (
          <div className={`fileDisplay ${styles.fileDisplay}`}>
            <img src={report.fileUrl} alt="Report File" style={{ maxWidth: '40%', height: 'auto' }}/>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SingleReport;

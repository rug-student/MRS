import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReport } from "../api/reports.api";
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
  const { checkLoggedIn } = useAuthContext();

 

  useEffect(() => {
    checkLoggedIn();
    const fetchReport = async () => {
      const data = await getReport(ReportId);
      setReport(data[0]);
    };

    fetchReport();
  }, [ReportId]);
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
      </Container>
    </div>
  );
};

export default SingleReport;

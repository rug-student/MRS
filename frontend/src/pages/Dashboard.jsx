import React, { useEffect, useState } from "react";
import moment from "moment";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { FaRegEdit } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import ModalForm from "../components/ModalForm";
import { getPriorityText, getStatusText } from "../helpers/mapReports";
import { getReports } from "../api/reports.api";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Dashboard = () => {
  const [reportsData, setReportsData] = useState([
    {
      id: 1,
      description: "Description",
      priority: -1,
      created_at: "2024-05-15T19:30:06.000000Z",
      updated_at: "2024-05-15T19:30:06.000000Z",
      status: 0,
      submitter_email: "test@test.com",
      maintainer_id: null,
      response: [],
    },
  ]);
  const [singleEdit, setSingleEdit] = useState({});
  const { user, checkLoggedIn } = useAuthContext();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [update, setUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  /**Navigate to Report Details */

  const handleNavigate = (id) => {
    navigate(`/dashboard/${id}`);
  };

  const handleEdit = (id, submitter_email, priority, status) => {
    setSingleEdit({ id, submitter_email, priority, status });
    setModalShow(true);
  };

  const handlePage = (event, value) => {
    setPage(value);
  };

  const fetchReports = async (page) => {
    const reports = await getReports(page);
    setReportsData(reports.data);

    const total = reports.total;
    const per_page = reports.per_page
    if(total%per_page >= 1) {
      setTotalPages(Math.floor(total/per_page)+1);
    } else {
      setTotalPages(Math.floor(total/per_page));
    }
  };

  useEffect(() => {
    checkLoggedIn();


    fetchReports(page);
  }, [update, page]);

  return (
    <>
      <Header />
      <Container className={styles.dashboardContainer}>
        <h1 className="mb-3">Reports</h1>
        <table className="table table-lg table-striped table-bordered dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>EMAIL</th>
              <th>DESCRIPTION</th>
              <th>PRIORITY</th>
              <th>STATUS</th>
              <th>CREATED AT</th>
              <th>EDIT</th>
            </tr>
          </thead>
          <tbody>
            {reportsData
              .sort((a, b) => b.priority - a.priority)
              .map((element) => (
                <tr key={element.id} onClick={() => handleNavigate(element.id)} >
                  <td>{element.id}</td>
                  <td>{element.submitter_email}</td>
                  <td>{element.description}</td>
                  <td>{getPriorityText(element.priority)} </td>
                  <td>{getStatusText(element.status)}</td>
                  <td>{moment(element.created_at).fromNow()}</td>
                  <td>
                    <FaRegEdit
                      className={styles.editIcon}
                      onClick={() =>
                        handleEdit(
                          element.id,
                          element.submitter_email,
                          element.priority,
                          element.status
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ModalForm
          data={singleEdit}
          show={modalShow}
          onHide={() => setModalShow(false)}
          onUpdate={() => setUpdate(!update)}
        />
      </Container>
      <Stack spacing={2}>
        <Pagination count={totalPages} siblingCount={0} page ={page} onChange={handlePage}/>
      </Stack>
    </>
  );
};

export default Dashboard;

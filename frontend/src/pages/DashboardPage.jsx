import React, { useEffect, useState } from "react";
import moment from "moment";
import { Container, Form } from "react-bootstrap";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { FaRegEdit } from "react-icons/fa";
import styles from "../styleSheets/Dashboard.module.css";

import { getPriorityText, getStatusText } from "../helpers/mapReports";
import { getReports } from "../api/reports.api";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { GrView } from "react-icons/gr";
import ModalForm from "../components/dashboard/ModalForm";

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
  const [sortOption, setSortOption] = useState("priority");

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
    const reports = await getReports(page, sortOption, "desc");
    setReportsData(reports.data);

    const total = reports.total;
    const per_page = reports.per_page;
    if (total % per_page >= 1) {
      setTotalPages(Math.floor(total / per_page) + 1);
    } else {
      setTotalPages(Math.floor(total / per_page));
    }
  };

  useEffect(() => {
    checkLoggedIn();

    fetchReports(page);
  }, [update, page]);

  // Function to handle the sort option change
  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  // Function to get sorted reports based on the selected sort option
  const getSortedReports = () => {
    if (sortOption === "priority") {
      return [...reportsData].sort((a, b) => b.priority - a.priority);
    } else if (sortOption === "date") {
      return [...reportsData].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }
    return reportsData;
  };

  return (
    <>
      <Header />
      <Container className={styles.dashboardContainer}>
        <div className={styles.HeaderWrapper}>
          <h1 className="mb-3">Reports</h1>
          <div className={styles.filterSelector}>
            <Form.Select value={sortOption} onChange={handleSortOptionChange}>
              <option value="priority">Sort by Priority</option>
              <option value="date">Sort by Date</option>
            </Form.Select>
          </div>
        </div>
        <div class={`table-responsive ${styles.myTableResponsive}`}>
          <table className="table table-lg table-striped table-bordered dashboard-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>EMAIL</th>
                <th>DESCRIPTION</th>
                <th>PRIORITY</th>
                <th>STATUS</th>
                <th>CREATED AT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {getSortedReports().map((element) => (
                <tr key={element.id}>
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
                    <GrView
                      onClick={() => handleNavigate(element.id)}
                      className={styles.editIcon}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ModalForm
          data={singleEdit}
          show={modalShow}
          onHide={() => setModalShow(false)}
          onUpdate={() => setUpdate(!update)}
        />
      </Container>
      <Stack spacing={2} className="pt-5">
        <Pagination
        className={styles.dashboardPagination}
          shape="rounded"
          size="small"
          count={totalPages}
          siblingCount={0}
          page={page}
          onChange={handlePage}
        />
      </Stack>
    </>
  );
};

export default Dashboard;

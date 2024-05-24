import React, { useEffect, useState } from "react";
import moment from "moment";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { FaRegEdit } from "react-icons/fa";
import styles from "./Dashboard.module.css";
import ModalForm from "../components/ModalForm";

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
  const [singleEdit, setSingleEdit] = useState({})
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [update, setUpdate] = useState(false)
  
  const handleEdit= (id, submitter_email, priority, status) =>{

    setSingleEdit({id, submitter_email, priority, status})
    setModalShow(true)

  }

  useEffect(() => {
    // if(!user) {
    //   navigate('/login')
    // }

    const getData = async () => {
      try {
        const response = await fetch("http://localhost/api/reports");
        if (response.ok) {
          const result = await response.json();
          console.log(result);
          setReportsData([...result]);
        } else {
          console.error("Fetch error: ", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getData();
  }, [update]);

  return (
    <>
      <Header />
      <Container>
        <h1>Reports</h1>
        <table className="table table-primary">
          <tr>
            <th>ID</th>
            <th>EMAIL</th>
            <th>DESCRIPTION</th>
            <th>PRIORITY</th>
            <th>STATUS</th>
            <th>CREATED AT</th>
            <th>EDIT</th>
          </tr>
          {reportsData.map((element) => (
            <tr key={element.id}>
              <td>{element.id}</td>
              <td>{element.submitter_email}</td>
              <td>{element.description}</td>
              <td>{element.priority} </td>
              <td>{element.status}</td>
              <td>{moment(element.created_at).fromNow()}</td>
              <td>
                <FaRegEdit
                  className={styles.editIcon}
                  onClick={() => handleEdit(element.id, element.submitter_email, element.priority, element.status)}

                />
              </td>
            </tr>
          ))}
        </table>
        <ModalForm data={singleEdit} show={modalShow} onHide={() => setModalShow(false)} onUpdate = {() => setUpdate(!update)} />
      </Container>
    </>
  );
};

export default Dashboard;

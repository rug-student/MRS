import React from "react";
import { Modal } from "react-bootstrap";
import "../../styleSheets/SingleReport.module.css";

const SingleReportImages = ({ show, handleClose, fileUrl }) => {
  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="modal-fullscreen">
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <img src={fileUrl} alt="Report File" style={{ maxHeight: "90vh", maxWidth: "90vw" }} />
      </Modal.Body>
    </Modal>
  );
};

export default SingleReportImages;

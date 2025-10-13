import React from "react";
import { Card, Button } from "react-bootstrap";
import { FaLock, FaExclamationTriangle } from "react-icons/fa";

const Logs = () => {
  return (
    <div
      className="container py-5 d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <Card
        className="text-center shadow p-4"
        style={{
          maxWidth: "600px",
          borderTop: "5px solid #3c51a1",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div className="mb-3 text-danger fs-2">
          <FaLock />
        </div>
        <h4 className="mb-3 text-dark fw-bold d-flex justify-content-center align-items-center gap-2">
          <FaExclamationTriangle className="text-warning" />
          Logs Access Restricted
        </h4>
        <p className="text-muted mb-4">
          Sharing or accessing system logs requires approval from the{" "}
          <strong>System Administrator</strong>. Unauthorized sharing is
          strictly prohibited.
        </p>

        <Button
          variant="primary"
          href="#request-approval"
          className="fw-bold px-4 py-2"
          style={{ background: "#3c51a1", border: "none" }}
        >
          Request Access
        </Button>
      </Card>
    </div>
  );
};

export default Logs;

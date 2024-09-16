import React from "react";
import Link from "next/link";

const ErrorContent = ({ status = null, message }) => {
  return (
    <section
      className="error-area bg-f9f9f9 ptb-100"
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="error-content">
        <div className="global-error-title">{status ?? "SERVER ERROR"}</div>
        <h3>Page Error</h3>
        <p>{message}</p>
        <Link href="/" className="default-btn">
          Back to Homepage
        </Link>
      </div>
    </section>
  );
};

export default ErrorContent;

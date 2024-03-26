import React from "react";
import Link from "next/link";

const ErrorContent = () => {
  return (
    <section
      className="error-area bg-f9f9f9 ptb-100"
      style={{ height: "100vh", display: "flex", alignItems: "center" }}
    >
      <div className="container">
        <div className="error-content">
          <img src="/images/error.png" alt="image" />
          <h3>Error 404 : Page Not Found</h3>
          <p>
            The page you are looking for might have been removed had its name
            changed or is temporarily unavailable.
          </p>
          <Link href="/" className="default-btn">
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ErrorContent;

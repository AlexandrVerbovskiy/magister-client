import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { IndiceContext } from "../../contexts";
import NavbarThree from "../../components/_App/NavbarThree";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import { authSideProps } from "../../middlewares";

const Dashboard = () => {
  const { user } = useContext(IndiceContext);
  const { setLoading } = useContext(IndiceContext);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      <DashboardNavbar />
      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Settings</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/settings/">Home</Link>
            </li>
          </ol>
        </div>

        <div
          className="notification-alert alert alert-success alert-dismissible fade show"
          role="alert"
        >
          Welcome, <b>{user.name}</b>!
          <button
            type="button"
            className="btn-close"
            data-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="recent-activities-box">
              <h3>Some Main Options</h3>

              <ul>
                <li className="alert alert-dismissible fade show" role="alert">
                  <div className="icon">
                    <i className="bx bx-layer"></i>
                  </div>
                  Your listing{" "}
                  <strong>
                    <a href="#">Hills Hotel</a>
                  </strong>{" "}
                  has been approved!
                  <button
                    type="button"
                    className="btn-close"
                    data-dismiss="alert"
                    aria-label="Close"
                  ></button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = authSideProps;

export default Dashboard;

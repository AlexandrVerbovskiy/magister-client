import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import React, { useEffect, useState } from "react";

import { authSideProps } from "../../../middlewares";

const AddListing = () => {
  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="breadcrumb-area">
          <h1>Update Listings</h1>
          <ol className="breadcrumb">
            <li className="item">
              <Link href="/">Home</Link>
            </li>
            <li className="item">
              <Link href="/settings/">Settings</Link>
            </li>
            <li className="item">
              <Link href="/settings/listings">Listings</Link>
            </li>
            <li className="item">Update Listings</li>
          </ol>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = authSideProps;

export default AddListing;

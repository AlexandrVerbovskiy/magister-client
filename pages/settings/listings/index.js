import Link from "next/link";
import NavbarThree from "../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import React from "react";

import { authSideProps } from "../../../middlewares";

const AddListing = ({ listings = [] }) => {
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
            <li className="item">Listings</li>
          </ol>
        </div>

        {listings.length < 1 && (
          <section className="listing-area">
            <div className="no-listing">
              <div className="no-listing-img"></div>
              <div className="no-listing-text">You have no listings yet</div>
              <div className="no-listing-btn">
                <Link
                  href="/settings/listings/add"
                  className="default-btn add-listing-link-btn"
                >
                  <span className="icon">
                    <i className="flaticon-more"></i>
                  </span>
                  <span className="menu-title">Add Listings</span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {listings.length > 0 && (
          <section className="listing-area">
            <ul
              className="nav nav-tabs d-flex align-items-end justify-content-between"
              id="myTab"
            >
              <li className="nav-item react-tabs__tab--selected">
                <a className="nav-link" id="all-listing-tab">
                  <span className="menu-title">All Listings (0)</span>
                </a>
              </li>

              <li className="nav-item">
                <Link
                  href="/settings/listings/add"
                  className="default-btn add-listing-link-btn"
                >
                  <span className="icon">
                    <i className="flaticon-more"></i>
                  </span>
                  <span className="menu-title">Add Listings</span>
                </Link>
              </li>
            </ul>

            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active" id="all-listing">
                <div className="row"></div>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export const getServerSideProps = authSideProps;

export default AddListing;

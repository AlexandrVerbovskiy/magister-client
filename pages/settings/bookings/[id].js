import React from "react";
import { authSideProps } from "../../../middlewares";
import { getOrderFullByIdOptions } from "../../../services";
import OrderContent from "../../../components/Order/OrderContent";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../components/_App/NavbarThree";
import Link from "next/link";

const Listing = (props) => {
  console.log(props);

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Bookings</h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link href="/">Home</Link>
              </li>
              <li className="item">
                <Link href="/settings/">Dashboard</Link>
              </li>
              <li className="item">
                <Link href="/settings/bookings">Bookings</Link>
              </li>
              <li className="item">{props.order.listingName}</li>
            </ol>
          </div>
        </div>

        <OrderContent {...props} />
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderFullByIdOptions(id, baseSideProps.authToken);
  return { ...options, id };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default Listing;

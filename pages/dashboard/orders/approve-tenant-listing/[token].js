import React from "react";
import { authSideProps } from "../../../../middlewares";
import { getTenantListingScanRentalCode } from "../../../../services";
import OrderContent from "../../../../components/Order/OrderContent";
import DashboardNavbar from "../../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../../components/_App/NavbarThree";
import Link from "next/link";
import {useIdPage} from "../../../../hooks";

const ApproveTenantListing = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    observingField:"token",
    getPagePropsFunc: ({ field, authToken }) =>
      getTenantListingScanRentalCode(field, authToken),
  });

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Approving Handover </h1>
            <ol className="breadcrumb">
              <li className="item">
                <Link href="/">Home</Link>
              </li>
              <li className="item">
                <Link href="/dashboard/">Dashboard</Link>
              </li>
              <li className="item">
                <Link href="/dashboard/orders/">Orders</Link>
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
  const token = context.params.token;
  const options = await getTenantListingScanRentalCode(
    token,
    baseSideProps.authToken
  );

  return { ...options, token };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default ApproveTenantListing;

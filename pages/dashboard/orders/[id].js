import React from "react";
import { authSideProps } from "../../../middlewares";
import { getOrderFullByIdOptions } from "../../../services";
import OrderContent from "../../../components/Order/OrderContent";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../components/_App/NavbarThree";
import Link from "next/link";
import { useIdPage } from "../../../hooks";

const Order = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getOrderFullByIdOptions(field, authToken),
  });

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>Orders</h1>
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
        </div>

        <OrderContent {...props} />
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderFullByIdOptions(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: `Order ${id}` };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
  });

export default Order;

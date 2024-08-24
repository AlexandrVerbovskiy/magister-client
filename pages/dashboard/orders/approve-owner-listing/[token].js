import React, { useState } from "react";
import { authSideProps } from "../../../../middlewares";
import { getOwnerListingScanRentalCode } from "../../../../services";
import OrderContent from "../../../../components/Order/OrderContent";
import DashboardNavbar from "../../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../../components/_App/NavbarThree";
import Link from "next/link";
import { useIdPage } from "../../../../hooks";
import ChecklistForm from "../../../../components/Checklist/ChecklistForm";
import ApprovedSection from "../../../../components/Checklist/ApprovedSection";

const ApproveOwnerListing = (baseProps) => {
  const [step, setStep] = useState("start");

  const { props } = useIdPage({
    baseProps,
    observingField: "token",
    getPagePropsFunc: ({ field, authToken }) =>
      getOwnerListingScanRentalCode(field, authToken),
  });

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        {step == "start" ? (
          <>
            <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
              <div className="col-12 result-count">
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
            </div>

            <OrderContent {...props} operationsDisabled={true} />

            <ChecklistForm
              {...props}
              type="finish"
              onSubmit={() => setStep("finished")}
            />
          </>
        ) : (
          <ApprovedSection type="finish" />
        )}
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const token = context.params.token;
  const options = await getOwnerListingScanRentalCode(
    token,
    baseSideProps.authToken
  );
  return { ...options, token };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Approve getting listing" },
  });

export default ApproveOwnerListing;

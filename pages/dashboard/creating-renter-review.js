import { useState } from "react";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import StatusBar from "../../components/StatusBar";
import NavbarThree from "../../components/_App/NavbarThree";
import { getOrderReviewByOwnerOptions } from "../../services";
import { authSideProps } from "../../middlewares";
import FinishedPart from "../../components/Dashboard/Reviews/FinishedPart";
import UserReviewForm from "../../components/Dashboard/Reviews/UserReviewForm";

const FullReview = (pageProps) => {
  const [currentStep, setCurrentStep] = useState("renter");

  const statusBarOptions = [
    {
      title: "Review the renter",
      finished: true,
    },
    { title: "Finish", finished: currentStep == "finished" },
  ];

  const handleRenterReviewSubmit = (data) => {
    setCurrentStep("finished");
  };

  console.log(pageProps.order);

  return (
    <>
      <DashboardNavbar />

      <div
        className="main-content d-flex flex-column"
        style={{ marginBottom: "50px" }}
      >
        <NavbarThree />

        <StatusBar statuses={statusBarOptions} hasCancelStatus={false} />

        {currentStep == "renter" && (
          <UserReviewForm
            data={{
              userName: pageProps.order.tenantName,
              userPhoto: pageProps.order.tenantPhoto,
              userCountItems: pageProps.order.tenantCountItems,
            }}
            onSubmit={handleRenterReviewSubmit}
          />
        )}

        {currentStep == "finished" && <FinishedPart />}
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getOrderReviewByOwnerOptions(
    4,
    baseSideProps.authToken
  );

  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default FullReview;

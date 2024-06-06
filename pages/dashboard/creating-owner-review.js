import { useState } from "react";
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar";
import StatusBar from "../../components/StatusBar";
import NavbarThree from "../../components/_App/NavbarThree";
import { getOrderReviewByTenantOptions } from "../../services";
import { authSideProps } from "../../middlewares";
import ImagePopup from "../../components/_App/ImagePopup";
import ListingReviewForm from "../../components/Dashboard/Reviews/ListingReviewForm";
import UserReviewForm from "../../components/Dashboard/Reviews/UserReviewForm";
import FinishedPart from "../../components/Dashboard/Reviews/FinishedPart";

const FullReview = (pageProps) => {
  const [currentStep, setCurrentStep] = useState("item");
  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const [listingReview, setListingReview] = useState({});
  console.log(pageProps.order.ownerCountItems);

  const statusBarOptions = [
    { title: "Review the item", finished: true },
    {
      title: "Review the owner",
      finished: ["owner", "finished"].includes(currentStep),
    },
    { title: "Finish", finished: currentStep == "finished" },
  ];

  const handleListingReviewSubmit = (data) => {
    setListingReview(data);
    setCurrentStep("owner");
  };

  const handleBackToItemReview = () => {
    setCurrentStep("item");
  };

  const handleOwnerReviewSubmit = (data) => {
    setCurrentStep("finished");
  };

  return (
    <>
      <DashboardNavbar />

      <div
        className="main-content d-flex flex-column"
        style={{ marginBottom: "50px" }}
      >
        <NavbarThree />

        <StatusBar statuses={statusBarOptions} hasCancelStatus={false} />

        {currentStep == "item" && (
          <ListingReviewForm
            order={pageProps.order}
            onSubmit={handleListingReviewSubmit}
            setCurrentOpenImg={setCurrentOpenImg}
          />
        )}

        {currentStep == "owner" && (
          <UserReviewForm
            data={{
              userName: pageProps.order.ownerName,
              userPhoto: pageProps.order.ownerPhoto,
              userCountItems: pageProps.order.ownerCountItems,
            }}
            onSubmit={handleOwnerReviewSubmit}
            goBack={handleBackToItemReview}
          />
        )}

        {currentStep == "finished" && <FinishedPart />}
      </div>

      <ImagePopup
        photoUrl={currentOpenImg}
        open={currentOpenImg}
        close={() => setCurrentOpenImg(null)}
      />
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getOrderReviewByTenantOptions(
    4,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default FullReview;

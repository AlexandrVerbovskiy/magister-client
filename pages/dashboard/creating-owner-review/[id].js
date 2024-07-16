import { useContext, useState } from "react";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import StatusBar from "../../../components/StatusBar";
import NavbarThree from "../../../components/_App/NavbarThree";
import {
  createOwnerReview,
  getOrderReviewByTenantOptions,
} from "../../../services";
import { authSideProps } from "../../../middlewares";
import ImagePopup from "../../../components/_App/ImagePopup";
import ListingReviewForm from "../../../components/Dashboard/Reviews/ListingReviewForm";
import UserReviewForm from "../../../components/Dashboard/Reviews/UserReviewForm";
import FinishedPart from "../../../components/Dashboard/Reviews/FinishedPart";
import { useRouter } from "next/router";
import { IndiceContext } from "../../../contexts";
import YesNoModal from "../../../components/_App/YesNoModal";
import { useListingReview, useUserReview } from "../../../hooks";

const FullReview = (pageProps) => {
  const router = useRouter();
  const { id } = router.query;
  const [currentStep, setCurrentStep] = useState("item");
  const [currentOpenImg, setCurrentOpenImg] = useState(null);

  const {
    starOptions: listingStarOptions,
    setStarOptions: setListingStarOptions,
    description: listingDescription,
    setDescription: setListingDescription,
    dataToSubmit: listingDataToSubmit,
  } = useListingReview();

  const {
    starOptions: ownerStarOptions,
    setStarOptions: setOwnerStarOptions,
    description: ownerDescription,
    setDescription: setOwnerDescription,
    leaveFeedback: leaveOwnerDescription,
    setLeaveFeedback: setLeaveOwnerDescription,
    dataToSubmit: ownerDataToSubmit,
  } = useUserReview();

  const { authToken, error } = useContext(IndiceContext);
  const [activeSaveModal, setActiveSaveModal] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const statusBarOptions = [
    { title: "Review the item", finished: true },
    {
      title: "Review the owner",
      finished: ["owner", "finished"].includes(currentStep),
    },
    { title: "Finish", finished: currentStep == "finished" },
  ];

  const handleListingReviewSubmit = () => {
    setCurrentStep("owner");
  };

  const handleBackToItemReview = () => {
    setCurrentStep("item");
  };

  const handleOwnerReviewSubmit = () => {
    setActiveSaveModal(true);
  };

  const handleOwnerReviewSubmitConfirm = async () => {
    try {
      setDisabled(true);

      await createOwnerReview(
        {
          ownerCommentInfo: ownerDataToSubmit(),
          listingCommentInfo: listingDataToSubmit(),
          orderId: id,
        },
        authToken
      );

      setCurrentStep("finished");
    } catch (e) {
      error.set(e.message);
    } finally {
      setDisabled(false);
    }
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
            submitButtonText="Continue"
            disabled={disabled}
            starOptions={listingStarOptions}
            setStarOptions={setListingStarOptions}
            description={listingDescription}
            setDescription={setListingDescription}
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
            disabled={disabled}
            starOptions={ownerStarOptions}
            setStarOptions={setOwnerStarOptions}
            description={ownerDescription}
            setDescription={setOwnerDescription}
            leaveFeedback={leaveOwnerDescription}
            setLeaveFeedback={setLeaveOwnerDescription}
          />
        )}

        {currentStep == "finished" && <FinishedPart />}
      </div>

      <ImagePopup
        photoUrl={currentOpenImg}
        open={currentOpenImg}
        close={() => setCurrentOpenImg(null)}
      />

      <YesNoModal
        active={activeSaveModal}
        closeModal={() => setActiveSaveModal(false)}
        title="Confirmation is required to perform the operation"
        body='Please click "Confirm" to complete the review'
        onAccept={handleOwnerReviewSubmitConfirm}
        acceptText="Confirm"
      />
    </>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getOrderReviewByTenantOptions(
    id,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default FullReview;

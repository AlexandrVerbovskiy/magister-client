import { useContext, useState } from "react";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import NavbarThree from "../../../components/_App/NavbarThree";
import {
  createOwnerReview,
  getOrderReviewByRenterOptions,
} from "../../../services";
import { authSideProps } from "../../../middlewares";
import ImagePopup from "../../../components/_App/ImagePopup";
import UserReviewForm from "../../../components/Dashboard/Reviews/UserReviewForm";
import FinishedPart from "../../../components/Dashboard/Reviews/FinishedPart";
import { useRouter } from "next/router";
import { IndiceContext } from "../../../contexts";
import YesNoModal from "../../../components/_App/YesNoModal";
import { useOwnerReview } from "../../../hooks";
import { useIdPage } from "../../../hooks";

const FullReview = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getOrderReviewByRenterOptions(field, authToken),
  });

  const router = useRouter();
  const { id } = router.query;
  const [currentStep, setCurrentStep] = useState("owner");
  const [currentOpenImg, setCurrentOpenImg] = useState(null);

  const {
    starOptions: ownerStarOptions,
    setStarOptions: setOwnerStarOptions,
    description: ownerDescription,
    setDescription: setOwnerDescription,
    leaveFeedback: leaveOwnerDescription,
    setLeaveFeedback: setLeaveOwnerDescription,
    dataToSubmit: ownerDataToSubmit,
  } = useOwnerReview();

  const { authToken, error } = useContext(IndiceContext);
  const [activeSaveModal, setActiveSaveModal] = useState(false);

  const [disabled, setDisabled] = useState(false);

  const handleOwnerReviewSubmit = () => {
    setActiveSaveModal(true);
  };

  const handleOwnerReviewSubmitConfirm = async () => {
    try {
      setDisabled(true);

      await createOwnerReview(
        {
          ownerCommentInfo: ownerDataToSubmit(),
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

        {currentStep == "owner" && (
          <UserReviewForm
            data={{
              userName: props.order.ownerName,
              userPhoto: props.order.ownerPhoto,
              userCountItems: props.order.ownerCountItems,
              userAverageRating: props.order.ownerAverageRating,
              userCommentCount: props.order.ownerCommentCount,
            }}
            onSubmit={handleOwnerReviewSubmit}
            disabled={disabled}
            starOptions={ownerStarOptions}
            setStarOptions={setOwnerStarOptions}
            description={ownerDescription}
            setDescription={setOwnerDescription}
            leaveFeedback={leaveOwnerDescription}
            setLeaveFeedback={setLeaveOwnerDescription}
            type="owner"
          />
        )}

        {currentStep == "finished" && <FinishedPart isReviewerOwner={true} />}
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
  const options = await getOrderReviewByRenterOptions(
    id,
    baseSideProps.authToken
  );
  return { ...options };
};

export const getServerSideProps = (context) =>
  authSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Creating review" },
  });

export default FullReview;

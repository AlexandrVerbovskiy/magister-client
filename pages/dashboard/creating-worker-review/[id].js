import { useContext, useState } from "react";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import StatusBar from "../../../components/StatusBar";
import NavbarThree from "../../../components/_App/NavbarThree";
import {
  createRenterReview,
  getOrderReviewByOwnerOptions,
} from "../../../services";
import { authSideProps } from "../../../middlewares";
import FinishedPart from "../../../components/Dashboard/Reviews/FinishedPart";
import UserReviewForm from "../../../components/Dashboard/Reviews/UserReviewForm";
import { useRouter } from "next/router";
import YesNoModal from "../../../components/_App/YesNoModal";
import { IndiceContext } from "../../../contexts";
import { useRenterReview } from "../../../hooks";
import { useIdPage } from "../../../hooks";

const FullReview = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getOrderReviewByOwnerOptions(field, authToken),
  });

  const router = useRouter();
  const { id } = router.query;
  const [currentStep, setCurrentStep] = useState("renter");
  const { authToken, error } = useContext(IndiceContext);
  const [activeSaveModal, setActiveSaveModal] = useState(false);
  const {
    starOptions: renterStarOptions,
    setStarOptions: setRenterStarOptions,
    description: renterDescription,
    setDescription: setRenterDescription,
    leaveFeedback: leaveRenterDescription,
    setLeaveFeedback: setLeaveRenterDescription,
    dataToSubmit: renterDataToSubmit,
  } = useRenterReview();

  const [disabled, setDisabled] = useState(false);

  const handleRenterReviewSubmit = () => {
    setActiveSaveModal(true);
  };

  const handleRenterReviewSubmitConfirm = async () => {
    try {
      setDisabled(true);

      await createRenterReview(
        { renterCommentInfo: renterDataToSubmit(), orderId: id },
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

        {currentStep == "renter" && (
          <UserReviewForm
            data={{
              userName: props.order.renterName,
              userPhoto: props.order.renterPhoto,
              userCountItems: props.order.renterCountItems,
              userAverageRating: props.order.renterAverageRating,
              userCommentCount: props.order.renterCommentCount,
            }}
            onSubmit={handleRenterReviewSubmit}
            disabled={disabled}
            starOptions={renterStarOptions}
            setStarOptions={setRenterStarOptions}
            description={renterDescription}
            setDescription={setRenterDescription}
            leaveFeedback={leaveRenterDescription}
            setLeaveFeedback={setLeaveRenterDescription}
            type="renter"
          />
        )}

        {currentStep == "finished" && <FinishedPart />}
      </div>

      <YesNoModal
        active={activeSaveModal}
        closeModal={() => setActiveSaveModal(false)}
        title="Confirmation is required to perform the operation"
        body='Please click "Confirm" to complete the review'
        onAccept={handleRenterReviewSubmitConfirm}
        acceptText="Confirm"
      />
    </>
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getOrderReviewByOwnerOptions(
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

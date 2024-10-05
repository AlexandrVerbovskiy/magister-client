import { useContext, useState } from "react";
import DashboardNavbar from "../../../components/Dashboard/DashboardNavbar";
import StatusBar from "../../../components/StatusBar";
import NavbarThree from "../../../components/_App/NavbarThree";
import {
  createWorkerReview,
  getOrderReviewByOwnerOptions,
} from "../../../services";
import { authSideProps } from "../../../middlewares";
import FinishedPart from "../../../components/Dashboard/Reviews/FinishedPart";
import UserReviewForm from "../../../components/Dashboard/Reviews/UserReviewForm";
import { useRouter } from "next/router";
import YesNoModal from "../../../components/_App/YesNoModal";
import { IndiceContext } from "../../../contexts";
import { useWorkerReview } from "../../../hooks";
import { useIdPage } from "../../../hooks";

const FullReview = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getOrderReviewByOwnerOptions(field, authToken),
  });

  const router = useRouter();
  const { id } = router.query;
  const [currentStep, setCurrentStep] = useState("worker");
  const { authToken, error } = useContext(IndiceContext);
  const [activeSaveModal, setActiveSaveModal] = useState(false);
  const {
    starOptions: workerStarOptions,
    setStarOptions: setWorkerStarOptions,
    description: workerDescription,
    setDescription: setWorkerDescription,
    leaveFeedback: leaveWorkerDescription,
    setLeaveFeedback: setLeaveWorkerDescription,
    dataToSubmit: workerDataToSubmit,
  } = useWorkerReview();

  const [disabled, setDisabled] = useState(false);

  const handleWorkerReviewSubmit = () => {
    setActiveSaveModal(true);
  };

  const handleWorkerReviewSubmitConfirm = async () => {
    try {
      setDisabled(true);

      await createWorkerReview(
        { workerCommentInfo: workerDataToSubmit(), orderId: id },
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

        {currentStep == "worker" && (
          <UserReviewForm
            data={{
              userName: props.order.workerName,
              userPhoto: props.order.workerPhoto,
              userCountItems: props.order.workerCountItems,
              userAverageRating: props.order.workerAverageRating,
              userCommentCount: props.order.workerCommentCount,
            }}
            onSubmit={handleWorkerReviewSubmit}
            disabled={disabled}
            starOptions={workerStarOptions}
            setStarOptions={setWorkerStarOptions}
            description={workerDescription}
            setDescription={setWorkerDescription}
            leaveFeedback={leaveWorkerDescription}
            setLeaveFeedback={setLeaveWorkerDescription}
            type="worker"
          />
        )}

        {currentStep == "finished" && <FinishedPart />}
      </div>

      <YesNoModal
        active={activeSaveModal}
        closeModal={() => setActiveSaveModal(false)}
        title="Confirmation is required to perform the operation"
        body='Please click "Confirm" to complete the review'
        onAccept={handleWorkerReviewSubmitConfirm}
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

import { useState } from "react";
import NavbarThree from "../../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../../components/Dashboard/DashboardNavbar";
import CreateDisputeSection from "../../../../components/Dispute/CreateDisputeSection";
import { useCreateDispute, useIdPage } from "../../../../hooks";
import { authSideProps } from "../../../../middlewares";
import {
  createDispute as handleCreateDispute,
  getOrderFullByIdForDisputeOptions,
} from "../../../../services";
import ImagePopup from "../../../../components/_App/ImagePopup";
import { useRouter } from "next/router";
import SuccessIconPopup from "../../../../components/IconPopups/SuccessIconPopup";
import YesNoModal from "../../../../components/_App/YesNoModal";

const CreateDispute = (baseProps) => {
  const router = useRouter();
  const { props, authToken } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getOrderFullByIdForDisputeOptions(field, authToken),
  });

  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const [yesNoActive, setYesNoActive] = useState(false);

  const closeCurrentOpenImg = () => setCurrentOpenImg(null);
  const disputeOptions = useCreateDispute({ order: props.order });

  const [successIconPopupState, setSuccessIconPopupState] = useState({});

  const handleGoBack = () => {
    router.back();
  };

  const handleOpenDispute = () => {
    setYesNoActive(true);
  };

  const onAccept = async () => {
    try {
      await handleCreateDispute(
        {
          orderId: props.order.id,
          type: disputeOptions.type,
          description: disputeOptions.description,
        },
        authToken
      );

      setSuccessIconPopupState({
        active: true,
        onClose: () => {
          router.push("/dashboard/orders/");
          setSuccessIconPopupState({});
        },
      });
    } catch (e) {
      disputeOptions.setError(e.message);
    }
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="miran-grid-sorting row align-items-center d-none d-xl-block">
          <div className="col-12 result-count">
            <div className="breadcrumb-area">
              <h1>Dispute</h1>
            </div>
          </div>
        </div>

        <CreateDisputeSection
          {...disputeOptions}
          onGoBack={handleGoBack}
          setCurrentOpenImg={setCurrentOpenImg}
          onSubmit={handleOpenDispute}
        />
        <ImagePopup
          photoUrl={currentOpenImg}
          open={!!currentOpenImg}
          close={closeCurrentOpenImg}
        />

        <SuccessIconPopup
          modalActive={successIconPopupState.active}
          closeModal={successIconPopupState.onClose}
          text="Dispute created successfully"
        />

        <YesNoModal
          title="Do you really want to create dispute?"
          active={yesNoActive}
          closeModal={() => setYesNoActive(false)}
          onAccept={onAccept}
          acceptText="Create"
          closeModalClassName="Cancel"
          acceptModalClassName="button-danger"
        />
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderFullByIdForDisputeOptions(id, baseSideProps.authToken);
  return { ...options, id, pageTitle: `Dispute ${id}` };
};

export const getServerSideProps = (context) =>
  authSideProps({ context, callback: boostServerSideProps });

export default CreateDispute;

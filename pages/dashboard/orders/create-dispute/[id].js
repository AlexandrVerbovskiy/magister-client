import { useContext, useState } from "react";
import NavbarThree from "../../../../components/_App/NavbarThree";
import DashboardNavbar from "../../../../components/Dashboard/DashboardNavbar";
import CreateDisputeSection from "../../../../components/Dispute/CreateDisputeSection";
import { useCreateDispute, useIdPage } from "../../../../hooks";
import { authSideProps } from "../../../../middlewares";
import {
  createDispute as handleCreateDispute,
  getOrderFullByIdOptions,
} from "../../../../services";
import ImagePopup from "../../../../components/_App/ImagePopup";
import { IndiceContext } from "../../../../contexts";
import { useRouter } from "next/router";

const CreateDispute = (baseProps) => {
  const router = useRouter();
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getOrderFullByIdOptions(field, authToken),
  });

  const { success } = useContext(IndiceContext);
  const [currentOpenImg, setCurrentOpenImg] = useState(null);
  const closeCurrentOpenImg = () => setCurrentOpenImg(null);
  const disputeOptions = useCreateDispute({ order: props.order });

  const handleGoBack = () => {
    router.back();
  };

  const handleOpenDispute = async () => {
    try {
      await handleCreateDispute(
        {
          orderId: order.id,
          type: disputeOptions.type,
          description: disputeOptions.description,
        },
        authToken
      );

      success.set("Dispute created success");
      router.push("/dashboard/orders/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <DashboardNavbar />

      <div className="main-content d-flex flex-column">
        <NavbarThree />

        <div className="header-section">
          <div className="breadcrumb-area">
            <h1>Dispute</h1>
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
      </div>
    </>
  );
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getOrderFullByIdOptions(id, baseSideProps.authToken);
  return { ...options, id };
};

export const getServerSideProps = (context) =>
  authSideProps(context, boostServerSideProps);

export default CreateDispute;

import { getDisputePredictionModelDetails } from "../../../../services";
import { adminSideProps } from "../../../../middlewares";
import { useState } from "react";
import EditForm from "../../../../components/admin/DisputePrediction/EditForm";

const EditDisputePrediction = ({ model, structure }) => {
  const [base, setBase] = useState({ ...model, id: null });

  return <EditForm structure={structure} base={base} setBase={setBase} />;
};

const boostServerSideProps = async ({ baseSideProps, context }) => {
  const id = context.params.id;
  const options = await getDisputePredictionModelDetails(
    id,
    baseSideProps.authToken
  );
  return { ...options, pageTitle: `Edit Dispute Prediction#${id}` };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
  });

export default EditDisputePrediction;

import { getTableRelations } from "../../../services";
import { adminSideProps } from "../../../middlewares";
import { useState } from "react";
import EditForm from "../../../components/admin/DisputePrediction/EditForm";

const CreateDisputePrediction = ({ structure }) => {
  const [base, setBase] = useState(null);

  return <EditForm structure={structure} base={base} setBase={setBase} />;
};

const boostServerSideProps = async ({ baseSideProps }) => {
  const options = await getTableRelations(baseSideProps.authToken);
  return { ...options };
};

export const getServerSideProps = (context) =>
  adminSideProps({
    context,
    callback: boostServerSideProps,
    baseProps: { pageTitle: "Create Dispute Prediction" },
  });

export default CreateDisputePrediction;

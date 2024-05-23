import BaseSenderView from "../../../../components/admin/BaseSenderView";
import { adminSideProps } from "../../../../middlewares";
import { getAdminSenderPaymentOptions } from "../../../../services";

const SenderWaitingApproval = ({ payment }) => {
  return (
    <BaseSenderView payment={payment} parentType="waiting-approval-senders" />
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getAdminSenderPaymentOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default SenderWaitingApproval;

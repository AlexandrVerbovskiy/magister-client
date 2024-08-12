import BaseSenderView from "../../../../components/admin/SenderPayments/BaseSenderView";
import { useIdPage } from "../../../../hooks";
import { adminSideProps } from "../../../../middlewares";
import { getAdminSenderPaymentOptions } from "../../../../services";

const Sender = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getAdminSenderPaymentOptions(field, authToken),
  });

  return <BaseSenderView payment={props.payment} parentType="senders" />;
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getAdminSenderPaymentOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id, pageTitle: `Payment #${id}` };
};

export const getServerSideProps = (context) =>
  adminSideProps({ context, callback: boostServerSideProps });

export default Sender;

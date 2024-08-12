import { adminSideProps } from "../../../../middlewares";
import { getAdminRecipientPaymentOptions } from "../../../../services";
import SingleRecipientMainComponent from "../../../../components/admin/SingleRecipientMainComponent";
import { useIdPage } from "../../../../hooks";

const Recipient = (baseProps) => {
  const { props } = useIdPage({
    baseProps,
    getPagePropsFunc: ({ field, authToken }) =>
      getAdminRecipientPaymentOptions(field, authToken),
  });

  return (
    <SingleRecipientMainComponent
      recipient={props.recipient}
      refundCommission={props.refundCommission}
    />
  );
};

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getAdminRecipientPaymentOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id, pageTitle: `Recipient #${id}` };
};

export const getServerSideProps = (context) =>
  adminSideProps({ context, callback: boostServerSideProps });

export default Recipient;

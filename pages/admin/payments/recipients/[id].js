import { adminSideProps } from "../../../../middlewares";
import {
  getAdminRecipientPaymentOptions,
} from "../../../../services";
import SingleRecipientMainComponent from "../../../../components/admin/SingleRecipientMainComponent";

const Recipient = ({ recipient, refundCommission }) => (
  <SingleRecipientMainComponent
    recipient={recipient}
    refundCommission={refundCommission}
  />
);

const boostServerSideProps = async ({ context, baseSideProps }) => {
  const id = context.params.id;
  const options = await getAdminRecipientPaymentOptions(
    id,
    baseSideProps.authToken
  );

  return { ...options, id };
};

export const getServerSideProps = (context) =>
  adminSideProps(context, boostServerSideProps);

export default Recipient;

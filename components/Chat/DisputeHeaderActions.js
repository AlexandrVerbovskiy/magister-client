import Link from "next/link";
import { useContext } from "react";
import { IndiceContext } from "../../contexts";

const DisputeHeaderActions = ({ dispute }) => {
  const { sessionUser } = useContext(IndiceContext);
  /*const isOwner = sessionUser.id == dispute.ownerId;
  const isTenant = sessionUser.id == dispute.tenantId;*/

  return (
    <>
      <Link
        className="message-content-action"
        href={`/dashboard/orders/` + dispute.orderId}
      >
        <i className="bx bx-purchase-tag"></i> View Order
      </Link>
      <Link
        className="message-content-action"
        href={`/dashboard/listings/` + dispute.listingId}
      >
        <i className="bx bx-layer"></i> View Item
      </Link>
    </>
  );
};

export default DisputeHeaderActions;

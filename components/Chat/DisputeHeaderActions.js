import Link from "next/link";
import { useRouter } from "next/router";

const DisputeHeaderActions = ({ dispute }) => {
  const router = useRouter();

  const handleOrderChatClick = (e) => {
    e.preventDefault();
    router.push(`/dashboard/chats/${dispute.chatId}/`);
  };

  return (
    <>
      <Link
        className="dropdown-item d-flex align-items-center"
        href={`/dashboard/orders/${dispute.orderId}/`}
      >
        <i className="bx bx-purchase-tag"></i> View Order
      </Link>
      <Link
        className="dropdown-item d-flex align-items-center"
        href={`/listings/${dispute.listingId}/`}
      >
        <i className="bx bx-layer"></i> View Item
      </Link>
      <button
        type="button"
        className="dropdown-item d-flex align-items-center"
        onClick={handleOrderChatClick}
      >
        <i className="bx bx-chat"></i> Order Chat
      </button>
    </>
  );
};

export default DisputeHeaderActions;

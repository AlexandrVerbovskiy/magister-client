import { useRouter } from "next/router";

const OrderChat = () => {
  const router = useRouter();
  const { orderId } = router.query;

  return <div></div>;
};

export default OrderChat;

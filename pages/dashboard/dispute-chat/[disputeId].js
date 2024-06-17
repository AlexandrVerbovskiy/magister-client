import { useRouter } from "next/router";

const DisputeChat = () => {
  const router = useRouter();
  const { disputeId } = router.query;

  return <div></div>;
};

export default DisputeChat;

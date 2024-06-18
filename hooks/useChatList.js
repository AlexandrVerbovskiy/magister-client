import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../contexts";

const useChatList = ({ chats: baseChats, canShowMore: baseCanShowMore }) => {
  const { io } = useContext(IndiceContext);
  const [type, setType] = useState("orders");
  const [filter, setFilter] = useState("");
  const [chats, setBaseChats] = useState(baseChats);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);

  useEffect(() => {
    if (!io) {
      return;
    }
  });

  const handleChangeType = (newType) => {
    if (newType == "disputes") {
      setType("disputes");
    } else {
      setType("orders");
    }
  };

  return {
    type,
    chats,
    handleChangeType,
    filter,
    setFilter,
    canShowMore,
  };
};

export default useChatList;

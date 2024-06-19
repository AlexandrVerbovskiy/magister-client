import { useContext, useEffect, useState } from "react";
import { IndiceContext } from "../contexts";
import { getChatList } from "../services/chat";

const useChatList = ({
  chats: baseChats,
  canShowMore: baseCanShowMore,
  options,
}) => {
  const { io, authToken } = useContext(IndiceContext);
  const [type, setType] = useState(options.chatType ?? "orders");
  const [filter, setFilter] = useState("");
  const [chats, setChats] = useState(baseChats);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!io) {
      return;
    }
  });

  const handleChangeType = async (newType) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (newType != "disputes") {
        newType = "orders";
      }

      setType(newType);

      const result = await getChatList(
        {
          chatType: newType,
          lastChatId: null,
        },
        authToken
      );

      setCanShowMore(result.canShowMore);
      setChats([...result.chats]);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleShowMore = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const lastChatId = chats[chats.length - 1];

      if (lastChatId == 0) {
        return;
      }

      const chatList = await getChatList(
        {
          chatType: type,
          lastChatId,
        },
        authToken
      );

      setChats((prev) => [...prev, ...chatList]);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return {
    type,
    chats,
    handleChangeType,
    filter,
    setFilter,
    canShowMore,
    handleShowMore,
  };
};

export default useChatList;

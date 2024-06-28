import { useContext, useEffect, useRef, useState } from "react";
import { IndiceContext } from "../contexts";
import { getAdminChatList } from "../services/chat";

const useAdminChatList = ({
  chats: baseChats,
  canShowMore: baseCanShowMore,
  authToken,
}) => {
  const { io } = useContext(IndiceContext);
  const [filter, setFilter] = useState("");
  const [filterChats, setFilterChats] = useState([]);
  const [chats, setChats] = useState(baseChats);
  const [canShowMore, setCanShowMore] = useState(baseCanShowMore);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!io) {
      return;
    }
  }, [io]);

  const handleShowMore = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (!chats.length) {
        return;
      }

      const lastChatId = chats[chats.length - 1].id;

      const result = await getAdminChatList({ lastChatId }, authToken);

      setCanShowMore(result.chatsCanShowMore);
      setChats([...chats, ...result.chats]);
    } catch (e) {
      // Обробка помилок
    } finally {
      setLoading(false);
    }
  };

  const getFilterChats = async (filter) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (!filter) {
        setFilterChats([]);
        return;
      }

      const result = await getAdminChatList(
        {
          chatFilter: filter,
        },
        authToken
      );

      setFilterChats(result.chats);
    } catch (e) {
      // Обробка помилок
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      getFilterChats(filter);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [filter]);

  return {
    loading,
    chats,
    filter,
    setFilter,
    filterChats,
    canShowMore,
    handleShowMore,
  };
};

export default useAdminChatList;

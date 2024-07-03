import { useEffect, useRef, useState } from "react";
import {
  getAdminChatBaseInfo,
  getAdminChatMessageList,
} from "../services/chat";
import useChatMessageListBase from "./useChatMessageListBase";
import STATIC from "../static";

const useAdminChatMessageList = (props) => {
  const {
    order: baseOrder = null,
    dispute: baseDispute = null,
    dopInfo: baseDopInfo = null,
    searchChatType: baseSearchChatType = null,
  } = props;

  const [order, setOrder] = useState(baseOrder);
  const [dispute, setDispute] = useState(baseDispute);
  const [dopInfo, setDopInfo] = useState(baseDopInfo);

  const [isSubChat, setIsSubChat] = useState(
    baseSearchChatType == STATIC.CHAT_TYPES.DISPUTE
  );

  const onChangeChat = (result) => {
    setOrder(result.order);
    setDispute(result.dispute);
    setDopInfo(result.dopInfo);
    setIsSubChat(result.searchChatType == STATIC.CHAT_TYPES.DISPUTE);
  };

  const onReset = () => {
    setOrder(null);
    setDispute(null);
    setDopInfo(null);
    setIsSubChat(false);
  };

  const baseMessageListOptions = useChatMessageListBase({
    ...props,
    getMessageList: getAdminChatMessageList,
    getChatInfo: getAdminChatBaseInfo,
    onChangeChat,
    onReset,
  });

  const handleOrderUpdate = (orderPart) => {
    if (orderPart.id === order?.id) {
      setOrder((prevOrder) => ({ ...prevOrder, ...orderPart }));
    }
  };

  const handleDisputeUpdate = (disputePart) => {
    if (disputePart.id === dispute?.id) {
      setDispute((prevDispute) => ({ ...prevDispute, ...disputePart }));
    }
  };

  return {
    order,
    dispute,
    dopInfo,
    isSubChat,
    handleOrderUpdate,
    handleDisputeUpdate,
    ...baseMessageListOptions,
  };
};

export default useAdminChatMessageList;

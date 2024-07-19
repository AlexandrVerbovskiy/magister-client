import { useState } from "react";
import { getChatBaseInfo, getChatMessageList } from "../services/chat";
import useChatMessageListBase from "./useChatMessageListBase";

const useChatMessageList = (props) => {
  const { entity: baseEntity = null, dopEntityInfo: baseDopEntityInfo = null } =
    props;

  const [entity, setEntity] = useState(baseEntity);
  const [dopEntityInfo, setDopEntityInfo] = useState(baseDopEntityInfo);

  const onChangeChat = (result) => {
    setEntity(result.entity);
    setDopEntityInfo(result.dopEntityInfo);
  };

  const onReset = () => {
    setEntity(null);
    setDopEntityInfo(null);
  };

  const baseMessageListOptions = useChatMessageListBase({
    ...props,
    getMessageList: getChatMessageList,
    getChatInfo: getChatBaseInfo,
    onChangeChat,
    onReset,
  });

  const updateEntity = (part) => {
    setEntity((prev) => ({ ...prev, ...part }));
  };

  const handleOrderUpdate = (orderPart) => {    
    if (orderPart.id === entity?.id) {
      setEntity((prevEntity) => ({ ...prevEntity, ...orderPart }));
    }
  };

  return {
    updateEntity,
    entity,
    dopEntityInfo,
    handleOrderUpdate,
    ...baseMessageListOptions,
  };
};

export default useChatMessageList;

import { useState } from "react";
import STATIC from "../static";
import { getRelativeCoordinates } from "../utils";

const useMessage = ({
  id,
  isAuthor,
  type,
  tempKey = null,
  chatId,
  handleDeleteMessage,
  handleChangeUpdatingMessageId,
  messageRef,
  messageParentRef,
  popupMarginRight = 21.28,
  popupMarginLeft = 21.28,
  popupMarginBottom = 15,
  authorMessageLocation = STATIC.AUTHOR_MESSAGE_LOCATIONS.RIGHT,
}) => {
  const [activePopup, setActivePopup] = useState(false);
  const [popupCoords, setPopupCoords] = useState({ bottom: 0, left: 0 });

  const isTemp = !!tempKey;
  const isText = type == STATIC.MESSAGE_TYPES.TEXT;

  const isManuallySent = [
    STATIC.MESSAGE_TYPES.TEXT,
    STATIC.MESSAGE_TYPES.IMAGE,
    STATIC.MESSAGE_TYPES.FILE,
    STATIC.MESSAGE_TYPES.VIDEO,
    STATIC.MESSAGE_TYPES.AUDIO,
  ].includes(type);

  const closePopup = () => setActivePopup(false);

  const handleActivateEditPopup = (e) => {
    if (!isAuthor || isTemp || !isManuallySent) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const messageCoords = getRelativeCoordinates(
      messageRef.current,
      messageParentRef.current
    );

    if (authorMessageLocation == STATIC.AUTHOR_MESSAGE_LOCATIONS.RIGHT) {
      const popupRight = messageCoords.right - popupMarginRight;

      setPopupCoords({
        bottom: `${popupMarginBottom}px`,
        right: popupRight + "px",
        transform: "translate(-100%, 100%)",
      });
    } else {
      const popupLeft = messageCoords.left - popupMarginLeft;

      setPopupCoords({
        bottom: `${popupMarginBottom}px`,
        left: popupLeft + "px",
        transform: "translate(0, 100%)",
      });
    }

    setActivePopup(true);
  };

  const handleEditClick = () => {
    handleChangeUpdatingMessageId(id);
    closePopup();
  };

  const handleDeleteClick = () => {
    handleDeleteMessage({ messageId: id, chatId });
    closePopup();
  };

  return {
    activePopup,
    popupCoords,
    isTemp,
    isText,
    isManuallySent,
    closePopup,
    handleActivateEditPopup,
    handleEditClick,
    handleDeleteClick,
  };
};

export default useMessage;

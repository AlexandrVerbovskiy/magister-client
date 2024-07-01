import React, { useState, useEffect, useRef } from "react";

const useChatWindowsChanger = (chatId) => {
  const [activeWindow, setActiveWindow] = useState(chatId ? "chat" : "list");
  const bodyRef = useRef(null);
  const bodyTriggerRef = useRef(null);

  const scrollToChatList = () =>
    bodyRef.current.firstElementChild.scrollIntoView({ behavior: "smooth" });

  const scrollToChatBody = () =>
    bodyRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (bodyRef.current && activeWindow == "list") {
      scrollToChatList();
    }

    if (bodyRef.current && activeWindow == "chat") {
      scrollToChatBody();
    }
  }, [activeWindow]);

  const handleSetChatWindow = () => {
    if (activeWindow == "chat") {
      scrollToChatBody();
    } else {
      setActiveWindow("chat");
    }
  };

  const handleSetListWindow = () => {
    if (activeWindow == "list") {
      scrollToChatList();
    } else {
      setActiveWindow("list");
    }
  };

  const scrollBodyBottom = () => {
    const interval = setInterval(() => {

      if (bodyTriggerRef.current) {
        bodyTriggerRef.current.scrollIntoView({ behavior: "smooth" });
        clearInterval(interval);
      }
    }, 100);
  };

  return {
    bodyRef,
    setListWindow: handleSetListWindow,
    setChatWindow: handleSetChatWindow,
    scrollBodyBottom,
    bodyTriggerRef,
  };
};

export default useChatWindowsChanger;

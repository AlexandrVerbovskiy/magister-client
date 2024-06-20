import React, { useState, useEffect, useRef } from "react";

const useChatWindowsChanger = (chatId) => {
  const [activeWindow, setActiveWindow] = useState(chatId ? "chat" : "list");
  const bodyRef = useRef(null);

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

  const setListWindow = () => {
    setActiveWindow("list");
  };

  const scrollBodyBottom = () => {
    const observer = new MutationObserver((mutations, observer) => {
      const bodyElement = bodyRef.current.lastElementChild;
      const chatElements = bodyElement
        ? bodyElement.querySelectorAll(".chat")
        : [];
      const lastElement = chatElements[chatElements.length - 1];

      if (lastElement) {
        lastElement.scrollIntoView({ behavior: "smooth", block: "start" });
        observer.disconnect();
      }
    });

    if (bodyRef.current) {
      observer.observe(bodyRef.current, { childList: true, subtree: true });
    }
  };

  return {
    bodyRef,
    setListWindow: handleSetListWindow,
    setChatWindow: handleSetChatWindow,
    scrollBodyBottom,
  };
};

export default useChatWindowsChanger;

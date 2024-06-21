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

  const scrollBodyBottom = () => {
    const observer = new MutationObserver((mutations, observer) => {
      const chatBottom = document.querySelector(".right-sidebar-bottom");

      if (!chatBottom) {
        return;
      }

      if (chatBottom) {
        setTimeout(() => chatBottom.scrollIntoView({ behavior: "smooth" }), 0);
        observer.disconnect();
      }
    });

    if (document) {
      observer.observe(document, { childList: true, subtree: true });
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

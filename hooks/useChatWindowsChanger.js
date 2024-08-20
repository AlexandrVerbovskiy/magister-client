import React, { useState, useEffect, useRef } from "react";

const useChatWindowsChanger = (chatId) => {
  const [activeWindow, setActiveWindow] = useState(chatId ? "chat" : "list");
  const chatRef = useRef(null);
  const bodyTriggerRef = useRef(null);

  const scrollByWidth = (width) => {
    const scrollAmount = width;
    let scrollStep = 25;
    const interval = 10;
    let steps = scrollAmount / scrollStep;
    let currentStep = 0;

    if (width < 0) {
      scrollStep *= -1;
      steps *= -1;
    }

    const smoothScroll = (chatRefCurrent) => {
      if (currentStep < steps) {
        chatRefCurrent.scrollBy(scrollStep, 0);
        currentStep++;
        setTimeout(() => smoothScroll(chatRefCurrent), interval);
      }
    };

    smoothScroll(chatRef.current);
  };

  const scrollToChatList = () => {
    scrollByWidth(
      -chatRef.current.firstElementChild.getBoundingClientRect().width
    );
  };

  const scrollToChatBody = () => {
    scrollByWidth(
      chatRef.current.firstElementChild.getBoundingClientRect().width
    );
  };

  useEffect(() => {
    if (chatRef.current && activeWindow == "list") {
      scrollToChatList();
    }

    if (chatRef.current && activeWindow == "chat") {
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
    setTimeout(() => {
      const interval = setInterval(() => {
        if (bodyTriggerRef.current) {
          bodyTriggerRef.current.scrollIntoView({ behavior: "smooth" });
          clearInterval(interval);
        }
      }, 100);
    }, 0);
  };

  return {
    chatRef,
    setListWindow: handleSetListWindow,
    setChatWindow: handleSetChatWindow,
    scrollBodyBottom,
    bodyTriggerRef,
  };
};

export default useChatWindowsChanger;

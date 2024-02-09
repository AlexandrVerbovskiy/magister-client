import React, { createContext } from "react";
import { useMain } from "../hooks";

const IndiceContext = createContext();

const IndiceProvider = ({ userInfo, children, dopProps = {} }) => {
  const main = useMain({
    userInfo,
  });

  return (
    <IndiceContext.Provider value={{ ...main, ...dopProps }}>
      {children}
    </IndiceContext.Provider>
  );
};

export { IndiceProvider, IndiceContext };

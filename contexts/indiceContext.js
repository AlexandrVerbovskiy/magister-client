import React, { createContext } from "react";
import { useMain } from "../hooks";

const IndiceContext = createContext();

const IndiceProvider = ({
  userInfo,
  authToken,
  children,
  categories = {},
  dopProps = {},
  io,
}) => {
  const main = useMain({
    userInfo,
    authToken,
  });

  return (
    <IndiceContext.Provider value={{ ...main, categories, ...dopProps, io }}>
      {children}
    </IndiceContext.Provider>
  );
};

export { IndiceProvider, IndiceContext };

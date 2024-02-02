import React, { createContext } from "react";
import { useMain } from "../hooks";

const IndiceContext = createContext();

const IndiceProvider = ({ access, children }) => {
  const main = useMain({
    access,
  });

  return (
    <IndiceContext.Provider value={main}>{children}</IndiceContext.Provider>
  );
};

export { IndiceProvider, IndiceContext };

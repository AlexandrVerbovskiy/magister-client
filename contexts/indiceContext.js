import React, { createContext, useState } from "react";
import { useMain } from "../hooks";

const IndiceContext = createContext();

const IndiceProvider = ({ access, children }) => {
  const [displaySideMenu, setDisplaySideMenu] = useState(false);

  const toggleSideMenu = () => {
    setDisplaySideMenu(!displaySideMenu);
  };

  const { isAuth, user, onLogin, onLogout, isAdmin, error, success } = useMain({
    access,
  });

  return (
    <IndiceContext.Provider
      value={{
        user,
        error,
        isAuth,
        isAdmin,
        success,
        onLogin,
        onLogout,
        toggleSideMenu,
        displaySideMenu,
      }}
    >
      {children}
    </IndiceContext.Provider>
  );
};

export { IndiceProvider, IndiceContext };

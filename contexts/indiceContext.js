import React, { createContext, useState } from "react";
import { useMain } from "../hooks";

const IndiceContext = createContext();

const IndiceProvider = ({ access, children }) => {
  const [displaySideMenu, setDisplaySideMenu] = useState(false);

  const toggleSideMenu = () => {
    setDisplaySideMenu(!displaySideMenu);
  };

  const { isAuth, user, onLogin, onLogout, isAdmin } = useMain({ access });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  return (
    <IndiceContext.Provider
      value={{
        displaySideMenu,
        toggleSideMenu,
        isAuth,
        isAdmin,
        user,
        error: {
          value: error,
          set: setError,
          clear: clearError,
        },
        success: {
          value: success,
          set: setSuccess,
          clear: clearSuccess,
        },
        onLogin,
        onLogout,
      }}
    >
      {children}
    </IndiceContext.Provider>
  );
};

export { IndiceProvider, IndiceContext };

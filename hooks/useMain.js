import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import { updateSessionInfo, logout } from "../services";
import STATIC from "../env";

const useMain = ({ access = null }) => {
  const updateSessionTimeoutRef = useRef(null);
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [displaySideMenu, setDisplaySideMenu] = useState(false);

  const onLogout = () => {
    setUser(null);
    setIsAuth(false);
    setIsAdmin(false);
  };

  const update = async () => {
    if (!localStorage.getItem("accessToken")) return;

    try {
      await updateSessionInfo();
      setUpdateSessionInfoTimeout();
    } catch (e) {
      console.log(e);
      logout();
      onLogout();
    }
  };

  const setUpdateSessionInfoTimeout = () => {
    updateSessionTimeoutRef.current = setTimeout(
      update,
      STATIC.TOKEN_UPDATE_INTERVAL_MS
    );
  };

  useEffect(() => {
    const isAuth = !!window.localStorage.getItem("accessToken");
    setIsAuth(isAuth);

    if (isAuth) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") ?? "");
      setIsAdmin(userInfo && userInfo.role == "admin");
      setUser(userInfo);
      update();
    }
  }, []);

  useEffect(() => {
    if (isAuth === null) {
      return;
    }

    if ((access == "auth" || access == "admin") && !isAuth) {
      setError("Authentication failed");
      return Router?.push("/");
    }

    if (access == "admin" && !isAdmin) {
      setError("Access denied");
      return Router?.push("/");
    }

    if(access=="no auth" && isAuth){
      setError("Access denied");
      return Router?.push("/");
    }

  }, [isAuth]);

  const onLogin = (userInfo) => {
    setUser(userInfo);
    setIsAuth(true);
    setUpdateSessionInfoTimeout();
    setIsAdmin(userInfo && userInfo.role == "admin");
  };

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const baseRequestWrapper = async (promise) => {
    try {
      return await promise;
    } catch (e) {
      setError(e.message);
    }
  };

  const toggleSideMenu = () => setDisplaySideMenu(!displaySideMenu);

  return {
    isAuth,
    user,
    onLogin,
    onLogout,
    isAdmin,
    baseRequestWrapper,
    toggleSideMenu,
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
  };
};

export default useMain;

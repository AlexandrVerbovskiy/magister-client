import { useEffect, useState, useRef } from "react";
import Router from "next/router";
import { updateSessionInfo, logout } from "../services";
import STATIC from "../static";

const useMain = ({ access = null }) => {
  const updateSessionTimeoutRef = useRef(null);
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [user, setUser] = useState(null);

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
    if (isAuth === null) return;
    if (access == "auth" && !isAuth) Router?.push("/");
    if (access == "admin" && (!isAuth || !isAdmin)) Router?.push("/");
  }, [isAuth]);

  const onLogin = (userInfo) => {
    setUser(userInfo);
    setIsAuth(true);
    setUpdateSessionInfoTimeout();
    setIsAdmin(userInfo && userInfo.role == "admin");
  };

  return {
    isAuth,
    user,
    onLogin,
    onLogout,
    isAdmin,
  };
};

export default useMain;

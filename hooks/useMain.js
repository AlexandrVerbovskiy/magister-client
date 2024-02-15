import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useMain = ({ userInfo }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isSupport, setIsSupport] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [displaySideMenu, setDisplaySideMenu] = useState(false);
  const router = useRouter();

  const analizeQueryInfo = (param, onChange) => {
    const currentParam = router.query[param];

    if (!currentParam) return;

    onChange(currentParam);

    const { query, ...rest } = router.query;
    delete rest[param];

    router.replace({
      pathname: router.pathname,
      query: rest,
    });
  };

  useEffect(() => {
    analizeQueryInfo("error", (currentParam) => {
      setSuccess(null);
      setError(currentParam);
    });
  }, [router.query.error]);

  useEffect(() => {
    analizeQueryInfo("success", (currentParam) => {
      setError(null);
      setSuccess(currentParam);
    });
  }, [router.query.success]);

  const onLogout = () => {
    setUser(null);
    setIsAuth(false);
    setIsAdmin(false);
    setIsSupport(false);
  };

  useEffect(() => {
    setIsAuth(!!userInfo);
    setUser(userInfo);
    changePermissions(userInfo);
  }, [userInfo]);

  const onLogin = (fields) => {
    setIsAuth(true);
    updateUserFields({ ...fields });
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

  const changePermissions = (userInfo) => {
    setIsAdmin(userInfo && userInfo.role == "admin");
    setIsSupport(
      userInfo && (userInfo.role == "admin" || userInfo.role == "support")
    );
  };

  const updateUserFields = (info) => {
    const userInfo = { ...user, ...info };
    setUser(userInfo);
    changePermissions(userInfo);
  };

  return {
    updateUserFields,
    user,
    onLogin,
    onLogout,
    isAuth,
    isAdmin,
    isSupport,
    baseRequestWrapper,
    toggleSideMenu,
    displaySideMenu,
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

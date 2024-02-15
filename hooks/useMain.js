import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const useMain = ({ userInfo, authToken }) => {
  const [isAuth, setIsAuth] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);
  const [isSupport, setIsSupport] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [displaySideMenu, setDisplaySideMenu] = useState(false);
  const { data: session } = useSession();
  const [prevSessionUser, setPrevSessionUser] = useState(undefined);

  const handleSetSuccess = (message) => {
    setError(null);
    setSuccess(message);
  };

  const handleSetError = (message) => {
    setSuccess(null);
    setError(message);
  };

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

  useEffect(() => {
    if (session === undefined) {
      return;
    }

    if (prevSessionUser === undefined) {
      setPrevSessionUser(session?.user);
      return;
    }

    if (
      (prevSessionUser != null && session != null) ||
      (prevSessionUser == null && session == null)
    )
      return;

    let redirectLink = "/";

    if (session?.user) {
      setIsAuth(true);

      if (session.user.needRegularViewInfoForm) {
        redirectLink = "/settings/profile-edit";
      }

      handleSetSuccess("Successfully logged in");
    } else {
      setUser(null);
      setIsAuth(false);
      setIsAdmin(false);
      setIsSupport(false);
      handleSetSuccess("Successfully logged out");
    }

    setPrevSessionUser(session?.user);

    router.push(redirectLink);
  }, [session]);

  useEffect(() => {
    setIsAuth(!!userInfo);
    setUser(userInfo);
    console.log(userInfo);
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
    authToken,
    updateUserFields,
    user,
    onLogin,
    isAuth,
    isAdmin,
    isSupport,
    baseRequestWrapper,
    toggleSideMenu,
    displaySideMenu,
    error: {
      value: error,
      set: handleSetError,
      clear: clearError,
    },
    success: {
      value: success,
      set: handleSetSuccess,
      clear: clearSuccess,
    },
  };
};

export default useMain;

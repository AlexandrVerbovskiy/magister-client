import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { getMyInfo } from "../services/auth";
import { IndiceContext } from "../contexts";

const UserAuthorized = () => {
  const router = useRouter();
  const { token } = router.query;
  const { setLoading, onLogin } = useContext(IndiceContext);

  const authByToken = async () => {
    if (!token) return;

    let redirectLink = "/";

    try {
      localStorage.setItem("accessToken", token);
      const user = await getMyInfo();
      console.log(user);

      if (!user) {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("accessToken");
        router.push(redirectLink);
      } else {
        localStorage.setItem("userInfo", JSON.stringify(user));

        if (user.needSetPassword) {
          redirectLink = "/more-info-competing";
        } else if (user.needRegularViewInfoForm) {
          redirectLink = "/settings/profile-edit";
        }

        await router.push(redirectLink);
        onLogin(user);
      }
    } catch (e) {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
      router.push(redirectLink);
    }
  };

  useEffect(() => {
    authByToken();
  }, [token]);

  useEffect(() => {
    setLoading(true);
  }, []);

  return <div></div>;
};

UserAuthorized.getInitialProps = async () => ({
  access: "no auth",
});

export default UserAuthorized;

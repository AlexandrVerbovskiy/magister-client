import {
  getCookieString,
  initAxios,
  removeCookie,
  serviceWrapper,
} from "../utils";
const axios = initAxios("/auth");

const saveSessionInfo = (res) => {
  const { user, accessToken } = res;
  return user;
};

export const login = async (userInfo) => {
  const data = await serviceWrapper(axios.post("/login", userInfo));

  if (!data.body.needCode) {
    saveSessionInfo(data.body);
  }

  return data.body;
};

export const generateTwoFactorCode = async (email, password, type) => {
  const data = await serviceWrapper(
    axios.post("/generate-two-factor-code", {
      email,
      password,
      type,
    })
  );
  return data.message;
};

export const checkTwoFactorCode = async (type, code, id, rememberMe) => {
  const data = await serviceWrapper(
    axios.post("/check-two-factor-code", {
      type,
      code,
      id,
      rememberMe,
    })
  );

  saveSessionInfo(data.body);

  return data.body;
};

export const logout = async () => {
  removeCookie("Bearer");
  return;
};

export const generateMyEmailVerifyCode = async (email) => {
  const data = await serviceWrapper(
    axios.post("/generate-my-email-code", { email })
  );
  return data.message;
};

export const register = async (userInfo) => {
  const data = await serviceWrapper(axios.post("/register", userInfo));
  return data.message;
};

export const getMyInfo = async (cookies) => {
  const options = {
    headers: {
      Cookie: getCookieString(cookies),
    },
  };
  
  const data = await serviceWrapper(axios.post("/my-info", null, options));
  return data.body.user;
};

export const getMyInfoByCookie = async (cookies) => {
  const options = {
    headers: {
      Cookie: getCookieString(cookies),
    },
  };

  const data = await serviceWrapper(axios.post("/my-info", null, options));
  return data.body.user;
};

export const updateShortUserInfo = async (password, acceptedTermCondition) => {
  const data = await serviceWrapper(
    axios.post("/update-short-info", {
      password,
      acceptedTermCondition,
    })
  );
  return data.body.user;
};

export const updateProfile = async (body) => {
  const data = await serviceWrapper(axios.post("/save-profile", body));
  return data.body.user;
};

export const getMyDocuments = async (cookies) => {
  const options = {
    headers: {
      Cookie: getCookieString(cookies),
    },
  };

  const data = await serviceWrapper(axios.post("/my-documents", null, options));
  return data.body.documents;
};

export const saveMyDocuments = async (body) => {
  const data = await serviceWrapper(axios.post("/save-my-documents", body));
  return data.body.documents;
};

export const updateMyPassword = async (currentPassword, newPassword) => {
  const data = await serviceWrapper(
    axios.post("/update-my-password", {
      currentPassword,
      newPassword,
    })
  );
  return data.body.user;
};

export const verifyEmail = async (email, token) => {
  const data = await serviceWrapper(
    axios.post("/verify-email", { email, token })
  );
  return data.message;
};

export const resetPasswordSend = async (email) => {
  const data = await serviceWrapper(
    axios.post("/reset-password-send", { email })
  );
  return data.message;
};

export const resetPassword = async (password, token) => {
  const data = await serviceWrapper(
    axios.post("/reset-password", { password, token })
  );
  return data.message;
};

export const generateMyPhoneVerifyCode = async () => {
  const data = await serviceWrapper(axios.post("/generate-my-phone-code"));
  return data.message;
};

export const checkMyPhoneVerifyCode = async (code) => {
  const data = await serviceWrapper(
    axios.post("/check-my-phone-code", { code })
  );
  return data.message;
};

export const changeTwoFactorAuth = async () => {
  const data = await serviceWrapper(axios.post("/change-two-factor-auth"));
  return data;
};

export const canSendVerifyRequest = async (cookies) => {
  const options = {
    headers: {
      Cookie: getCookieString(cookies),
    },
  };
  const data = await serviceWrapper(
    axios.post("/can-send-verify-request", null, options)
  );
  return data.body;
};

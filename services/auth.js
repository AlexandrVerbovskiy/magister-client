import { initAxios } from "../utils";

const { post, generateFullUrl } = initAxios("/auth");
const { get: innerGet, post: innerPost } = initAxios("/auth", true);

export const login = async (userInfo) => {
  const data = await post("/login", userInfo);
  return data.body;
};

export const generateTwoFactorCode = async (email, password, type) => {
  const body = {
    email,
    password,
    type,
  };

  const data = await post("/generate-two-factor-code", body);
  return data.message;
};

export const checkTwoFactorCode = async (type, code, id, rememberMe) => {
  const body = {
    type,
    code,
    id,
    rememberMe,
  };

  const data = await post("/check-two-factor-code", body);
  return data.body;
};

export const generateMyEmailVerifyCode = async (email) => {
  const data = await post("/generate-my-email-code", { email });
  return data.message;
};

export const register = async (userInfo) => {
  const data = await post("/register", userInfo);
  return data.body;
};

export const innerGetMyInfo = async (authToken) => {
  const data = await innerGet("/my-info", authToken);
  return data.body.user;
};

export const updateProfile = async (body, authToken) => {
  const data = await post("/save-profile", body, authToken);
  return data.body.user;
};

export const saveMyDocuments = async (body, authToken) => {
  const data = await post("/save-my-documents", body, authToken);
  return data.body.documents;
};

export const updateMyPassword = async (
  currentPassword,
  newPassword,
  authToken
) => {
  const body = {
    currentPassword,
    newPassword,
  };

  const data = await post("/update-my-password", body, authToken);
  return data.body.user;
};

export const verifyEmail = async (email, code, rememberMe = false) => {
  const data = await post("/verify-email", { email, code, rememberMe });
  return data.body;
};

export const resetPasswordSend = async (email) => {
  const data = await post("/reset-password-send", { email });
  return data.message;
};

export const resetPassword = async (password, token) => {
  const data = await post("/reset-password", { password, token });
  return data.message;
};

export const generateMyPhoneVerifyCode = async (authToken) => {
  const data = await post("/generate-my-phone-code", null, authToken);
  return data.message;
};

export const checkMyPhoneVerifyCode = async (code, authToken) => {
  const data = await post("/check-my-phone-code", { code }, authToken);
  return data.message;
};

export const changeTwoFactorAuth = async (authToken) => {
  const data = await post("/change-two-factor-auth", null, authToken);
  return data;
};

export const innerAuthByProvider = async (body) => {
  const data = await innerPost("/auth-by-provider", body);
  return data.body;
};

export const generateUpdatePaypalIdLink = () =>
  generateFullUrl("paypal-connect");

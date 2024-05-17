import { initAxios } from "../utils";
const { get, post } = initAxios("/system");

export const getSystemOptions = async (authToken) => {
  const data = await get(`/get-system-options`, authToken);
  return data.body;
};

export const setSystemOptions = async (
  {
    userLogActive,
    ownerBaseCommissionPercent,
    ownerBoostCommissionPercent,
    tenantBaseCommissionPercent,
    tenantCancelFeePercent,
  },
  authToken
) => {
  const data = await post(
    "/set-system-options",
    {
      userLogActive,
      ownerBaseCommissionPercent,
      ownerBoostCommissionPercent,
      tenantBaseCommissionPercent,
      tenantCancelFeePercent,
    },
    authToken
  );
  return data.body;
};

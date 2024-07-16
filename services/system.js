import { initAxios } from "../utils";
const { get, post } = initAxios("/system");

export const getSystemOptions = async (authToken) => {
  const data = await get(`/get-system-options`, authToken);
  return data.body;
};

export const setSystemMainOptions = async ({ userLogActive }, authToken) => {
  const data = await post(
    `/set-system-main-options`,
    { userLogActive },
    authToken
  );
  return data.body;
};

export const setSystemCommissionOptions = async (
  {
    ownerBaseCommissionPercent,
    ownerBoostCommissionPercent,
    tenantBaseCommissionPercent,
    tenantCancelFeePercent,
  },
  authToken
) => {
  const data = await post(
    "/set-system-commission-options",
    {
      ownerBaseCommissionPercent,
      ownerBoostCommissionPercent,
      tenantBaseCommissionPercent,
      tenantCancelFeePercent,
    },
    authToken
  );
  return data.body;
};

export const setSystemBankAccountOptions = async (
  {
    bankAccountIban,
    bankAccountSwiftBic,
    bankAccountBeneficiary,
    bankAccountReferenceConceptCode,
  },
  authToken
) => {
  const data = await post(
    "/set-system-bank-account-options",
    {
      bankAccountIban,
      bankAccountSwiftBic,
      bankAccountBeneficiary,
      bankAccountReferenceConceptCode,
    },
    authToken
  );
  return data.body;
};

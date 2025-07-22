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
    renterBaseCommissionPercent,
    renterCancelFeePercent,
  },
  authToken
) => {
  const data = await post(
    "/set-system-commission-options",
    {
      ownerBaseCommissionPercent,
      ownerBoostCommissionPercent,
      renterBaseCommissionPercent,
      renterCancelFeePercent,
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

export const saveApiKey = async (apiKey, authToken) => {
  const data = await post(
    "/save-api-key",
    {
      apiKey,
    },
    authToken
  );
  return data.body;
};

export const saveTrainingSettings = async (
  {
    correlationThreshold,
    pValueThreshold,
    nEstimators,
    randomState,
    trainTestSplit,
  },
  authToken
) => {
  const data = await post(
    "/save-training-settings",
    {
      correlationThreshold,
      pValueThreshold,
      nEstimators,
      randomState,
      trainTestSplit,
    },
    authToken
  );
  return data.body;
};

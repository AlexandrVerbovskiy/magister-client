import { initAxios } from "../utils";
const { get, post } = initAxios("/dispute-prediction-models");

export const stopDisputePredictionModel = async (id, authToken) => {
  const data = await post(`/stop`, { id }, authToken);
  return data.body;
};

export const unstopDisputePredictionModel = async (id, authToken) => {
  const data = await post(`/unstop`, { id }, authToken);
  return data.body;
};

export const activateDisputePredictionModel = async (
  id,
  rebuild,
  authToken
) => {
  const data = await post(`/set-active`, { id, rebuild }, authToken);
  return data.body;
};

export const getDisputePredictionModel = async (id, authToken) => {
  const data = await get(`/get-details/${id}`, authToken);
  return data.body.model;
};

export const startTrainingDisputePredictionModel = async (
  id,
  selectedFields,
  authToken
) => {
  const data = await post(`/start-training`, { id, selectedFields }, authToken);
  return data.body;
};

export const createDisputePredictionModel = async (
  { body, checkField, afterFinishActive = false, afterFinishRebuild = false },
  authToken
) => {
  const data = await post(
    `/create`,
    { body, checkField, afterFinishActive, afterFinishRebuild },
    authToken
  );
  return data.body;
};

export const updateDisputePredictionModel = async (
  {
    id,
    checkField,
    body,
    afterFinishActive = false,
    afterFinishRebuild = false,
  },
  authToken
) => {
  const data = await post(
    `/update`,
    { id, checkField, body, afterFinishActive, afterFinishRebuild },
    authToken
  );
  return data.body;
};

export const getDisputePredictionModelList = async (params, authToken) => {
  const data = await post(`/list`, params, authToken);
  return data.body;
};

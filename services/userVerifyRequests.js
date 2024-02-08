import ENV from "../env";
import { authAxios, serviceWrapper } from "../utils";
const serverApiUrl = ENV.SERVER_API_URL;

export const getUserVerifyRequestById = async (id) => {
  const data = await serviceWrapper(
    authAxios.get(`${serverApiUrl}/user-verify-requests/get-by-id/${id}`)
  );
  return data.body;
};

export const getUserVerifyRequestList = async (body) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/user-verify-requests/list`, body)
  );
  return data.body;
};

export const userVerifyRequestCreate = async () => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/user-verify-requests/create`)
  );
  return data.message;
};

export const userVerifyRequestUpdate = async (body) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/user-verify-requests/update`, body)
  );
  return data.body;
};
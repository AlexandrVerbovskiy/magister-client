import ENV from "../env";
import { authAxios, serviceWrapper } from "../utils";
const serverApiUrl = ENV.SERVER_API_URL;

export const getLogById = async (id) => {
  const data = await serviceWrapper(
    authAxios.get(`${serverApiUrl}/logs/get-by-id/${id}`)
  );
  return data.body;
};

export const getLogList = async (body) => {
  const data = await serviceWrapper(
    authAxios.post(`${serverApiUrl}/logs/list`, body)
  );
  return data.body;
};

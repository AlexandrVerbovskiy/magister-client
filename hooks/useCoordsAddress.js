import { IndiceContext } from "../contexts";
import { useContext } from "react";
import { getAddressCoords, getCoordsAddress } from "../services/main";

const useCoordsAddress = () => {
  const { authToken } = useContext(IndiceContext);

  const responseWrapper = (response) => {
    if (response.error) {
      throw new Error(response.error);
    }

    return response.result;
  };

  const getAddressByCoords = async ({ lat, lng }) => {
    const response = await getCoordsAddress({ lat, lng }, authToken);
    return responseWrapper(response);
  };

  const getCoordsByAddress = async (address) => {
    if (!address) return null;

    const response = await getAddressCoords(address, authToken);
    return responseWrapper(response);
  };

  return { getAddressByCoords, getCoordsByAddress };
};

export default useCoordsAddress;

import React, { useEffect } from "react";
import { setKey, fromLatLng, fromAddress } from "react-geocode";
import ENV from "../env";

const useCoordsAddress = () => {
  useEffect(() => {
    if (ENV.GOOGLE_GEOCODE_API_KEY) {
      setKey(ENV.GOOGLE_GEOCODE_API_KEY);
    }
  }, []);

  const getAddressInfo = (elem) => {
    const info = {};
    const value = elem.long_name;

    switch (elem.types[0]) {
      case "street_number": {
        info.streetNumber = value;
        break;
      }
      case "route": {
        info.street = value;
        break;
      }
      case "locality": {
        info.city = value;
        break;
      }
      case "administrative_area_level_1": {
        info.oblast = value;
        break;
      }
      case "country": {
        info.country = value;
        break;
      }
      default:
        break;
    }
    return info;
  };

  const fullAddressToString = (address) => {
    let res = [];
    Object.keys(address).forEach((key) => res.push(address[key]));
    return res.join(", ");
  };

  const getAddressByCoords = async ({ lat, lng }) => {
    const res = await fromLatLng(lat, lng);

    const addressArray = res.results[0].address_components;

    if (!addressArray) throw new Error("Undefined coords");

    const info = {};
    addressArray.forEach((elem) => {
      const newObj = getAddressInfo(elem);
      Object.assign(info, newObj);
    });

    return fullAddressToString(info);
  };

  const getCoordsByAddress = async (address) => {
    const res = await fromAddress(address);
    const coords = res.results[0].geometry.location;
    if (!coords) throw new Error("Undefined address");
    return coords;
  };

  return { getAddressByCoords, getCoordsByAddress, fullAddressToString };
};

export default useCoordsAddress;

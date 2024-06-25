import STATIC from "../static";
import {
  ownerGetsCalculate,
  tenantPaymentCalculate,
} from "./priceCalculations";

export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return "";
  }

  const firstLetter = str.charAt(0).toUpperCase();
  const restOfString = str.slice(1).toLowerCase();
  return firstLetter + restOfString;
};

export const cardFormat = (str) => {
  const value = str.replace(/\D/g, "");
  let formattedValue = "";
  for (let i = 0; i < value.length; i++) {
    if (i % 4 == 0 && i > 0) {
      formattedValue += " ";
    }
    formattedValue += value[i];
  }
  return formattedValue;
};

export const checkIsFileHasExtension = (file, extensions) => {
  let result = null;

  extensions.forEach((extension) => {
    if (
      file &&
      file.type &&
      file.name &&
      file.type.toLowerCase() == extension.toLowerCase()
    ) {
      result = extension;
    }
  });

  return result;
};

export const changeLocation = (location) =>
  window.history.pushState(null, "", location);

export const indicateMediaTypeByExtension = (type) => {
  if (STATIC.VIDEO_EXTENSIONS.includes(type.toLowerCase()))
    return STATIC.MESSAGE_TYPES.VIDEO;
  if (STATIC.AUDIO_EXTENSIONS.includes(type.toLowerCase()))
    return STATIC.MESSAGE_TYPES.AUDIO;
  if (STATIC.IMAGE_EXTENSIONS.includes(type.toLowerCase()))
    return STATIC.MESSAGE_TYPES.IMAGE;
  return STATIC.MESSAGE_TYPES.FILE;
};

export const getRelativeCoordinates = (child, parent) => {
  const childRect = child.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();

  return {
    top: childRect.top - parentRect.top,
    right: childRect.right - parentRect.right,
  };
};

export const calculateCurrentTotalPrice = ({
  startDate,
  endDate,
  pricePerDay,
  ownerFee,
  tenantFee,
  type = null,
  isOwner = null,
}) => {
  if (!type) {
    type = isOwner ? "owner" : "tenant";
  }

  const fee = type == "owner" ? ownerFee : tenantFee;
  const calculationFunc =
    type == "owner" ? ownerGetsCalculate : tenantPaymentCalculate;

  return calculationFunc(startDate, endDate, fee, pricePerDay);
};

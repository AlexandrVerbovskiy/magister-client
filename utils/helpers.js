import STATIC from "../static";
import {
  generateDatesBetween,
  getOrderBlockedDatesToUpdate,
} from "./dateHelpers";
import {
  moneyFormat,
  ownerGetsCalculate,
  workerPaymentCalculate,
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
  workerFee,
  type = null,
  isOwner = null,
}) => {
  if (!type) {
    type = isOwner ? "owner" : "worker";
  }

  const fee = type == "owner" ? ownerFee : workerFee;
  const calculationFunc =
    type == "owner" ? ownerGetsCalculate : workerPaymentCalculate;

  return calculationFunc(startDate, endDate, fee, pricePerDay);
};

export const getPaymentNameByType = (type) => {
  switch (type) {
    case STATIC.PAYMENT_TYPES.PAYPAL:
      return "Paypal";
    case STATIC.PAYMENT_TYPES.BANK_TRANSFER:
      return "Bank Transfer";
    case STATIC.PAYMENT_TYPES.CREDIT_CARD:
      return "Credit Card";
    default:
      return "-";
  }
};

export const isPayedUsedPaypal = (type) =>
  [STATIC.PAYMENT_TYPES.PAYPAL, STATIC.PAYMENT_TYPES.CREDIT_CARD].includes(
    type
  );

export const hasPayError = ({ sessionUser, order }) => {
  if (!sessionUser?.verified) {
    return "You need to be verified to make a payment";
  }

  if (!order.ownerVerified) {
    return "To make a payment, the owner of the product must be verified";
  }

  if (!order.ownerPaypalId) {
    return "To make a payment, the owner of the product must confirm his PayPal account";
  }

  return null;
};

export const getOrderBlockedDatesToExtend = (order) => {
  if (!order) {
    return [];
  }

  return removeDuplicates([
    ...getOrderBlockedDatesToUpdate(order),
    ...generateDatesBetween(order.offerStartDate, order.offerEndDate),
  ]);
};

export const removeDuplicates = (arr) => [...new Set(arr)];

export const extractDataBetweenBraces = (str) => {
  const firstIndex = str.indexOf("{");
  const lastIndex = str.lastIndexOf("}");

  if (firstIndex !== -1 && lastIndex !== -1 && lastIndex > firstIndex) {
    return str.slice(firstIndex, lastIndex + 1);
  } else {
    return null;
  }
};

export const sortListingImages = (files) => {
  files.sort((a, b) => {
    if (a.id && b.id) {
      return a.id - b.id;
    } else if (a.id && !b.id) {
      return 1;
    } else if (!a.id && b.id) {
      return -1;
    } else {
      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();

      if (dateComparison === 0) {
        return a.localId.localeCompare(b.localId);
      }
      return dateComparison;
    }
  });

  return files;
};

export const getDisputeTitle = (name) => {
  const title = STATIC.DISPUTE_TYPE_TITLE[name];
  return title ?? STATIC.DISPUTE_TYPE_TITLE.others;
};

export const getFilePath = (part) =>
  process.env.NEXT_PUBLIC_SERVER_URL + "/public/" + part;

export const generateProfileFilePath = (path) => {
  return path ? getFilePath(path) : STATIC.DEFAULTS.PROFILE_PHOTO_LINK;
};

export const initOthersCategory = ({
  level = 1,
  parentId = null,
  image = null,
} = {}) => ({
  countChildren: 0,
  id: "-",
  image: image,
  level: level,
  name: "Others",
  orderIndex: null,
  parentId: parentId,
  popular: false,
  isOther: true,
});

export const moneyFormatVisual = (value, needCurrencyName = false) => {
  let result = `${STATIC.CURRENCY}${moneyFormat(value)}`;

  if (needCurrencyName) {
    result += ` ${STATIC.CURRENCY_NAME}`;
  }

  return result;
};
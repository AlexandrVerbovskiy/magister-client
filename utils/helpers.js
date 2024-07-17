import STATIC from "../static";
import { getMaxDate, increaseDateByOneDay } from "./dateHelpers";
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

export const getStartExtendOrderDate = (offerEndDate, extendOrders) => {
  let lastOrderDate = offerEndDate;

  if (extendOrders && extendOrders.length) {
    const extendOrderDates = extendOrders
      .filter(
        (order) =>
          [
            STATIC.ORDER_STATUSES.PENDING_CLIENT_PAYMENT,
            STATIC.ORDER_STATUSES.PENDING_ITEM_TO_CLIENT,
            STATIC.ORDER_STATUSES.PENDING_ITEM_TO_OWNER,
            STATIC.ORDER_STATUSES.FINISHED,
          ].includes(order.status) && !order.cancelStatus
      )
      .map((extendOrder) => extendOrder.offerEndDate);

    lastOrderDate = getMaxDate(extendOrderDates);
  }

  return increaseDateByOneDay(lastOrderDate);
};

export const removeDuplicates = (arr) => [...new Set(arr)];

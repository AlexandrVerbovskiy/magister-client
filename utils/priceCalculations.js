import { getFactOrderDays } from "./dateHelpers";
import STATIC from "../static";

export const moneyFormat = (money) => +money.toFixed(2);

export const calculateFee = (price, fee, needMin = false) => {
  const totalFee = (fee * price) / 100;

  if (needMin && totalFee < STATIC.LIMITS.MIN_TENANT_COMMISSION) {
    return STATIC.LIMITS.MIN_TENANT_COMMISSION;
  }

  return moneyFormat(totalFee);
};

export const calculateTotalPriceByDaysCount = (count, price) =>
  moneyFormat(price * count);

export const calculateFullTotalByType = (price, fee, type = "sum") => {
  let total;

  if (type == "sum") {
    total = workerPaymentCalculate(price, fee);
  }

  if (type == "reject") {
    total = ownerGetsCalculate(price, fee);
  }

  return total;
};

export const autoCalculateCurrentTotalPrice = ({
  price,
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

  return calculationFunc(price, fee);
};

export const workerPaymentCalculate = (price, fee) => {
  const result = price + calculateFee(price, fee);
  return moneyFormat(result);
};

export const ownerGetsCalculate = (price, fee) => {
  const result = price - calculateFee(price, fee);
  return moneyFormat(result);
};

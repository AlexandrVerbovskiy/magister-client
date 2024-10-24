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

export const calculateFullTotalByDaysCount = (
  count,
  price,
  fee,
  type = "sum"
) => {
  let total;

  if (type == "sum") {
    total =
      +calculateTotalPriceByDaysCount(count, price) +
      +calculateFeeByDaysCount(count, price, fee, true);
  }

  if (type == "reject") {
    total =
      +calculateTotalPriceByDaysCount(count, price, fee) -
      +calculateFeeByDaysCount(count, price, fee);
  }

  return moneyFormat(total);
};

export const tenantPaymentCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getFactOrderDays(startDay, endDay);
  const resPayment =
    duration * pricePerDay +
    calculateFeeByDaysCount(duration, pricePerDay, fee, true);
  return +resPayment.toFixed(2);
};

export const ownerGetsCalculate = (startDay, endDay, fee, pricePerDay) => {
  const duration = getFactOrderDays(startDay, endDay);
  const resPayment =
    duration * pricePerDay -
    calculateFeeByDaysCount(duration, pricePerDay, fee);
  return +resPayment.toFixed(2);
};

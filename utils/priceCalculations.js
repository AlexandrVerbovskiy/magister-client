import STATIC from "../static";

export const moneyFormat = (money) => +money.toFixed(2);

const paymentFeeCalculate = (price, fee) => {
  const resPayment = (fee * price) / 100;
  return +resPayment.toFixed(2);
};

export const calculateFeeByDaysCount = (count, price, fee, needMin = false) => {
  const totalFee = (fee * price * count) / 100;

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

export const renterPaysFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_RENTER_COMMISSION) {
    return STATIC.LIMITS.MIN_RENTER_COMMISSION;
  }

  return result;
};

export const ownerEarnFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_OWNER_COMMISSION) {
    return STATIC.LIMITS.MIN_OWNER_COMMISSION;
  }

  return result;
};

export const calculateFullTotalByType = (price, fee, type = "sum") => {
  let total;

  if (type == "sum") {
    total = renterPaysCalculate(price, fee);
  }

  if (type == "reject") {
    total = ownerEarnCalculate(price, fee);
  }

  return total;
};

export const autoCalculateCurrentTotalPrice = ({
  price,
  ownerFee,
  renterFee,
  type = null,
  isOwner = null,
}) => {
  if (!type) {
    type = isOwner ? "owner" : "renter";
  }

  const fee = type == "owner" ? ownerFee : renterFee;
  const calculationFunc =
    type == "owner" ? ownerEarnCalculate : renterPaysCalculate;

  return calculationFunc(price, fee);
};

export const renterPaysCalculate = (price, fee) => {
  const result = price - renterPaysFeeCalculate(price, fee);
  return moneyFormat(result);
};

export const ownerEarnCalculate = (price, fee) => {
  const result = price + ownerEarnFeeCalculate(price, fee);
  return moneyFormat(result);
};

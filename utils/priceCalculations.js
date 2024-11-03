import STATIC from "../static";

export const moneyFormat = (money) => +money.toFixed(2);

const paymentFeeCalculate = (price, fee) => {
  const resPayment = (fee * price) / 100;
  return +resPayment.toFixed(2);
};

export const workerGetsFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_WORKER_COMMISSION) {
    return STATIC.LIMITS.MIN_WORKER_COMMISSION;
  }

  return result;
};

export const ownerPaymentFeeCalculate = (price, fee) => {
  const result = paymentFeeCalculate(price, fee);

  if (result < STATIC.LIMITS.MIN_OWNER_COMMISSION) {
    return STATIC.LIMITS.MIN_OWNER_COMMISSION;
  }

  return result;
};

export const calculateFullTotalByType = (price, fee, type = "sum") => {
  let total;

  if (type == "sum") {
    total = workerGetsCalculate(price, fee);
  }

  if (type == "reject") {
    total = ownerPaymentCalculate(price, fee);
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
    type == "owner" ? ownerPaymentCalculate : workerGetsCalculate;

  return calculationFunc(price, fee);
};

export const workerGetsCalculate = (price, fee) => {
  const result = price - workerGetsFeeCalculate(price, fee);
  return moneyFormat(result);
};

export const ownerPaymentCalculate = (price, fee) => {
  const result = price + ownerPaymentFeeCalculate(price, fee);
  return moneyFormat(result);
};

export const moneyFormat = (money) => +money.toFixed(2);

export const calculateFeeByDaysCount = (count, price, fee) => {
  const totalFee = (fee * price * count) / 100;
  return moneyFormat(totalFee);
};

export const calculateTotalPriceByDaysCount = (count, price, fee) =>
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
      +calculateTotalPriceByDaysCount(count, price, fee) +
      +calculateFeeByDaysCount(count, price, fee);
  }

  if (type == "reject") {
    total =
      +calculateTotalPriceByDaysCount(count, price, fee) -
      +calculateFeeByDaysCount(count, price, fee);
  }

  return moneyFormat(total);
};

export const calculateFeeByDaysCount = (count, price, fee) => {
  const totalFee = (fee * price * count) / 100;
  return totalFee.toFixed(2);
};

export const calculateTotalPriceByDaysCount = (count, price, fee) =>
  (price * count).toFixed(2);

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

  return total.toFixed(2);
};

import { tailwindConfig, hexToRGB, fixedColors } from "./tailwindCharts/Utils";
import { stringSort, dateSort } from "./sort";
import STATIC from "../static";

export const doughnutChartOptions = ({ title, data, labelPrefix = "" }) => {
  const labels = stringSort(Object.keys(data));
  const backgroundColors = [];
  const hoverBackgroundColors = [];
  const values = [];
  const labelsToView = [];

  const totalValues = labels.reduce(
    (accumulator, label) => accumulator + data[label],
    0
  );

  labels.forEach((label, index) => {
    backgroundColors.push(
      tailwindConfig().theme.colors[fixedColors[index]][100]
    );

    hoverBackgroundColors.push(
      tailwindConfig().theme.colors[fixedColors[index]][300]
    );

    const currentValue = data[label];
    values.push(currentValue);

    if (totalValues < 1) {
      labelsToView.push(`0% (${labelPrefix}${currentValue}) ${label}`);
    } else {
      labelsToView.push(
        `${((currentValue * 100) / totalValues).toFixed(
          0
        )}% (${labelPrefix}${currentValue}) ${label}`
      );
    }
  });

  return {
    chartData: {
      labels: labelsToView,
      datasets: [
        {
          label: title,
          data: values,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverBackgroundColors,
          borderWidth: 1,
        },
      ],
    },
  };
};

export const lineChartOptions = ({
  data,
  getTotalType = "sum",
  totalCount = null,
}) => {
  const labels = dateSort(Object.keys(data[0]));
  const datasets = data.map((rowInfo, i) => ({
    data: labels.map((label) => rowInfo[label]),
    fill: true,
    backgroundColor: `rgba(${hexToRGB(
      tailwindConfig().theme.colors[fixedColors[i]][100]
    )}, 0.08)`,
    borderColor: tailwindConfig().theme.colors[fixedColors[i]][300],
    borderWidth: 2,
    tension: 0,
    pointRadius: 0,
    pointHoverRadius: 3,
    pointBackgroundColor: tailwindConfig().theme.colors[fixedColors[i]][300],
    pointHoverBackgroundColor:
      tailwindConfig().theme.colors[fixedColors[i]][300],
    pointBorderWidth: 0,
    pointHoverBorderWidth: 0,
    clip: 20,
  }));

  const chartData = {
    labels: labels,
    datasets: datasets,
  };

  let sum = 0;
  let prevSum = 0;
  const needCompare = data.length > 1;

  if (totalCount) {
    sum = totalCount;
    prevSum = totalCount;
  } else {
    if (getTotalType == "sum") {
      sum = labels.reduce(
        (accumulator, label) => accumulator + data[0][label],
        0
      );

      if (needCompare) {
        prevSum = labels.reduce(
          (accumulator, label) => accumulator + data[1][label],
          0
        );
      }
    } else {
      sum = data[0][labels[labels.length - 1]] ?? 0;

      if (needCompare) {
        prevSum = data[1][labels[labels.length - 1]] ?? 0;
      }
    }
  }

  const comparePercents =
    needCompare && prevSum > 0 ? ((sum - prevSum) / prevSum) * 100 : 0;

  return { sum, comparePercents, needCompare, chartData };
};

export const transactionTableOptions = ({ data }) => {
  const paypalInfo = data[STATIC.PAYMENT_TYPES.PAYPAL];
  const bankTransferInfo = data[STATIC.PAYMENT_TYPES.BANK_TRANSFER];

  const total = paypalInfo["amount"] + bankTransferInfo["amount"];

  if (total > 0) {
    paypalInfo["total"] = ((paypalInfo["amount"] * 100) / total).toFixed(0);
    bankTransferInfo["total"] = (
      (bankTransferInfo["amount"] * 100) /
      total
    ).toFixed(0);
  } else {
    paypalInfo["total"] = 0;
    bankTransferInfo["total"] = 0;
  }

  return { paypalInfo, bankTransferInfo, total };
};

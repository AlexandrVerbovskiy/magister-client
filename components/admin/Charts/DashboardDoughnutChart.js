import React from "react";
import DoughnutChart from "../../../charts/DoughnutChart";

import {
  fixedColors,
  tailwindConfig,
} from "../../../utils/tailwindCharts/Utils";
import { stringSort } from "../../../utils";

const DashboardDoughnutChart = ({ title, data }) => {
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
      tailwindConfig().theme.colors[fixedColors[index]][500]
    );

    hoverBackgroundColors.push(
      tailwindConfig().theme.colors[fixedColors[index]][700]
    );

    const currentValue = data[label];
    values.push(currentValue);

    if (totalValues < 1) {
      labelsToView.push(`0% ($${currentValue}) ${label}`);
    } else {
      labelsToView.push(
        `${((currentValue * 100) / totalValues).toFixed(
          0
        )}% ($${currentValue}) ${label}`
      );
    }
  });

  const chartData = {
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
  };

  return (
    <>
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          {title}
        </h2>
      </header>
      <DoughnutChart data={chartData} width={389} height={260} />
    </>
  );
};

export default DashboardDoughnutChart;

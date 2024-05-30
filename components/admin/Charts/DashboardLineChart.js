import React from "react";
import LineChart from "../../../charts/LineChart01";

// Import utilities
import {
  tailwindConfig,
  hexToRGB,
  fixedColors,
} from "../../../utils/tailwindCharts/Utils";
import Link from "next/link";
import { dateSort } from "../../../utils";

function DashboardLineChart({
  title,
  data,
  valueType = "number",
  getTotalType = "sum",
  timeType = "days",
}) {
  const labels = dateSort(Object.keys(data[0]));
  const datasets = data.map((rowInfo, i) => ({
    data: labels.map((label) => rowInfo[label]),
    fill: true,
    backgroundColor: `rgba(${hexToRGB(
      tailwindConfig().theme.colors[fixedColors[i]][500]
    )}, 0.08)`,
    borderColor: tailwindConfig().theme.colors[fixedColors[i]][700],
    borderWidth: 2,
    tension: 0,
    pointRadius: 0,
    pointHoverRadius: 3,
    pointBackgroundColor: tailwindConfig().theme.colors[fixedColors[i]][700],
    pointHoverBackgroundColor:
      tailwindConfig().theme.colors[fixedColors[i]][700],
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

  const comparePercents =
    needCompare && prevSum > 0 ? ((sum - prevSum) / prevSum) * 100 : 0;

  return (
    <>
      <div className="px-5 pt-5">
        <header className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h2>
        </header>
        <div className="flex items-start">
          <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">
            {valueType == "money" && "$"}
            {sum}
          </div>
          {needCompare && (
            <div
              className={`text-sm font-semibold text-white px-1.5 ${
                comparePercents > 0 ? "bg-emerald-500" : "bg-rose-500"
              } rounded-full`}
            >
              {comparePercents > 0 ? `+` : `-`}
              {comparePercents}%
            </div>
          )}
        </div>
      </div>

      <div className="grow">
        <LineChart
          data={chartData}
          width={389}
          height={128}
          valueType={valueType}
          timeType={timeType}
        />
      </div>
    </>
  );
}

export default DashboardLineChart;

import React from "react";
import LineChart from "../../../charts/LineChart01";
import { lineChartOptions, moneyFormatVisual } from "../../../utils";

function DashboardLineChart({
  title,
  data,
  valueType = "number",
  getTotalType = "sum",
  timeType = "days",
  totalCount = null,
}) {
  const { sum, comparePercents, needCompare, chartData } = lineChartOptions({
    data,
    getTotalType,
    totalCount,
  });

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
            {valueType == "money" ? moneyFormatVisual(sum) : sum}
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

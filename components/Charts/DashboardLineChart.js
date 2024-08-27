import React from "react";
import LineChart from "../../charts/LineChart01";
import { lineChartOptions, moneyFormatVisual } from "../../utils";
import STATIC from "../../static";

function DashboardLineChart({
  title,
  data,
  valueType = "number",
  getTotalType = "sum",
  timeType = "days",
  height = 228,
  totalCount = null,
}) {
  const { sum, comparePercents, needCompare, chartData } = lineChartOptions({
    data,
    getTotalType,
    totalCount,
  });

  return (
    <div className="chart-card">
      <h3 className="align-items-center text-lg font-semibold d-flex justify-content-between">
        <div>{title}</div>
        <div style={{ fontSize: "1.375rem" }}>
          <span className={`fw-bold mx-2`}>
            {valueType === "money" ? moneyFormatVisual(sum) : sum}
          </span>
          {needCompare && (
            <span
              className={`text-white px-2 py-1 ${
                comparePercents > 0 ? "bg-success" : "bg-danger"
              } rounded-pill`}
            >
              {comparePercents > 0 ? `+` : `-`}
              {comparePercents}%
            </span>
          )}
        </div>
      </h3>

      <div className="flex-grow-1">
        <LineChart
          data={chartData}
          width={389}
          height={height}
          valueType={valueType}
          timeType={timeType}
        />
      </div>
    </div>
  );
}

export default DashboardLineChart;

import React from "react";
import DoughnutChart from "../../charts/DoughnutChart";
import { doughnutChartOptions } from "../../utils";

const DashboardDoughnutChart = ({ title, data, labelPrefix = "" }) => {
  const { chartData } = doughnutChartOptions({ title, data, labelPrefix });

  return (
    <div className="chart-card">
      <h3 className="align-items-center text-lg font-semibold d-flex justify-content-between">
        <div>{title}</div>
      </h3>
      <div className="flex-grow-1">
        <DoughnutChart data={chartData} width={389} height={260} />
      </div>
    </div>
  );
};

export default DashboardDoughnutChart;

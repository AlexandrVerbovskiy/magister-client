import React from "react";
import DoughnutChart from "../../../charts/DoughnutChart";
import { doughnutChartOptions } from "../../../utils";

const DashboardDoughnutChart = ({ title, data, labelPrefix = "" }) => {
  const { chartData } = doughnutChartOptions({ title, data, labelPrefix });

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

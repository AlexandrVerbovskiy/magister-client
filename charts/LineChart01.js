import React, { useRef, useEffect, useState } from "react";
import { useThemeProvider } from "../utils/tailwindCharts/ThemeContext";

import { chartColors } from "./ChartjsConfig";
import {
  Chart,
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";

import { formatValue } from "../utils/tailwindCharts/Utils";

Chart.register(
  LineController,
  LineElement,
  Filler,
  PointElement,
  LinearScale,
  TimeScale,
  Tooltip
);

function LineChart01({
  data,
  width,
  height,
  valueType = "number",
  timeType = "days",
}) {
  const [chart, setChart] = useState(null);
  const canvasRef = useRef(null);
  const { currentTheme } = useThemeProvider();
  const darkMode = currentTheme === "dark";
  const { tooltipBodyColor, tooltipBgColor, tooltipBorderColor, chartAreaBg } =
    chartColors;

  let timeParser = "MM-DD-YYYY";

  if ((timeType = "months")) {
    timeParser = "MM-YYYY";
  }

  if ((timeType = "hours")) {
    timeParser = "MM-DD-YYYY HH:mm:ss";
  }

  useEffect(() => {
    const ctx = canvasRef.current;
    // eslint-disable-next-line no-unused-vars
    const newChart = new Chart(ctx, {
      type: "line",
      data: data,
      options: {
        chartArea: {
          backgroundColor: darkMode ? chartAreaBg.dark : chartAreaBg.light,
        },
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            display: false,
            beginAtZero: true,
          },
          x: {
            type: "time",
            time: {
              parser: timeParser,
              unit: "month",
            },
            display: false,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) =>
                valueType == "money"
                  ? formatValue(context.parsed.y)
                  : `${context.parsed.y}`,
            },
            bodyColor: darkMode
              ? tooltipBodyColor.dark
              : tooltipBodyColor.light,
            backgroundColor: darkMode
              ? tooltipBgColor.dark
              : tooltipBgColor.light,
            borderColor: darkMode
              ? tooltipBorderColor.dark
              : tooltipBorderColor.light,
          },
          legend: {
            display: false,
          },
        },
        interaction: {
          intersect: false,
          mode: "nearest",
        },
        maintainAspectRatio: false,
        resizeDelay: 200,
      },
    });
    setChart(newChart);
    return () => newChart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  useEffect(() => {
    if (!chart) return;

    if (darkMode) {
      chart.options.chartArea.backgroundColor = chartAreaBg.dark;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.dark;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.dark;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.dark;
    } else {
      chart.options.chartArea.backgroundColor = chartAreaBg.light;
      chart.options.plugins.tooltip.bodyColor = tooltipBodyColor.light;
      chart.options.plugins.tooltip.backgroundColor = tooltipBgColor.light;
      chart.options.plugins.tooltip.borderColor = tooltipBorderColor.light;
    }
    chart.update("none");
  }, [currentTheme]);

  return <canvas ref={canvasRef} width={width} height={height}></canvas>;
}

export default LineChart01;

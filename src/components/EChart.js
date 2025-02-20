import React, { useEffect, useRef } from "react";

const EChart = ({ option, width = "600px", height = "400px" }) => {
  const chartRef = useRef(null); // Create a reference for each chart

  useEffect(() => {
    if (window.echarts && chartRef.current) {
      const chart = window.echarts.init(chartRef.current); // Initialize chart on the unique ref
      chart.setOption(option);
    }
  }, [option]);

  return <div ref={chartRef} style={{ width, height }} />;
};

export default EChart;
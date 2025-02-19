import React, { useEffect } from "react";

const EChart = ({ option, width = "600px", height = "400px" }) => {
  useEffect(() => {
    if (window.echarts) {
      const chart = window.echarts.init(document.getElementById("echart-container"));
      chart.setOption(option);
    }
  }, [option]);

  return <div id="echart-container" style={{ width, height }} />;
};

export default EChart;
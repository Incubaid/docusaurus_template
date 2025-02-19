import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = ({ xAxisData, seriesData, chartTitle, xAxisName, yAxisName }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: chartTitle || '', // Optional chart title
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
        name: xAxisName || '', // Optional X-axis name
        nameLocation: 'center',
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        name: yAxisName || '', // Optional Y-axis name
        nameLocation: 'center',
        nameGap: 40
      },
      series: [
        {
          data: seriesData,
          type: 'line',
          areaStyle: {}
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [xAxisData, seriesData, chartTitle, xAxisName, yAxisName]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>;
};

export default LineChart;
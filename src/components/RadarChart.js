import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const RadarChart = ({ indicators, seriesData, chartStyle = { width: '100%', height: '400px' } }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    const option = {
      radar: {
        indicator: indicators,
        axisName: {
          color: '#fff',
          backgroundColor: '#666',
          borderRadius: 3,
          padding: [3, 5],
        },
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: seriesData,
        },
      ],
    };

    chart.setOption(option);

    // Cleanup on unmount
    return () => {
      chart.dispose();
    };
  }, [indicators, seriesData]);

  return <div ref={chartRef} style={chartStyle} />;
};

export default RadarChart;
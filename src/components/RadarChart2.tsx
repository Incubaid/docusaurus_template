import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface Project {
  name: string;
  values: number[];
}

interface RadarChartProps {
  projectData: Project[];
}

// Define a distinct color palette
const colorPalette = [
  { border: 'rgba(54, 162, 235, 1)', background: 'rgba(54, 162, 235, 0.2)' }, // Blue
  { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.2)' }, // Red
  { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.2)' }, // Teal
  { border: 'rgba(255, 159, 64, 1)', background: 'rgba(255, 159, 64, 0.2)' }, // Orange
  { border: 'rgba(153, 102, 255, 1)', background: 'rgba(153, 102, 255, 0.2)' }, // Purple
  { border: 'rgba(255, 205, 86, 1)', background: 'rgba(255, 205, 86, 0.2)' }, // Yellow
  { border: 'rgba(201, 203, 207, 1)', background: 'rgba(201, 203, 207, 0.2)' }, // Gray
];

const RadarChart: React.FC<RadarChartProps> = ({ projectData }) => {
  const data = {
    labels: ['Decentralization', 'Open Source', 'Tokens', 'API Driven', 'Geo Fencing', 'Capacity'],
    datasets: projectData.map((project, index) => ({
      label: project.name,
      data: project.values,
      backgroundColor: colorPalette[index % colorPalette.length].background, // Use distinct background color
      borderColor: colorPalette[index % colorPalette.length].border, // Use distinct border color
      borderWidth: 1,
    })),
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20,
          color: '#fff', // White color for the numbers
          backdropColor: 'transparent', // Remove the white background
          showLabelBackdrop: false, // Hide the square around the numbers
          font: {
            size: 12, // Adjust the font size if needed
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light gray grid lines for contrast
        },
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)', // Light gray angle lines for contrast
        },
        pointLabels: {
          color: '#fff', // White color for point labels
          font: {
            size: 12, // Adjust the font size of point labels
          },
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff', // White color for legend labels
        },
      },
    },
  };

  return (
    <Radar
      data={data}
      options={options}
      style={{ background: 'transparent' }} // Ensure the chart background is transparent
    />
  );
};

export default RadarChart;
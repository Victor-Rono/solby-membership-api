/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-interface */

interface ChartInterface {
  labels: string[]; // Labels for the chart
  series: number[]; // Data for the chart
  width?: number;   // Optional chart width
  height?: number;  // Optional chart height
}

export interface PieChartInterface extends ChartInterface {
  // Add properties specific to pie charts if needed
}

export interface BarChartInterface extends ChartInterface {
  barColors?: string[]; // Optional bar colors
}

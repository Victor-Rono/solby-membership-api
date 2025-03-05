/* eslint-disable prettier/prettier */


import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, ApexResponsive, ApexStroke } from "ng-apexcharts";
import { getFieldValuesFromArray } from 'victor-dev-toolbox';

export interface LineChartData {
  name: string; // Series name
  data: number[]; // Data points for the series
  categories: string[]; // X-axis labels
}

export interface ApexPieChartOptionsInterface {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  labels: any;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  stroke: ApexStroke;
  colors: any;
};

export interface ApexPieChartInterface {
  series: number[];
  labels: string[] | null;
  title: string;
}

export interface DatasetInterface {
  label: string,
  data: number[],
  borderWidth?: number,
}

// export interface ChartJsDataInterface {

//   datasets:
// }

export interface ChartJsInterface {
  type: 'bar' | 'chart' | 'line' | 'donut',
  data: {
    labels: string[] | number[],
    datasets: DatasetInterface[],
  }
  options: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    scales: {

    }
  }
}

export interface ApexKeysInterface { label: string, value: string }


export interface ApexChartOptionsInterface {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

export interface ApexChartsInterface {
  name: string,
  title: string,
  data: { x: any, y: any }[]
}

export function generateChatOptions(payload: ApexChartsInterface, chartType: 'bar' | 'line'): ApexChartOptionsInterface {
  const { name, title, data } = payload;
  const chatOptions: ApexChartOptionsInterface = {
    series: [
      {
        name: title,
        data: getFieldValuesFromArray('y', data) // y-axis values
      }
    ],
    chart: {
      type: chartType,
      height: 300,
    },
    xaxis: {
      categories: getFieldValuesFromArray('x', data),  // x-axis values
    },
    title: {
      text: title,
    },
  };
  return chatOptions;
}

export interface ApexPieChartOptionsInterface {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  labels: any;
  chart: ApexChart;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  stroke: ApexStroke;
  colors: any;
};

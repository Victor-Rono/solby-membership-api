/* eslint-disable prettier/prettier */

import { cloneDeep } from "lodash";
import { baseChartOptions } from "../data/apex-charts.data";
import { ApexKeysInterface, ApexPieChartInterface } from "../interfaces/apex-charts.interface";
import { ApexAxisChartSeries, ApexNonAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle } from "ng-apexcharts";


// Define a base chart configuration to avoid repetition


// export function createApexPieChart(pieChartData?: ApexPieChartInterface, chartType: 'pie' | 'donut' = 'donut'): ApexPieChartInterface {
//     const pieChartOptions = {
//         series: pieChartData?.series || [9, 5],
//         labels: pieChartData?.labels || ['cash', "credit"],
//         chart: {
//             type: chartType || 'pie',
//             width: 400,
//             fontFamily: 'lexend,sans-serif,Arial',
//         },
//         title: {
//             text: pieChartData?.title || 'pie chart label',
//         },
//         colors: ["#0c8d0c", "#4169e1", "#ffc107", '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'], // Pie chart colors
//         ...baseChartOptions, // Merge with the base options
//     };

//     return pieChartOptions;
// }

export function createApexPieChart(pieChartData: ApexPieChartInterface) {
    const { series, labels, title } = pieChartData;
    const chart: ApexChart = {
        type: 'pie',
        width: 380,
    };
    // labels = ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'];
    // responsive: ApexResponsive[] = [
    //     {
    //         breakpoint: 480,
    //         options: {
    //             chart: {
    //                 width: 200
    //             },
    //             legend: {
    //                 position: 'bottom'
    //             }
    //         }
    //     }
    // ];
}

export function prepareApexPieChartFromArray(array: any[], keys: ApexKeysInterface): any {
    const { label, value } = keys;

    // Extract labels and series data
    const labels = array.map(item => item[label]);
    const series = array.map(item => item[value]);

    return {
        series, // Series array for chart data
        chart: {
            type: 'pie',
            width: 380, // Default width
        },
        labels, // Labels for each slice
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200, // Adjust chart width at small breakpoints
                    },
                    legend: {
                        position: 'bottom', // Legend position for small screens
                    },
                },
            },
        ],
    };
}


export function prepareApexLineChartFromArray(array: any, keys: ApexKeysInterface): any {
    const { label, value } = keys;

    const pieOptions: any = cloneDeep(baseChartOptions);
    delete pieOptions.stroke

    const categories: any[] = [];
    const data: any[] = [];

    // Assuming each object has 'date' and 'value' fields for time-series data
    array.forEach((item: any) => {
        categories.push(item[label]); // Add date as category (X-axis)
        data.push(item[value]); // Add corresponding value for the Y-axis
    });

    return {
        series: [
            {
                name: 'Data', // Name of the series
                data: data, // Line chart values
            },
        ],
        chartOptions: {
            chart: {
                type: 'line',
            },
            xaxis: {
                categories: categories, // X-axis categories (e.g., dates)
            },
            stroke: {
                curve: 'smooth', // Smooth curve for the line
            },
            title: {
                text: 'Line Chart Example', // Optional title
            },
            ...pieOptions, // Merge with the base options
        },
    };
}

export function prepareApexDonutChartFromArray(array: any[], keys: ApexKeysInterface): any {
    const { label, value } = keys;
    const labels: string[] = [];
    const data: any[] = [];

    // Extract labels and data from the array
    array.forEach((item) => {
        labels.push(item[label]); // Add label
        data.push(item[value]); // Add corresponding value
    });

    return {
        series: data,
        chartOptions: {
            chart: {
                type: 'donut', // Specify donut chart type
            },
            labels: labels, // Set labels for the donut chart
            ...baseChartOptions, // Merge with base options
        },
    };
}

export function getApexChartColors(length: number): string[] {
    const colors: string[] = ["#0c8d0c", "#4169e1", "#ffc107", '#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];
    return colors.slice(0, length);
}





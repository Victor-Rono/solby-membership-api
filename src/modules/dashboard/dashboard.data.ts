/* eslint-disable prettier/prettier */
import { DashboardDonutInterface } from "./dashboard.interface";

/* eslint-disable prettier/prettier */
export const monthsData = ['Jan', 'Feb', 'Mar', 'Apr',
    'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



export const donutChartData = (delayed: boolean, donut?: DashboardDonutInterface) => {
    return {
        type: 'doughnut', //this denotes tha type of chart

        data: {
            labels: [
                'Cash Sales',
                'Credit Sales',
                'Purchases'
            ],
            datasets: [{
                label: 'Sales',
                data: [donut?.cashSales, donut?.creditSales, donut?.purchases],
                backgroundColor: [
                    'green',
                    '#ffc107',
                    'red',
                ],
                hoverOffset: 4
            }]
        },
        options: {
            animation: {
                onComplete: () => {
                    delayed = true;
                },
                delay: (context: any) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                        delay = context.dataIndex * 200 + context.datasetIndex * 300;
                    }
                    return delay;
                },
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    }
}
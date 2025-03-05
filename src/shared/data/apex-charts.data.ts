/* eslint-disable prettier/prettier */
export const baseChartOptions = {
    tooltip: {
        enabled: true, // Enable tooltips by default
    },
    responsive: [
        {
            breakpoint: 480,
            options: {
                chart: {
                    width: 200,
                },
                legend: {
                    position: 'bottom',
                },
            },
        },
        {
            breakpoint: 580,
            options: {
                chart: {
                    width: 410,
                },
                legend: {
                    position: 'top',
                },
            },
        },
        {
            breakpoint: 720,
            options: {
                chart: {
                    width: 420,
                },
                legend: {
                    position: 'top',
                },
            },
        },
        {
            breakpoint: 1700,
            options: {
                legend: {
                    position: 'top',
                },
            },
        },
    ],
    stroke: {
        width: 1,
        colors: ['#ffffff'], // Stroke color for charts
    },
};

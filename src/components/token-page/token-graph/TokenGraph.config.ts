export const getEChartOptions = (data) => {
    const { dates, prices } = data;

    return {
        xAxis: {
            type: 'category',
            data: dates,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: prices,
                type: 'line',
                areaStyle: {
                    color: '#ff0',
                    opacity: 0.5,
                },
            },
        ],
    };
};

// Example usage with mock data
export const mockData = {
    dates: ['2024-08-01', '2024-08-02', '2024-08-03', '2024-08-04', '2024-08-05'],
    prices: [100, 105, 102, 110, 108],
};

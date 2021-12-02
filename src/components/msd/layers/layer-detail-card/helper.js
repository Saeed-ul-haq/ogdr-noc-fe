export const data3Success = {
  labels: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
  ],
  datasets: [
    {
      backgroundColor: 'rgba(27, 201, 67, 0.1)',
      borderCapStyle: 'round',
      borderDash: [],
      borderWidth: 2,
      borderColor: '#1bc943',
      borderDashOffset: 0.0,
      borderJoinStyle: 'round',
      pointBorderColor: '#1bc943',
      pointBackgroundColor: '#ffffff',
      pointBorderWidth: 0,
      pointHoverRadius: 0,
      pointHoverBackgroundColor: '#ffffff',
      pointHoverBorderColor: '#1bc943',
      pointHoverBorderWidth: 0,
      pointRadius: 0,
      pointHitRadius: 0,
      data: [65, 59, 80, 81, 55, 38, 59, 80, 46],
    },
  ],
}
export const data3SuccessOptions = {
  layout: {
    padding: {
      left: -10,
      right: 0,
      top: 0,
      bottom: -10,
    },
  },
  scales: {
    yAxes: [
      {
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          display: false,
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
  },
  legend: {
    display: false,
  },
  responsive: true,
  maintainAspectRatio: false,
}

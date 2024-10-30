// Sidebar

export const lineChartDataSidebar = [
  {
    name: 'Balance',
    data: [10, 39, 80, 50, 10],
  },
  {
    name: 'Profit',
    data: [20, 60, 30, 40, 20],
  },
];

export const lineChartOptionsSidebar = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  markers: {
    size: 0,
    colors: '#868CFF',
    strokeColors: 'white',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: 'dark',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    type: 'gradient',
  },
  xaxis: {
    categories: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
    labels: {
      style: {
        colors: 'white',
        fontSize: '8px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  grid: {
    show: false,
    column: {
      colors: ['transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      type: 'vertical',
      shadeIntensity: 0.1,
      opacityFrom: 0.3,
      opacityTo: 0.9,
      colorStops: [
        [
          {
            offset: 0,
            color: 'white',
            opacity: 1,
          },
          {
            offset: 100,
            color: 'white',
            opacity: 0,
          },
        ],
        [
          {
            offset: 0,
            color: '#6AD2FF',
            opacity: 1,
          },
          {
            offset: 100,
            color: '#6AD2FF',
            opacity: 0.2,
          },
        ],
      ],
    },
  },
};

// Sidebar

export const barChartDataSidebar = [
  {
    name: 'Credits Used',
    data: [12, 10, 20, 30, 43, 32, 30],
  },
];

export const barChartOptionsSidebar = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: '12px',
    },
    onDatasetHover: {
      style: {
        fontSize: '12px',
      },
    },
    theme: 'dark',
  },
  xaxis: {
    categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    show: false,
    labels: {
      show: true,
      style: {
        colors: '#FFFFFF',
        fontSize: '12px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: 'black',
    labels: {
      show: true,
      style: {
        colors: '#CBD5E0',
        fontSize: '12px',
      },
    },
  },
  grid: {
    show: false,
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: 'solid',
    colors: ['#FFFFFF'],
    opacity: 1,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '40px',
    },
  },
};

// Project Default Dashboards Default

export const lineChartDataUsage = [
  {
    name: 'Credits Used',
    data: [
      0, 423, 33, 2, 34, 3, 5, 34, 10423, 12045, 12494,
      16642,
    ],
  },
];

export const lineChartOptionsUsage = {
  chart: {
    toolbar: {
      show: false,
    },
    dropShadow: {
      enabled: true,
      top: 13,
      left: 0,
      blur: 10,
      opacity: 0.1,
      color: '#4318FF',
    },
  },
  colors: ['#4318FF'],
  markers: {
    size: 0,
    colors: 'white',
    strokeColors: '#4318FF',
    strokeWidth: 2,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    offsetX: 0,
    offsetY: 0,
    showNullDataPoints: true,
  },
  tooltip: {
    theme: 'dark',
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
    type: 'gradient',
  },
  xaxis: {
    categories: [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ],
    labels: {
      style: {
        colors: '#718096',
        fontSize: '14px',
        fontWeight: '500',
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
  },
  legend: {
    show: false,
  },
  dropShadow: {
    enabled: true,
    top: 0,
    left: 0,
    blur: 3,
    opacity: 0.5,
  },
  grid: {
    show: false,
    column: {
      colors: ['transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
};

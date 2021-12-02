var chart0 = {
  properties: {
    title: 'Total Population',
  },
  option: {
    xAxis: {
      type: 'category',
      data: [
        'Ash Sharqiyah',
        'Ad Dakhliyah',
        'Adh Dhahirah',
        'Sharqiyah North',
        'Al Buraymi',
        'Al Batinah',
        'Al Wusta',
        'Batinah North',
        'Dhofar',
        'Muscat',
        'Musandam',
      ],
      axisLabel: {
        interval: 1,
        rotate: 50,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        interval: 0,
        rotate: 50,
      },
    },
    series: [
      {
        data: [
          322242,
          490900,
          224225,
          284333,
          115236,
          441569,
          51425,
          788654,
          456399,
          1443926,
          45935,
        ],
        type: 'line',
      },
    ],
  },
}
var chart1 = {
  properties: {
    title: 'Male Female Chart',
  },
  option: {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      orient: 'vertical',
      align: 'left',
      right: 0,
      data: ['Female', 'Male'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      axisLabel: {
        interval: 0,
        rotate: 50,
      },
    },
    yAxis: {
      type: 'category',
      data: [
        'Sharqi South',
        'Dakhliyah',
        'Dhahirah',
        'Sharqiyah',
        'Buraymi',
        'Batinah ',
        'Al Wusta',
        'Al Batinah',
        'Dhofar',
        'Muscat',
        'Musandam',
      ],
      axisLabel: {
        rotate: 30,
      },
    },
    series: [
      {
        name: 'Female',
        type: 'bar',
        data: [
          1152867,
          221063,
          196094,
          208388,
          57421,
          351178,
          37843,
          578778,
          248526,
          856345,
          34946,
        ],
      },
      {
        name: 'Male',
        type: 'bar',
        data: [
          169375,
          269837,
          28131,
          75945,
          57815,
          90391,
          13582,
          209876,
          207873,
          587581,
          10989,
        ],
      },
    ],
  },
}
var chart2 = {
  properties: {
    title: 'Omani Expatriate',
  },
  option: {
    xAxis: {
      type: 'category',
      data: ['281868', '466923', '209035', '261936', '112013'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [15204, 15581, 21684, 28238, 3596],
        type: 'scatter',
      },
    ],
  },
}

var chart3 = {
  properties: {
    title: 'Oman Private School',
  },
  option: {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      align: 'left',
      right: 0,
      data: ['Teachers', 'Servant', 'Office Staff', 'Girls', 'Boys'],
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'center',
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '15',
              fontWeight: 'bold',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        data: [
          { value: 335, name: 'Boys' },
          { value: 310, name: 'Girls' },
          { value: 150, name: 'Office Staff' },
          { value: 135, name: 'Teachers' },
          { value: 100, name: 'Servant' },
        ],
      },
    ],
  },
}
export default () => {
  return [chart0, chart1, chart2, chart3]
}

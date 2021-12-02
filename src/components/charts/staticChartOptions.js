import { filter } from 'lodash'
import {
  governateCenter,
  wilayatCenter,
  WilayatGov,
} from 'components/gis-map/helper'

import { governorateWiseResident } from './chartsData'

const minifiedGovernoratConfig = governateCenter.map(governorate => {
  let tempShortName = governorate.NameEnglis || ''
  tempShortName = tempShortName.replace(' Governorate', '')
  tempShortName = tempShortName.replace('South', `(S)`)
  tempShortName = tempShortName.replace('North', `(N)`)
  tempShortName = tempShortName.replace('Adh', 'Ad')
  tempShortName = tempShortName.replace('Adh', 'Ad')

  let tempWilayats = []
  let totalSalary = 0
  WilayatGov.forEach(bridge => {
    if (
      bridge.Governorate.toLowerCase() === governorate.NameEnglis.toLowerCase()
    ) {
      wilayatCenter.forEach(wilayat => {
        if (wilayat.NAME_ENGLI.toLowerCase() === bridge.Wilayat.toLowerCase()) {
          let flag = true
          tempWilayats.forEach(tempWilayat => {
            if (
              tempWilayat.NAME_ENGLI.toLowerCase() ===
              wilayat.NAME_ENGLI.toLowerCase()
            ) {
              flag = false
            }
          })
          if (flag) {
            tempWilayats.push({
              ...wilayat,
              Salary: parseFloat(parseFloat(wilayat.population).toFixed(2)),
              governorat: governorate,
            })
            totalSalary = totalSalary + parseFloat(parseFloat(wilayat.population))
          }
        }
      })
    }
  })
  return {
    ...governorate,
    label: tempShortName,
    wilayats: tempWilayats,
    totalSalary: parseFloat(parseFloat(totalSalary).toFixed(2)),
  }
})
let allWilayats = []
minifiedGovernoratConfig.forEach(minifiedGovernorat => {
  minifiedGovernorat.wilayats.forEach(wilayat => {
    allWilayats.push(wilayat)
  })
})
const getFilteredGovornoratInfo = GOVERNORAT => {
  const filteredGovernorate = filter(
    minifiedGovernoratConfig.map(row => {
      return {
        name: row.label,
        value: row.population,
        fullName: row.NameEnglis,
        config: row,
      }
    }),
    row => {
      if (GOVERNORAT.length === 0) {
        return true
      }
      if (
        GOVERNORAT.map(g => {
          return g.toLowerCase()
        }).includes(`${row.fullName}`.toLowerCase())
      ) {
        return true
      }
      return false
    },
  )
  return filteredGovernorate
}
const getFilteredSalarySeries = GOVERNORAT => {
  if (GOVERNORAT.length === 1) {
    return filter(
      allWilayats.map(wilayat => {
        return {
          name: wilayat.NAME_ENGLI,
          value: wilayat.Salary,
          governorat: wilayat.governorat,
        }
      }),
      row => {
        if (GOVERNORAT.length === 0) {
          return true
        }
        if (
          GOVERNORAT.map(g => {
            return g.toLowerCase()
          }).includes(`${row.governorat.NameEnglis}`.toLowerCase())
        ) {
          return true
        }
        return false
      },
    )
  } else {
    return filter(
      minifiedGovernoratConfig.map(row => {
        return {
          name: row.label,
          value: row.totalSalary,
          fullName: row.NameEnglis,
        }
      }),
      row => {
        if (GOVERNORAT.length === 0) {
          return true
        }
        if (
          GOVERNORAT.map(g => {
            return g.toLowerCase()
          }).includes(`${row.fullName}`.toLowerCase())
        ) {
          return true
        }
        return false
      },
    )
  }
}
export const chartsConfig = ({ GOVERNORAT = [] }) => {
  return {
    salaryGovernorat: {
      label: `Salaries Distribution based on ${
        GOVERNORAT.length === 1 ? `Wilayat (${GOVERNORAT[0]})` : 'Governorat'
      }`,
      key: 'salaryGovernorat',
    },
    salaryWilayat: {
      label: `Salaries Distribution based on ${
        GOVERNORAT.length === 1 ? `Wilayat (${GOVERNORAT[0]})` : 'Governorat'
      }`,
      key: 'salaryWilayat',
    },
    populationGovernorat: {
      label: 'Population Distribution based on Governorat',
      key: 'populationGovernorat',
    },
    renewed: {
      label: 'Renewed License',
      key: 'renewed',
    },
    new_fishing_boats: {
      label: 'New Fishing License Boats',
      key: 'new_fishing_boats',
    },
    value_of_export_fish: {
      label: 'Value of Export Fish (R.O)',
      key: 'value_of_export_fish',
    },
  }
}
const seriesLabel = {
  normal: {
    show: true,
    textBorderColor: '#333',
    textBorderWidth: 2,
  },
}
export const staticChartOptions = ({ GOVERNORAT = [] }) => {
  const data = {
    salaryGovernorat: {
      yAxis: getFilteredSalarySeries(GOVERNORAT).map(item => {
        return item.name
      }),
      series: getFilteredSalarySeries(GOVERNORAT).map(item => {
        return item.value
      }),
    },
    salaryWilayat: {
      series: getFilteredSalarySeries(GOVERNORAT),
    },
    populationGovernorat: {
      xAxis: getFilteredGovornoratInfo(GOVERNORAT).map(
        governorat => governorat.name,
      ),
      series: getFilteredGovornoratInfo(GOVERNORAT).map(
        governorat => governorat.value,
      ),
    },
    renewed: {
      yAxis: filter(
        [
          { value: 800, name: 'Ad Dakhliyah' },
          { value: 700, name: 'Adh Dhahirah' },
          { value: 365, name: 'Al Buraymi' },
          { value: 514, name: 'Al Wusta' },
          { value: 456, name: 'Dhofar' },
          { value: 1443, name: 'Muscat' },
          { value: 459, name: 'Musandam' },
        ],
        row => {
          if (GOVERNORAT.length === 0) {
            return true
          }
          if (
            GOVERNORAT.map(g => {
              return g.toLowerCase()
            }).includes(`${row.name} Governorate`.toLowerCase())
          ) {
            return true
          }
          return false
        },
      ).map(item => {
        return item.name
      }),
      series: filter(
        [
          { value: 800, name: 'Ad Dakhliyah' },
          { value: 700, name: 'Adh Dhahirah' },
          { value: 365, name: 'Al Buraymi' },
          { value: 514, name: 'Al Wusta' },
          { value: 456, name: 'Dhofar' },
          { value: 1443, name: 'Muscat' },
          { value: 459, name: 'Musandam' },
        ],
        row => {
          if (GOVERNORAT.length === 0) {
            return true
          }
          if (
            GOVERNORAT.map(g => {
              return g.toLowerCase()
            }).includes(`${row.name} Governorate`.toLowerCase())
          ) {
            return true
          }
          return false
        },
      ).map(item => {
        return item.value
      }),
    },
    new_fishing_boats: {
      series: filter(
        [
          { value: 242, name: 'Ash Sharqiyah South' },
          { value: 900, name: 'Ad Dakhliyah' },
          { value: 225, name: 'Adh Dhahirah' },
          { value: 333, name: 'Ash Sharqiyah North' },
          { value: 1236, name: 'Al Buraymi' },
          { value: 1425, name: 'Al Wusta' },
          { value: 399, name: 'Dhofar' },
          { value: 926, name: 'Muscat' },
          { value: 935, name: 'Musandam' },
        ],
        row => {
          if (GOVERNORAT.length === 0) {
            return true
          }
          if (
            GOVERNORAT.map(g => {
              return g.toLowerCase()
            }).includes(`${row.name} Governorate`.toLowerCase())
          ) {
            return true
          }
          return false
        },
      ),
    },
    value_of_export_fish: {
      series: filter(
        [
          {
            name: 'Ad Dakhliyah',
            type: 'line',
            data: [17, 13, 10, 2, 2],
          },
          {
            name: 'Adh Dhahirah',
            type: 'line',
            data: [5, 4, 3, 2, 3],
          },
          {
            name: 'Al Buraymi',
            type: 'line',
            data: [3, 5, 7, 6, 5],
          },
          {
            name: 'Al WustaAmerica',
            type: 'line',
            data: [2, 3, 3, 1.5, 3.5],
          },
          {
            name: 'Dhofar',
            type: 'line',
            data: [1, 2, 2.5, 2.5, 2.5],
          },
          {
            name: 'Muscat',
            type: 'line',
            data: [1, 1, 1, 1, 1],
          },
          {
            name: 'Musandam',
            type: 'line',
            data: [1, 1, 1, 1, 1],
          },
        ],
        row => {
          if (GOVERNORAT.length === 0) {
            return true
          }
          if (
            GOVERNORAT.map(g => {
              return g.toLowerCase()
            }).includes(`${row.name} Governorate`.toLowerCase())
          ) {
            return true
          }
          return false
        },
      ),
      legend: {
        data: filter(
          [
            {
              name: 'Ad Dakhliyah',
              type: 'line',
              data: [17, 13, 10, 2, 2],
            },
            {
              name: 'Adh Dhahirah',
              type: 'line',
              data: [5, 4, 3, 2, 3],
            },
            {
              name: 'Al Buraymi',
              type: 'line',
              data: [3, 5, 7, 6, 5],
            },
            {
              name: 'Al WustaAmerica',
              type: 'line',
              data: [2, 3, 3, 1.5, 3.5],
            },
            {
              name: 'Dhofar',
              type: 'line',
              data: [1, 2, 2.5, 2.5, 2.5],
            },
            {
              name: 'Muscat',
              type: 'line',
              data: [1, 1, 1, 1, 1],
            },
            {
              name: 'Musandam',
              type: 'line',
              data: [1, 1, 1, 1, 1],
            },
          ],
          row => {
            if (GOVERNORAT.length === 0) {
              return true
            }
            if (
              GOVERNORAT.map(g => {
                return g.toLowerCase()
              }).includes(`${row.name} Governorate`.toLowerCase())
            ) {
              return true
            }
            return false
          },
        ).map(item => {
          return item.name
        }),
      },
    },
  }
  return {
    salaryGovernorat: {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: 100,
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: '{value}',
        },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: data.salaryGovernorat.yAxis,
        axisLabel: {
          formatter: function(value) {
            let showLabel = value
            showLabel = showLabel.replace('Ash ', '')
            showLabel = showLabel.replace('WILAYAT ', '')
            return showLabel
          },
          align: 'right',
        },
      },
      series: [
        {
          name: 'Salaries',
          type: 'bar',
          label: seriesLabel,
          data: data.salaryGovernorat.series,
        },
      ],
    },
    salaryWilayat: {
      title: {
        text: '',
        subtext: '',
      },
      legend: {},
      series: [
        {
          name: 'Salary Distribution based on Wilayat',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data.salaryWilayat.series,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    },
    populationGovernorat: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: data.populationGovernorat.xAxis,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.populationGovernorat.series,
          type: 'line',
        },
        {
          data: data.populationGovernorat.series,
          type: 'bar',
        },
      ],
    },
    renewed: {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: 100,
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: '{value}',
        },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: data.renewed.yAxis,
        axisLabel: {
          formatter: function(value) {
            return value
          },
          marginRight: 10,
          align: 'right',
        },
      },
      series: [
        {
          name: 'Renewed Licenses',
          type: 'bar',
          label: seriesLabel,
          data: data.renewed.series,
        },
      ],
    },
    new_fishing_boats: {
      title: {
        text: '',
        subtext: '',
      },
      legend: {},
      series: [
        {
          name: 'Fishing License',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: data.new_fishing_boats.series,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    },
    value_of_export_fish: {
      tooltip: {
        trigger: 'axis',
      },
      legend: data.value_of_export_fish.legend,
      toolbox: {
        show: false,
        feature: {
          dataZoom: {
            yAxisIndex: 'none',
          },
          dataView: { readOnly: false },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['2011', '2012', '2013', '2014', '2015'],
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}M',
        },
      },
      series: data.value_of_export_fish.series,
    },
  }
}
const getFilteredGovornorateData = GOVERNORAT => {
  const Residents = governorateWiseResident()
  let filterdResidents = {}
  if (GOVERNORAT.length > 0) {
    Object.keys(Residents).forEach(governorat => {
      if (
        GOVERNORAT.map(g => g.toLowerCase()).includes(governorat.toLowerCase())
      ) {
        filterdResidents = {
          ...filterdResidents,
          [governorat]: Residents[governorat],
        }
      }
    })
  } else {
    filterdResidents = Residents
  }
  if (Object.keys(filterdResidents).length === 1){
    let tempWilayatWiseResidents = {}
    Object.keys(filterdResidents).forEach(res => {
      filterdResidents[res].forEach(row => {
        const { Wilayat } = row
        if (tempWilayatWiseResidents[Wilayat]) {
          tempWilayatWiseResidents = { ...tempWilayatWiseResidents, [Wilayat]: [...tempWilayatWiseResidents[Wilayat], row] }
        } else {
          tempWilayatWiseResidents = { ...tempWilayatWiseResidents, [Wilayat]: [row] }
        }
      })
    })
    filterdResidents = tempWilayatWiseResidents
  }
  console.log({
    filterdResidents,
  })
  return filterdResidents
}

export const getBarChartPopulation = ({ GOVERNORAT = [] }) => {
  const filterdResidents = getFilteredGovornorateData(GOVERNORAT)
  let minifiedFilteredResidents = {}
  Object.keys(filterdResidents).forEach(governorat => {
    let tempShortName = governorat
    tempShortName = tempShortName.replace(' Governorate', '')
    tempShortName = tempShortName.replace(' GOVERNORATE', '')
    tempShortName = tempShortName.replace('South', `(S)`)
    tempShortName = tempShortName.replace('SOUTH', `(S)`)
    tempShortName = tempShortName.replace('North', `(N)`)
    tempShortName = tempShortName.replace('NORTH', `(N)`)
    tempShortName = tempShortName.replace('ADH', 'AD')
    tempShortName = tempShortName.replace('Adh', 'Ad')
    minifiedFilteredResidents = {
      ...minifiedFilteredResidents,
      [tempShortName]: filterdResidents[governorat],
    }
  })

  const dataAxis = Object.keys(minifiedFilteredResidents).map(
    governorat => governorat,
  )
  const data = Object.keys(minifiedFilteredResidents).map(
    governorat => minifiedFilteredResidents[governorat].length,
  )
  const yMax = 500
  const dataShadow = []

  for (var i = 0; i < data.length; i++) {
    dataShadow.push(yMax)
  }

  return {
    xAxis: {
      data: dataAxis,
      axisLabel: {
        inside: false,
        textStyle: {
          color: '#000',
        },
      },
      axisTick: {
        show: true,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: '#999',
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    series: [
      {
        // For shadow
        type: 'bar',
        itemStyle: {
          color: 'rgba(0,0,0,0.05)',
        },
        barGap: '-100%',
        barCategoryGap: '40%',
        data: dataShadow,
        animation: false,
      },
      {
        type: 'bar',
        itemStyle: {},
        emphasis: {
          itemStyle: {},
        },
        data: data,
      },
    ],
  }
}

export const getNbrOfWives = ({ GOVERNORAT = [] }) => {
  const filterdResidents = getFilteredGovornorateData(GOVERNORAT)
  let minifiedFilteredResidents = {}
  Object.keys(filterdResidents).forEach(governorat => {
    let tempShortName = governorat
    tempShortName = tempShortName.replace(' Governorate', '')
    tempShortName = tempShortName.replace(' GOVERNORATE', '')
    tempShortName = tempShortName.replace('South', `(S)`)
    tempShortName = tempShortName.replace('SOUTH', `(S)`)
    tempShortName = tempShortName.replace('North', `(N)`)
    tempShortName = tempShortName.replace('NORTH', `(N)`)
    tempShortName = tempShortName.replace('ADH', 'AD')
    tempShortName = tempShortName.replace('Adh', 'Ad')
    minifiedFilteredResidents = {
      ...minifiedFilteredResidents,
      [tempShortName]: filterdResidents[governorat],
    }
  })
  /** CALCULTE WIVES - START */
  let governorateWiseNbrOfWives = {}
  Object.keys(minifiedFilteredResidents).forEach(g => {
    let wives = 0
    minifiedFilteredResidents[g].forEach(gw => {
      if (gw['Wife Num']) {
        wives = wives + parseInt(gw['Wife Num'])
      }
    })
    governorateWiseNbrOfWives = {
      ...governorateWiseNbrOfWives,
      [g]: wives,
    }
  })
  /** CALCULTE WIVES - END */
  const data = Object.keys(governorateWiseNbrOfWives).map(
    governorat => governorateWiseNbrOfWives[governorat],
  )
  const yMax = 500
  const dataShadow = []

  for (var i = 0; i < data.length; i++) {
    dataShadow.push(yMax)
  }

  return {
    pie: {
      title: {
        text: '',
        subtext: '',
      },
      legend: {
        type: 'scroll',
        top: 0,
      },
      series: [
        {
          name: 'Total Number of Wives',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: Object.keys(governorateWiseNbrOfWives).map(g => {
            return {
              name: g,
              value: governorateWiseNbrOfWives[g],
            }
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    },
    bar: {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: 150,
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: '{value}',
        },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: Object.keys(governorateWiseNbrOfWives),
        axisLabel: {
          formatter: function(value) {
            let showLabel = value
            showLabel = showLabel.replace('Ash ', '')
            showLabel = showLabel.replace('WILAYAT ', '')
            return showLabel
          },
          align: 'right',
        },
      },
      series: [
        {
          name: 'Wives',
          type: 'bar',
          label: seriesLabel,
          data: Object.keys(governorateWiseNbrOfWives).map(g => {
            return {
              name: g,
              value: governorateWiseNbrOfWives[g],
            }
          }),
        },
      ],
    },
  }
}

export const getNbrOfChildren = ({ GOVERNORAT = [] }) => {
  const filterdResidents = getFilteredGovornorateData(GOVERNORAT)
  let minifiedFilteredResidents = {}
  Object.keys(filterdResidents).forEach(governorat => {
    let tempShortName = governorat
    tempShortName = tempShortName.replace(' Governorate', '')
    tempShortName = tempShortName.replace(' GOVERNORATE', '')
    tempShortName = tempShortName.replace('South', `(S)`)
    tempShortName = tempShortName.replace('SOUTH', `(S)`)
    tempShortName = tempShortName.replace('North', `(N)`)
    tempShortName = tempShortName.replace('NORTH', `(N)`)
    tempShortName = tempShortName.replace('ADH', 'AD')
    tempShortName = tempShortName.replace('Adh', 'Ad')
    minifiedFilteredResidents = {
      ...minifiedFilteredResidents,
      [tempShortName]: filterdResidents[governorat],
    }
  })
  /** CALCULTE childeren - START */
  let governorateWiseNbrOfWives = {}
  Object.keys(minifiedFilteredResidents).forEach(g => {
    let childeren = 0
    minifiedFilteredResidents[g].forEach(gw => {
      if (gw['childeren Num']) {
        childeren = childeren + parseInt(gw['childeren Num'])
      }
    })
    governorateWiseNbrOfWives = {
      ...governorateWiseNbrOfWives,
      [g]: childeren,
    }
  })
  /** CALCULTE childeren - END */
  const data = Object.keys(governorateWiseNbrOfWives).map(
    governorat => governorateWiseNbrOfWives[governorat],
  )
  const yMax = 500
  const dataShadow = []

  for (var i = 0; i < data.length; i++) {
    dataShadow.push(yMax)
  }

  return {
    pie: {
      title: {
        text: '',
        subtext: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        type: 'scroll',
        top: 0,
      },
      series: [
        {
          name: 'Total Number of Children',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: Object.keys(governorateWiseNbrOfWives).map(g => {
            return {
              name: g,
              value: governorateWiseNbrOfWives[g],
            }
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    },
    bar: {
      title: {
        text: '',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: 150,
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: '{value}',
        },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: Object.keys(governorateWiseNbrOfWives),
        axisLabel: {
          formatter: function(value) {
            let showLabel = value
            showLabel = showLabel.replace('Ash ', '')
            showLabel = showLabel.replace('WILAYAT ', '')
            return showLabel
          },
          align: 'right',
        },
      },
      series: [
        {
          name: 'Wives',
          type: 'bar',
          label: seriesLabel,
          data: Object.keys(governorateWiseNbrOfWives).map(g => {
            return {
              name: g,
              value: governorateWiseNbrOfWives[g],
            }
          }),
        },
      ],
    },
  }
}

export const getEligibilityScore = ({ GOVERNORAT = [] }) => {
  const filterdResidents = getFilteredGovornorateData(GOVERNORAT)
  let minifiedFilteredResidents = {}
  Object.keys(filterdResidents).forEach(governorat => {
    let tempShortName = governorat
    tempShortName = tempShortName.replace(' Governorate', '')
    tempShortName = tempShortName.replace(' GOVERNORATE', '')
    tempShortName = tempShortName.replace('South', `(S)`)
    tempShortName = tempShortName.replace('SOUTH', `(S)`)
    tempShortName = tempShortName.replace('North', `(N)`)
    tempShortName = tempShortName.replace('NORTH', `(N)`)
    tempShortName = tempShortName.replace('ADH', 'AD')
    tempShortName = tempShortName.replace('Adh', 'Ad')
    minifiedFilteredResidents = {
      ...minifiedFilteredResidents,
      [tempShortName]: filterdResidents[governorat],
    }
  })
  /** CALCULTE ELIGIBILITY SCORE - START */
  let governorateWiseEligibilityScore = {}
  Object.keys(minifiedFilteredResidents).forEach(g => {
    let totalNbrOfRows = 0
    let totalEligibilityScore = 0
    minifiedFilteredResidents[g].forEach(gw => {
      if (gw['Eligibility Score']) {
        totalEligibilityScore =
          totalEligibilityScore + parseInt(gw['Eligibility Score'])
        totalNbrOfRows++
      }
    })
    governorateWiseEligibilityScore = {
      ...governorateWiseEligibilityScore,
      [g]: parseInt(totalEligibilityScore / totalNbrOfRows),
    }
  })
  /** CALCULTE ELIGIBILITY SCORE - END */
  return {
    radar: {
      title: {
        text: '',
        subtext: 'This is average eligibility score (0 - 100)',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        left: 'center',
        data: Object.keys(governorateWiseEligibilityScore),
      },
      radar: [
        {
          indicator: Object.keys(governorateWiseEligibilityScore).map(es => {
            return {
              text: es,
              max: 100,
            }
          }),
          center: ['50%', '55%'],
          // radius: 150,
        },
      ],
      series: [
        {
          type: 'radar',
          tooltip: {
            trigger: 'item',
          },
          areaStyle: {},
          data: [
            {
              value: Object.keys(governorateWiseEligibilityScore).map(es => {
                return governorateWiseEligibilityScore[es]
              }),
              name: 'Eligibility Score',
            },
          ],
        },
      ],
    },
    line: {
      title: {
        text: '',
        subtext: 'This is average eligibility score (0 - 100)',
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          const { name, value } = params[0]
          return `${name}: ${value}`
        },
        axisPointer: {
          animation: false,
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: Object.keys(governorateWiseEligibilityScore),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: Object.keys(governorateWiseEligibilityScore).map(es => {
            return governorateWiseEligibilityScore[es]
          }),
          type: 'line',
          areaStyle: {},
        },
      ],
    },
    bar: {
      title: {
        text: '',
        subtext: 'This is average eligibility score (0 - 100)',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: 150,
      },
      toolbox: {
        show: false,
        feature: {
          saveAsImage: {},
        },
      },
      yAxis: {
        type: 'value',
        name: '',
        axisLabel: {
          formatter: '{value}',
        },
      },
      xAxis: {
        type: 'category',
        inverse: true,
        data: Object.keys(governorateWiseEligibilityScore),
        axisLabel: {
          formatter: function(value) {
            let showLabel = value
            showLabel = showLabel.replace('Ash ', '')
            showLabel = showLabel.replace('WILAYAT ', '')
            return showLabel
          },
          align: 'right',
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      series: [
        {
          name: 'Avg. Eligibility Score',
          type: 'bar',
          label: seriesLabel,
          itemStyle: {
            color: '#ba68c8',
          },
          data: Object.keys(governorateWiseEligibilityScore).map(g => {
            return {
              name: g,
              value: governorateWiseEligibilityScore[g],
            }
          }),
        },
      ],
    },
  }
}

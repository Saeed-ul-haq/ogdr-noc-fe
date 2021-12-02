import React from 'react'
import OlFormatWkt from 'ol/format/WKT'
import Circle from 'ol/geom/Circle'
import { fromCircle } from 'ol/geom/Polygon'
const covidData = require('./covid-data.json')
const heatMapJson = require('libs/assets/heatmap.json')
const wilayatGovernatJson = require('libs/assets/wilayatGovernat.json')
const welfareData = require('libs/assets/welfareData.json')
export const welfareItemsToMap = (items, centerBy = 'governorate') => {
  const governorate = governateCenter.reduce((prev, next) => {
    const { NameEnglis: name, ...xy } = next
    if (name) {
      prev[name.toLowerCase()] = xy
    }
    return prev
  }, {})

  const wilayat = wilayatCenter.reduce((prev, next) => {
    const { NameEnglis: name, ...xy } = next
    if (name) {
      prev[name.toLowerCase()] = xy
    }
    return prev
  }, {})

  const centers = centerBy === 'wilayat' ? wilayat : governorate

  return items.map((item, i) => {
    return {
      id: i,
      latitude: +centers[item[centerBy].toLowerCase()].Y,
      longitude: +centers[item[centerBy].toLowerCase()].X,
      quantity: 1,
    }
  })
}

export const getHeatMapData = () => {
  return heatMapJson
}

export const wilayatItems = (layer, filterRange) => {
  const layerLabel = layer.displayName
  const filterAttrib = layerAttribute[layerLabel]

  let dataItems = filterAttrib === 'population' ? wilayatCenter : welfareData
  let min = 0
  let max = 0

  if (!filterRange) {
    const [mn, mx] = (getLayerFilterRange(layer) || {}).defaultVal
    min = mn
    max = mx
  } else {
    const [mn, mx] = filterRange
    min = mn
    max = mx
  }
  dataItems = dataItems.filter(c => {
    if (min === max) {
      return c[filterAttrib] && +c[filterAttrib] >= +min
    } else {
      return (
        c[filterAttrib] && +c[filterAttrib] >= +min && +c[filterAttrib] <= +max
      )
    }
  })

  const items = dataItems.map((c, i) => {
    return {
      id: i,
      latitude: filterAttrib === 'population' ? +c.Y : +c.latitude,
      longitude: filterAttrib === 'population' ? +c.X : +c.longitude,
      Wilayat: c['NAME_ENGLI'],
      featureAttribute: 'Wilayat',
      lyrName: 'welfareLayer',
      quantity: (+c[filterAttrib] || 0.0).toFixed(2),
      // popup: {
      //   id: i,
      //   latitude: +c.latitude,
      //   longitude: +c.longitude,
      //   Wilayat: c['NAME_ENGLI'],
      //   featureAttribute: 'Wilayat',
      //   lyrName: 'welfareLayer',
      //   quantity: c[filterAttrib] ? (+c[filterAttrib]).toFixed(2) : 1,
      // },
    }
  })

  return items
}

export const getWilayatDataItems = () => {
  const wilGov = WilayatGov.reduce((prev, next) => {
    prev[next['Wilayat']] = next['Governorate']
    return prev
  }, {})
  const items = wilayatCenter.map((c, i) => {
    return {
      Wilayat: c['NAME_ENGLI'],
      Governate: wilGov[c['NAME_ENGLI']],
      Cumulative_Salary: (+c.Salary).toFixed(2) + ' OMR',
      __geom: {
        type: 'Point',
        coordinates: [+c.latitude, +c.longitude],
      },
      ...c,
    }
  })

  return items
}

export const governateCenter = [
  {
    X: '59.2258370547394',
    Y: '21.9496521000074',
    NameEnglis: 'Ash Sharqiyah South Governorate',
    population: 434091,
  },
  {
    X: '57.3964194916608',
    Y: '22.1113304619782',
    NameEnglis: 'Ad Dakhliyah Governorate',
    population: 482818,
  },
  {
    X: '56.137879434513',
    Y: '22.6712696901368',
    NameEnglis: 'Adh Dhahirah Governorate',
    population: 222699,
  },
  {
    X: '58.4574773118996',
    Y: '22.2680397359024',
    NameEnglis: 'Ash Sharqiyah North Governorate',
    population: 282792,
  },
  {
    X: '55.9915735537869',
    Y: '24.3270594229089',
    NameEnglis: 'Al Buraymi Governorate',
    population: 114425,
  },
  {
    X: '57.5707831930404',
    Y: '23.4716756556603',
    NameEnglis: 'Al Batinah South Governorate',
    population: 434091,
  },
  {
    X: '56.6324182613111',
    Y: '20.0438112386048',
    NameEnglis: 'Al Wusta Governorate',
    population: 48957,
  },
  {
    X: '56.7140650888967',
    Y: '24.1137074289488',
    NameEnglis: 'Al Batinah North Governorate',
    population: 784477,
  },
  {
    X: '54.0917083119604',
    Y: '18.3355559348223',
    NameEnglis: 'Dhofar Governorate',
    population: 454032,
  },
  {
    X: '58.6272985373751',
    Y: '23.321451119636',
    NameEnglis: 'Muscat Governorate',
    population: 1478676,
  },
  {
    X: '56.2828556196607',
    Y: '25.9848133397579',
    NameEnglis: 'Musandam Governorate',
    population: 45200,
  },
]

export const wilayatCenter = [
  {
    X: '57.2731787797',
    Y: '19.2708473115',
    NAME_ENGLI: 'WILAYAT AD DUQM',
    population: '2654.96603706562',
  },
  {
    X: '57.3422558404',
    Y: '21.7048625382',
    NAME_ENGLI: 'WILAYAT ADAM',
    population: '1494.85126532808',
  },
  {
    X: '58.5061797645',
    Y: '23.36426034',
    NAME_ENGLI: 'WILAYAT AL AMRAT',
    population: '1576.84786696079',
  },
  {
    X: '57.5714795351',
    Y: '23.2746578732',
    NAME_ENGLI: 'WILAYAT AL AWABI',
    population: '1751.88843170118',
  },
  {
    X: '56.0698230947',
    Y: '24.0617257255',
    NAME_ENGLI: 'WILAYAT AL BURAYMI',
    population: '1689.74399915586',
  },
  {
    X: '57.2449867959',
    Y: '23.1546317758',
    NAME_ENGLI: 'WILAYAT AL HAMRA',
    population: '1494.63876583641',
  },
  {
    X: '56.3118344102',
    Y: '18.5842015008',
    NAME_ENGLI: 'WILAYAT AL JAZIR',
    population: '2083.3690421149',
  },
  {
    X: '59.1764620469',
    Y: '22.3626081504',
    NAME_ENGLI: 'WILAYAT AL KAMIL WA AL WAFI',
    population: '1834.50811355592',
  },
  {
    X: '56.913654046',
    Y: '23.8159741186',
    NAME_ENGLI: 'WILAYAT AL KHABURAH',
    population: '2868.4977147783',
  },
  {
    X: '52.6914462764',
    Y: '18.2242212902',
    NAME_ENGLI: 'WILAYAT AL MAZYUNAH',
    population: '2947.2071240286',
  },
  {
    X: '58.250385737',
    Y: '22.0869185575',
    NAME_ENGLI: 'WILAYAT AL MUDAYBI',
    population: '1695.77896267994',
  },
  {
    X: '57.5737270698',
    Y: '23.689883807',
    NAME_ENGLI: 'WILAYAT AL MUSANAAH',
    population: '1260.70527026998',
  },
  {
    X: '58.6568320036',
    Y: '22.5885744974',
    NAME_ENGLI: 'WILAYAT AL QABIL',
    population: '1650.02255606488',
  },
  {
    X: '57.3348228802',
    Y: '23.4434567356',
    NAME_ENGLI: 'WILAYAT AR RUSTAQ',
    population: '791.466925469408',
  },
  {
    X: '58.1846999226',
    Y: '23.5811124773',
    NAME_ENGLI: 'WILAYAT AS SEEB',
    population: '908.622025717114',
  },
  {
    X: '55.7353422775',
    Y: '23.686433166',
    NAME_ENGLI: 'WILAYAT AS SUNAYNAH',
    population: '1718.41240397689',
  },
  {
    X: '57.2668171178',
    Y: '23.7641273611',
    NAME_ENGLI: 'WILAYAT AS SUWAYQ',
    population: '637.342650567309',
  },
  {
    X: '57.0989706208',
    Y: '22.7148372415',
    NAME_ENGLI: 'WILAYAT BAHLA',
    population: '1421.46933018633',
  },
  {
    X: '57.865387938',
    Y: '23.6500579504',
    NAME_ENGLI: 'WILAYAT BARKA',
    population: '2054.73202069624',
  },
  {
    X: '58.358058786',
    Y: '23.50467644',
    NAME_ENGLI: 'WILAYAT BAWSHAR',
    population: '2747.34843204527',
  },
  {
    X: '58.2291326793',
    Y: '23.3187880287',
    NAME_ENGLI: 'WILAYAT BIDBID',
    population: '1274.9178299594',
  },
  {
    X: '58.8243015254',
    Y: '22.1265893285',
    NAME_ENGLI: 'WILAYAT BIDIYAH',
    population: '1533.49613946136',
  },
  {
    X: '56.1653059423',
    Y: '26.0684528717',
    NAME_ENGLI: 'WILAYAT BUKHA',
    population: '2297.3166195878',
  },
  {
    X: '56.255050351',
    Y: '25.777614249',
    NAME_ENGLI: 'WILAYAT DABA',
    population: '962.189735034912',
  },
  {
    X: '53.0919477026',
    Y: '16.8685513129',
    NAME_ENGLI: 'WILAYAT DALKUT',
    population: '2021.7918800203',
  },
  {
    X: '58.6672019963',
    Y: '23.0178054339',
    NAME_ENGLI: 'WILAYAT DAMA WA AT TAIYIN',
    population: '1297.77164082219',
  },
  {
    X: '56.2299155533',
    Y: '23.668071954',
    NAME_ENGLI: 'WILAYAT DANK',
    population: '1939.33535460658',
  },
  {
    X: '56.2308265774',
    Y: '20.2153342527',
    NAME_ENGLI: 'WILAYAT HAYMA',
    population: '755.806319456253',
  },
  {
    X: '58.4679762441',
    Y: '22.7774787259',
    NAME_ENGLI: 'WILAYAT IBRA',
    population: '2838.0018653393',
  },
  {
    X: '56.1229867862',
    Y: '22.5727817723',
    NAME_ENGLI: 'WILAYAT IBRI',
    population: '563.473613941922',
  },
  {
    X: '57.8090117694',
    Y: '22.778763899',
    NAME_ENGLI: 'WILAYAT IZKI',
    population: '1071.7969500844',
  },
  {
    X: '59.4058133472',
    Y: '21.8315983922',
    NAME_ENGLI: 'WILAYAT JAALAN BANI BU ALI',
    population: '2008.24018911473',
  },
  {
    X: '59.0721489464',
    Y: '21.7189562393',
    NAME_ENGLI: 'WILAYAT JAALAN BANI BU HASAN',
    population: '2316.5414149638',
  },
  {
    X: '56.3155923742',
    Y: '26.0879792502',
    NAME_ENGLI: 'WILAYAT KHASAB',
    population: '1069.73116417719',
  },
  {
    X: '56.4074455623',
    Y: '24.4697856992',
    NAME_ENGLI: 'WILAYAT LIWA',
    population: '1649.06655706444',
  },
  {
    X: '56.2858916825',
    Y: '25.2852175757',
    NAME_ENGLI: 'WILAYAT MADHA',
    population: '1834.67422698911',
  },
  {
    X: '56.021061049',
    Y: '24.5223004511',
    NAME_ENGLI: 'WILAYAT MAHADAH',
    population: '2117.77917296825',
  },
  {
    X: '58.0006128615',
    Y: '20.6781502939',
    NAME_ENGLI: 'WILAYAT MAHAWT',
    population: '2078.06010203149',
  },
  {
    X: '57.5970887236',
    Y: '22.7201970809',
    NAME_ENGLI: 'WILAYAT MANAH',
    population: '1122.58761856252',
  },
  {
    X: '58.7776649667',
    Y: '20.4116493501',
    NAME_ENGLI: 'WILAYAT MASIRAH',
    population: '2863.31559798724',
  },
  {
    X: '54.6666709366',
    Y: '17.0858719454',
    NAME_ENGLI: 'WILAYAT MIRBAT',
    population: '2896.43478198737',
  },
  {
    X: '54.7425135359',
    Y: '19.3101389531',
    NAME_ENGLI: 'WILAYAT MUQSHIN',
    population: '685.729399644144',
  },
  {
    X: '58.7004438291',
    Y: '23.4694815875',
    NAME_ENGLI: 'WILAYAT MUSCAT',
    population: '829.216916926053',
  },
  {
    X: '58.5356891214',
    Y: '23.5911429976',
    NAME_ENGLI: 'WILAYAT MUTRAH',
    population: '1430.89773837281',
  },
  {
    X: '57.8071453493',
    Y: '23.3866117597',
    NAME_ENGLI: 'WILAYAT NAKHAL',
    population: '593.824479948342',
  },
  {
    X: '57.5521155265',
    Y: '22.9734913589',
    NAME_ENGLI: 'WILAYAT NIZWA',
    population: '1468.59233255685',
  },
  {
    X: '58.9033195926',
    Y: '23.1261220541',
    NAME_ENGLI: 'WILAYAT QURAYYAT',
    population: '961.227077470405',
  },
  {
    X: '53.4213771961',
    Y: '16.8908442894',
    NAME_ENGLI: 'WILAYAT RAKHYUT',
    population: '2652.8805767546',
  },
  {
    X: '54.9557256206',
    Y: '17.3067755757',
    NAME_ENGLI: 'WILAYAT SADAH',
    population: '2422.93562818007',
  },
  {
    X: '56.7895664036',
    Y: '23.9517139971',
    NAME_ENGLI: 'WILAYAT SAHAM',
    population: '2775.8893935733',
  },
  {
    X: '53.8579138516',
    Y: '17.1954501892',
    NAME_ENGLI: 'WILAYAT SALALAH',
    population: '2454.5030449281',
  },
  {
    X: '58.0331395558',
    Y: '23.1937120388',
    NAME_ENGLI: 'WILAYAT SAMAIL',
    population: '2836.75073065147',
  },
  {
    X: '55.2823783447',
    Y: '18.2009310815',
    NAME_ENGLI: 'WILAYAT SHALIM WA JUZOR AL HALLANIYAT',
    population: '2129.8210714121',
  },
  {
    X: '56.3469265847',
    Y: '24.7134106372',
    NAME_ENGLI: 'WILAYAT SHINAS',
    population: '2077.20127228896',
  },
  {
    X: '56.5333010286',
    Y: '24.1886641904',
    NAME_ENGLI: 'WILAYAT SOHAR',
    population: '2583.63023223373',
  },
  {
    X: '59.4161352546',
    Y: '22.565928479',
    NAME_ENGLI: 'WILAYAT SUR',
    population: '2718.13597041009',
  },
  {
    X: '54.4436000996',
    Y: '17.2278040603',
    NAME_ENGLI: 'WILAYAT TAQAH',
    population: '2608.96284828211',
  },
  {
    X: '53.7050225552',
    Y: '18.3980318027',
    NAME_ENGLI: 'WILAYAT THUMRAYT',
    population: '2160.13543820606',
  },
  {
    X: '57.7961600593',
    Y: '23.4303242791',
    NAME_ENGLI: 'WILAYAT WADI AL MAAWIL',
    population: '1705.37026647902',
  },
  {
    X: '59.0172971221',
    Y: '22.6339987718',
    NAME_ENGLI: 'WILAYAT WADI BANI KHALID',
    population: '573.874068050286',
  },
  {
    X: '56.4019309593',
    Y: '23.7462342388',
    NAME_ENGLI: 'WILAYAT YANQUL',
    population: '1075.54881377562',
  },
]

export const WilayatGov = wilayatGovernatJson

export const featureToWTK = feature => {
  let ol3Geom = feature.getGeometry()
  if (ol3Geom instanceof Circle) {
    ol3Geom = fromCircle(ol3Geom)
  }
  const format = new OlFormatWkt()
  const wkt = format.writeGeometry(
    ol3Geom.clone().transform('EPSG:3857', 'EPSG:4326'),
  )
  const wktGeom = format.readGeometry(wkt)
  const wkt1 = format.writeGeometry(wktGeom.clone())
  return wkt1
}

export const getWelfareItems = (layer, filter) => {
  return wilayatItems(layer, filter)
}

const layerAttribute = {
  Population: 'population',
  'Eligibility Score': 'Eligibility Score',
  'Family Members': 'childeren Num',
  'Number of Wives': 'Wife Num',
  'Salaries Distribution': 'Salary',
}

export const isWelfareLayer = layer => {
  const welfareLayerLabels = Object.keys(layerAttribute)
  return welfareLayerLabels.indexOf(layer.lyrName) > -1
}

export const getLayerFilterRange = layer => {
  const layerLabel = layer.displayName
  let _range = {}
  switch (layerLabel) {
    case 'Population':
      _range = {
        min: 500,
        max: 5000,
        step: 100,
        defaultVal: [500, 5000],
      }
      break

    case 'Eligibility Score':
      _range = {
        min: 0,
        max: 100,
        step: 1,
        defaultVal: [17, 25],
      }
      break
    case 'Family Members':
      _range = {
        min: 0,
        max: 10,
        step: 1,
        defaultVal: [5, 7],
      }
      break
    case 'Number of Wives':
      _range = {
        min: 0,
        max: 4,
        step: 1,
        defaultVal: [0, 1],
      }
      break
    case 'Salaries Distribution':
      _range = {
        min: 0,
        max: 10000,
        step: 200,
        defaultVal: [5000, 6000],
      }
      break

    default:
      _range = {
        min: 0,
        max: 100,
        step: 1,
        defaultVal: [20, 50],
      }
      break
  }
  return {
    ..._range,
    marks: {
      [_range.min]: {
        style: {
          color: '#398cff',
        },
        label: (
          <strong style={{ display: 'block', width: '100px' }}>
            Min {_range.min}
          </strong>
        ),
      },
      [_range.max]: {
        style: {
          color: '#398cff',
        },
        label: (
          <strong style={{ display: 'block', width: '100px' }}>
            Max {_range.max}
          </strong>
        ),
      },
    },
  }
}

export const injectGroupNameToLayers = (layers, groups) => {
  const activeMapLayerIds = layers.reduce((activeMapLayerIdList, next) => {
    activeMapLayerIdList.push(next.id + '')
    return activeMapLayerIdList
  }, [])
  const groupLayerIdAndObjects = groups.reduce((layers, next) => {
    const laye = next.mapLayers.map(ml => ({
      id: ml.id + '',
      obj: next,
    }))
    layers = [...layers, ...laye]
    return layers
  }, [])

  const matchedLayerGroups =
    activeMapLayerIds.length > 0 &&
    groupLayerIdAndObjects.filter(tl => activeMapLayerIds.includes(tl.id))

  const layersWithGrpName = layers.map(layer => {
    let groupName = ''
    matchedLayerGroups.forEach((matchedGroup, i) => {
      if (layer.id + '' === matchedGroup.id) {
        const { obj = {} } = matchedGroup
        groupName = obj.name || ''
      }
    })
    return {
      ...layer,
      groupName,
    }
  })

  return layersWithGrpName
}

export const filterThemeLayers = (layers, theme) => {
  const tLIds = (theme.mapLayers || []).map(l => {
    return l.id + ''
  })
  const tGLIds = (theme.mapLayerGroups || []).reduce((prev, next) => {
    const grpLayIds = (next.mapLayers || []).map(l => {
      return l.id + ''
    })
    return [...prev, ...grpLayIds]
  }, [])
  const themeLayerIds = [...tLIds, ...tGLIds]
  const themeLayers = layers.filter(l => themeLayerIds.includes(l.id + ''))
  return themeLayers
}

export const hideSubTitleBar = type => {
  const nonTitleTypes = verificationModes()
  if (nonTitleTypes.includes(type)) {
    return true
  } else {
    return false
  }
}

export const verificationModes = () => {
  const modes = ['row', 'land_investment', 'nursery_permit']
  return modes
}

export const getCovidData = () => {
  const cc = [...covidData]
  let copy = cc.map(t => {
    return {
      ...t,
      id: t.id + 0.5,
      latitude: t.latitude + 0.05,
      longitude: t.longitude + 0.05,
    }
  })
  return [...covidData, ...copy]
}

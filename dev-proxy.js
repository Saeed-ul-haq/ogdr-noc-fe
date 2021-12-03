const serverHostTranslation = 'i18n'

// const serverHost = 'was'
// const serverEnv = 'test'
// const serverName = 'petrops'
// const ext = 'tpao.gov.tr'

const serverHost = 'was'
const serverEnv = 'dev'
const serverName = 'meeraspace'
const ext = 'com'

const proxyConfig = {
  '/static-data': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/studiomanager': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/geoserver': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/web': {
    target: 'http://mozilla.github.com/pdf.js/',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/trove/api': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/wfs/api/v1/layers': {
    target: 'https://map.target.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/audit': {
    target: 'https://was.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/api': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  // '/rest': {
  //   target: 'https://was.' + serverEnv + '.'+serverName+'.com:9095',
  //   ssl: {},
  //   secure: false,
  //   changeOrigin: true,
  // },
  '/rest': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/rest/translations': {
    target:
      'https://' +
      serverHostTranslation +
      '.' +
      serverEnv +
      '.' +
      serverName +
      '.' +
      ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/data': {
    target: 'http://ldr-trove.digitalenergycloud.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/service': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/catalogmanager': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/spatial': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/export': {
    target: 'https://was.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/spatial/api/v1/wfs/readjson': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/spatial/api/v1/crs': {
    target: 'http://ldr-map.digitalenergycloud.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/fm': {
    target: 'https://api.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/grpc-web': {
    target: 'https://api.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/app/api': {
    target:
      'https://' + serverHost + '.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/edge/api/v1/': {
    target: 'https://wasl.' + serverEnv + '.' + serverName + '.' + ext,
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
}

module.exports = proxyConfig

// const env = 'demo-aws'
const env = 'dev'
const domain = 'was'
const proxyConfig = {
  '/static-data': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/geoserver': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
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
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/wfs/api/v1/layers': {
    target: 'https://map.target.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/audit/api/v1': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com:8091',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/api': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/osrm/route/v1/driving': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/rest': {
    target: 'https://' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/service': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/spatial': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/spatial/api/v1/wfs/readjson': {
    target: 'https://' + domain + '.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/spatial/api/v1/crs': {
    target: 'http://ldr-map.digitalenergycloud.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/fm': {
    target: 'https://api.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  '/wf-be': {
    target: 'https://api.' + env + '.meeraspace.com',
    ssl: {},
    secure: false,
    changeOrigin: true,
  },
  // '/meerafs/rest/files/': {
  //   target: `https://api.' + env + '.meeraspace.com`,
  //   ssl: {},
  //   secure: false,
  //   changeOrigin: true,
  // },
}

module.exports = proxyConfig

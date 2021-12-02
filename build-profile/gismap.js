// const env = 'demo-aws'
const env = 'dev'
const domain = 'was'
module.exports = {
  BUILD_PROFILE: JSON.stringify('trove-demo'),
  PRODUCT_APP_URL_API: JSON.stringify('https://api.' + env + '.meeraspace.com'),
  OAUTH_CLIENT_SECRET: JSON.stringify('DzXZxyDObSpsnR7qLqQ4p1LEVoIiE49e'),
  OAUTH_CLIENT_ID: JSON.stringify('meera-dx'),
  OAUTH_HOST: JSON.stringify('https://sso.' + env + '.meeraspace.com'),
  OAUTH_CALLBACK_HOST: JSON.stringify(
    'https://' + domain + '.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_TROVE: JSON.stringify(
    'http://demo-trove-02.digitalenergycloud.com',
  ),
  PRODUCT_APP_URL_CADRE: JSON.stringify(
    'https://demo-cadre-01.digitalenergycloud.com',
  ),
  ENV_VAR_ME_TO: JSON.stringify('https://profile.' + env + '.meeraspace.com'),
  PRODUCT_APP_URL_WORKSPACE: JSON.stringify(
    'https://' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_PROFILE: JSON.stringify(
    'https://profile.' + env + '.meeraspace.com',
  ),
  PRODUCT_URL_CONFIGURATOR: JSON.stringify(
    'https://configurator.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_ORGANIZATION:
    '"https://organization.' + env + '.meeraspace.com"',

  PRODUCT_APP_URL_REACH: '"https://demo-reach-01.digitalenergycloud.com"',
  PRODUCT_APP_URL_AMC: '"https://amc.dev.meeraspace.com"',
  PRODUCT_APP_URL_CRM: '"https://manager.dev.meeraspace.com"',
  MEETING_URL: '"https://meeting.digitalenergycloud.com"',
  PRODUCT_APP_URL_PLANNER: JSON.stringify(
    'https://planner.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_MAP: '"https://demo-map-01.digitalenergycloud.com"',
  PRODUCT_APP_URL_HCM: '"https://hcm.dev.meeraspace.com/"',
  PRODUCT_APP_URL_PULSE: '"https://demo-ams-01.digitalenergycloud.com"',
  PRODUCT_APP_URL_LOAD: JSON.stringify(
    'https://wasl.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_STUDIO: JSON.stringify(
    'https://map-config.energy.fluxble.com',
  ),
  PRODUCT_APP_BRAND_LOGO: JSON.stringify(''),
  PRODUCT_APP_URL_LANG: '"https://i18n.' + env + '.meeraspace.com"',
  DB_CONFIG_DEFAULT_TYPE: JSON.stringify('PostGIS'),
  DB_CONFIG_DEFAULT_SERVER: JSON.stringify(
    'energy-fluxble.cs8kekwx3z8y.eu-west-1.rds.amazonaws.com',
  ),
  DB_CONFIG_DEFAULT_PORT: JSON.stringify('5432'),
  DB_CONFIG_DEFAULT_DATABASE: JSON.stringify('global_data'),
  DB_CONFIG_DEFAULT_USER: JSON.stringify('target'),
  DB_CONFIG_DEFAULT_PASSWORD: JSON.stringify('VKBjeuAfBy7HAZ92jrng6cdH'),
  ELASTIC_CONFIG_DEFAULT_SERVER: JSON.stringify(
    'search-global-elasticsearch-a5ooih6m6bkb77swcio4fgagmi.eu-west-1.es.amazonaws.com',
  ),
  ELASTIC_CONFIG_DEFAULT_PORT: JSON.stringify('-1'),
  ELASTIC_CONFIG_DEFAULT_SCHEME: JSON.stringify('https'),
  ELASTIC_CONFIG_DEFAULT_USER: JSON.stringify('target'),
  ELASTIC_CONFIG_DEFAULT_PASSWORD: JSON.stringify('Target@Tes9ting'),
  PRODUCT_APP_URL_PDO: '"https://pdo.dev.meeraspace.com"',

  // New For Primary Bar
  PRODUCT_APP_URL_RESERVE: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),

  PRODUCT_APP_URL_ECHONOMICS: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),

  PRODUCT_APP_URL_PRODUCTION: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),

  PRODUCT_APP_URL_REGULATION: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),

  PRODUCT_APP_URL_COSTRECOVERY: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),

  PRODUCT_APP_URL_PLANNING: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_AGREEMENT: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_INVESTMENT: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_PROJECTS: JSON.stringify(
    'https://api.' + env + '.meeraspace.com',
  ),

  PRODUCT_APP_URL_FLUXBLE_MEETING: JSON.stringify(
    'https://venue.' + env + '.meeraspace.com',
  ),

  PRODUCT_APP_URL_CONSUME: JSON.stringify(
    'https://' + domain + '.' + env + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_FILEMANAGER_DOWNLOAD: JSON.stringify(
    'https://api.' + env + '.meeraspace.com/fm/download',
  ),
  MAXIMUM_ALLOWED_SELECTION_PER_CATALOG: JSON.stringify('5000'),
  PRODUCT_APP_URL_FM: '"/fm"',
  PRODUCT_APP_URL_FOLIO: '"https://demo-folio-01.digitalenergycloud.com"',
  PRODUCT_APP_URL_ROW: '""',
  PRODUCT_APP_URL_BI: '"https://bi.dev.meeraspace.com"',
  PRODUCT_APP_URL_CONFIGURATOR: '"https://configurator.dev.meeraspace.com"',
  PRODUCT_APP_URL_OKR: '"https://okr.dev.meeraspace.com"',
  PRODUCT_APP_URL_CSR: '"https://csr.dev.meeraspace.com/"',
  PRODUCT_APP_URL_FM_NO_PROXY: '"https://demo-api.digitalenergycloud.com"', // PRODUCT_APP_URL_FM_NO_PROXY should be equal to PRODUCT_APP_URL_FM for all deployments (used to bypass dev proxy when running locally)
  MEERA_APP_BASE_ENV_URL: 'https://dev.meeraspace.com',
  PRODUCT_APP_URL_PEOPLEANALYTICS:
    '"https://peopleanalytics.dev.meeraspace.com"',
  PRODUCT_APP_URL_SEISMIC_SERVICE: JSON.stringify(
    'https://seismic-manager.' + domain + '.meeraspace.com',
  ),
  PRODUCT_APP_URL_TOGGLE_STUDIO: JSON.stringify('true'),
  PRODUCT_APP_ALLOWED_EMAIL_DOMAINS: JSON.stringify('*'),
  PRODUCT_APP_CONSUME_VERSION: JSON.stringify('sandbox'),
  PRODUCT_APP_LOAD_VERSION: JSON.stringify('sandbox'),
  PRODUCT_APP_ALLOWED_FEATURES: JSON.stringify(
    'single-cud,workflow,cart,publish-catalog,audit-trail',
  ),
  STUDIO_ALLOWED_CUD_FEATURES: JSON.stringify('update,delete'),
  PRODUCT_APP_URL_LAND_INVESTMENT_DASHBOARD: '"https://bi.dev.meeraspace.com"',
  PRODUCT_APP_URL_NURSERY_PERMIT_DASHBOARD: '"https://bi.dev.meeraspace.com"',
  PRODUCT_URL_WORKSPACE: null,
  PRODUCT_APP_URL_REGION: JSON.stringify(
    'https://gregion.' + env + '.meeraspace.com',
  ),
  FLAG_TOGGLE_COVID_CHARTS: JSON.stringify('false'),
  TOKEN_DOMAIN: 'https://' + domain + '.' + env + '.meeraspace.com',
}

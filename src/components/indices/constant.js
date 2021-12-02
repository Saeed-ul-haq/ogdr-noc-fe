export const defaultDbConfig = {
  dbType: DB_CONFIG_DEFAULT_TYPE,
  server: DB_CONFIG_DEFAULT_SERVER,
  port: DB_CONFIG_DEFAULT_PORT,
  database: DB_CONFIG_DEFAULT_DATABASE,
  user: DB_CONFIG_DEFAULT_USER,
  password: DB_CONFIG_DEFAULT_PASSWORD,
}
export const defaultElasticConfig = {
  server: ELASTIC_CONFIG_DEFAULT_SERVER,
  port: ELASTIC_CONFIG_DEFAULT_PORT,
  scheme: ELASTIC_CONFIG_DEFAULT_SCHEME,
  ...(ELASTIC_CONFIG_DEFAULT_USER === '*'
    ? {}
    : {
      user: ELASTIC_CONFIG_DEFAULT_USER,
      password: ELASTIC_CONFIG_DEFAULT_PASSWORD,
    }),
}

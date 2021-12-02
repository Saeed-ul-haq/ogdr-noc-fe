module.exports = function (api) {
  api.cache(true)

  const isProd = process.env.NODE_ENV === 'production'

  const presets = [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        loose: true,
        targets: {
          browsers: ['last 2 versions', 'ie >= 11', 'safari >= 7'],
        },
        useBuiltIns: 'entry',
      },
    ],
  ]
  const plugins = [
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
      },
    ],
    'react-hot-loader/babel',
  ]

  if (isProd) {
    plugins.push(
      [
        'module:fast-async',
        {
          compiler: {
            promises: true,
            generators: false,
          },
          runtimePattern: null,
          useRuntimeModule: false,
        },
      ],
      'transform-react-remove-prop-types',
    )
  } else {
    plugins.push('@babel/plugin-syntax-object-rest-spread')
  }

  return {
    presets,
    plugins,
  }
}

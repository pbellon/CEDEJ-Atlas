const merge = require('lodash.merge');

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    basename: process.env.PUBLIC_PATH,
    isBrowser: typeof window !== 'undefined',
    apiUrl: 'https://cedej-atlas.surge.sh',
  },
  test: {},
  development: {
    apiUrl: 'http://localhost:3000',
  },
  production: {
    apiUrl: 'http://cedej-atlas.surge.sh',
  },
};

module.exports = merge(config.all, config[config.all.env]);

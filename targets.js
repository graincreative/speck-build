module.exports = {
  development: {
    name: 'development',
    logging: true,
    revisionInTitle: false,
    optimise: false,
    sourcemaps: true
  },
  staging: {
    name: 'staging',
    logging: false,
    revisionInTitle: true,
    optimise: true,
    sourcemaps: false
  },
  production: {
    name: 'production',
    logging: false,
    revisionInTitle: false,
    optimise: true,
    sourcemaps: false
  }
};

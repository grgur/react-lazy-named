// @babel/preset-env settings for all environments
const ENV_DEFAULT = {
  // useBuiltIns: 'usage',
  // corejs: 3,
};

// @babel/preset-env settins for testing. They add to ENV_DEFAULT
const ENV_TEST = {
  ...ENV_DEFAULT,
  targets: {
    firefox: '66',
  },
};

module.exports = api => {
  return {
    presets: [
      ['@babel/preset-env', api.env('test') ? ENV_TEST : ENV_DEFAULT],
      '@babel/preset-react',
    ],
  };
};

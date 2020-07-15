const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const { uglify } = require('rollup-plugin-uglify');
const typescript = require('rollup-plugin-typescript2');
const path = require('path');
const pkg = require('./package.json');

function isBareModuleId(id) {
  return !id.startsWith('.') && !id.includes(path.join(process.cwd(), 'modules'));
}

const pkgName = pkg.name.replace('@modus/', '');

const cjs = [
  {
    input: 'src/index.ts',
    output: {
      file: `dist/cjs/${pkgName}.js`,
      sourcemap: true,
      format: 'cjs',
      esModule: false,
    },
    external: isBareModuleId,
    plugins: [
      typescript({
        rollupCommonJSResolveHack: false,
        clean: true,
      }),
      babel({ exclude: /node_modules/, sourceMaps: true }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.BUILD_FORMAT': JSON.stringify('cjs'),
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: { file: `dist/cjs/${pkgName}.min.js`, sourcemap: true, format: 'cjs' },
    external: isBareModuleId,
    plugins: [
      typescript({
        rollupCommonJSResolveHack: false,
        clean: true,
      }),
      babel({ exclude: /node_modules/, sourceMaps: true }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.BUILD_FORMAT': JSON.stringify('cjs'),
      }),
      uglify(),
    ],
  },
];

const esm = [
  {
    input: 'src/index.ts',
    output: { file: `dist/esm/${pkgName}.js`, sourcemap: true, format: 'esm' },
    external: isBareModuleId,
    plugins: [
      typescript({
        clean: true,
      }),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
      replace({ 'process.env.BUILD_FORMAT': JSON.stringify('esm') }),
      sizeSnapshot(),
    ],
  },
];

const globals = { react: 'React' };

const umd = [
  {
    input: 'src/index.ts',
    output: {
      file: `dist/umd/${pkgName}.js`,
      sourcemap: true,
      sourcemapPathTransform: relativePath =>
        relativePath.replace(/^.*?\/node_modules/, '../../node_modules'),
      format: 'umd',
      name: 'ReactLazyNamed',
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      typescript({
        clean: true,
      }),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          'node_modules/react-is/index.js': ['isValidElementType'],
        },
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.env.BUILD_FORMAT': JSON.stringify('umd'),
      }),
      sizeSnapshot(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: `dist/umd/${pkgName}.min.js`,
      sourcemap: true,
      sourcemapPathTransform: relativePath =>
        relativePath.replace(/^.*?\/node_modules/, '../../node_modules'),
      format: 'umd',
      name: 'ReactLazyNamed',
      globals,
    },
    external: Object.keys(globals),
    plugins: [
      typescript({
        clean: true,
      }),
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
      nodeResolve(),
      commonjs({
        include: /node_modules/,
        namedExports: {
          'node_modules/react-is/index.js': ['isValidElementType'],
        },
      }),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.BUILD_FORMAT': JSON.stringify('umd'),
      }),
      sizeSnapshot(),
      uglify(),
    ],
  },
];

let config;
switch (process.env.BUILD_ENV) {
  case 'cjs':
    config = cjs;
    break;
  case 'esm':
    config = esm;
    break;
  case 'umd':
    config = umd;
    break;
  default:
    config = cjs.concat(esm).concat(umd);
}

module.exports = config;

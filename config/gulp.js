const build = './public';
const privatePath = './private';

require('dotenv').config();

export const sassCfg = {
  src: 'scss/*.scss',
  dest: `${build}/css`,
  maps: `${privatePath}/css`,
  banner: ` /**
  ** redis manager.
  ** @author:  - vHades
  ** @version: 1.0.0
  **/
`,
};

export const reactCfg = {
  knownOptions: {
    string: 'file',
    default: { file: '*' },
    alias: { file: 'f' },
  },
  dest: `${build}/js`,
  maps: `${privatePath}/js`,
  src: 'src/render/',
  expose: {
    jquery: 'jQuery',
    'react-dom': 'ReactDOM',
    react: 'React',
    'prop-types': 'PropTypes',
    './pageControl': 'PageControl',
  },
  exposePageControl: {},
};

const { PORT = 5200 } = process.env;

export const browserSyncCfg = {
  proxy: `http://localhost:${PORT}`,
};

export default {
  reactCfg,
  sassCfg,
  browserSyncCfg,
};

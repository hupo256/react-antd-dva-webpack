// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
// import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      // history: 'hash',
      targets: {
        ie: 11,
      },
      locale: {
        enable: false, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: false, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
      },
      ...(!process.env.TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime'],
            },
            hardSource: true,
          }
        : {}),
    },
  ],
];

// judge add ga
if (process.env.APP_TYPE === 'site') {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  // add for transfer to umi
  plugins,
  targets: {
    ie: 11,
  },
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  proxy: {
    '/gw': {
      target: "http://hcp-dev.leapstack.cn/",
      changeOrigin: true,
      pathRewrite: { "^/gw": "/gw" }
    },
    '/drag': {
      // target: 'http://rc-test.leapstack.cn/',
      target: 'http://rc-dev.leapstack.cn/',
      changeOrigin: true,
      pathRewrite: { '^/drag': '/drag' },
    },
    '/cs': {
      target: 'http://rc-dev.leapstack.cn/',
      changeOrigin: true,
      pathRewrite: { '^/cs': '/cs' },
    },
    '/rc': {
      target: 'http://rc-dev.leapstack.cn/',
      changeOrigin: true,
      pathRewrite: { '^/rc': '/rc' },
    },
    '/util': {
      target: 'http://hcp-dev.leapstack.cn:10301',
      changeOrigin: true,
      pathRewrite: { '^/util': '/util' },
    },
    '/druid': {
      target: 'http://120.132.11.133:8082/druid/v2',
      changeOrigin: true,
      pathRewrite: { '^/druid': '/' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: false,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = antdProPath
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  // chainWebpack: webpackPlugin,
};

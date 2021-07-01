import { defineConfig } from 'umi';
import pageRoutes from './router.config';
import defaultSettings from '../src/defaultSettings';
import packageJson from '../package.json';
// ref: https://umijs.org/config/
export default defineConfig({
    title: 'acc-web',

    dva: {},
    locale: {
        antd: true, // default false
        default: 'zh-CN', // default zh-CN
        title: true
    },
    request: {},
    targets: {
        ie: 11,
    },
    //路由
    routes: pageRoutes,
    define: {
        APP_VERSION: packageJson.version,
    },
    hash: true,
    antd: {
        compact: true, // 开启紧凑主题
    },
    terserOptions: {
        compress: {
            warnings: false,
            drop_console: true, //console
            pure_funcs: ['console.log'], //移除console
        },
    },
    theme: {

        'primary-color': defaultSettings.primaryColor,
    }
});

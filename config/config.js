import pageRoutes from './router.config';
import defaultSettings from '../src/defaultSettings';
import os from "os";
// ref: https://umijs.org/config/
export default {
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            // dva: {
            //   immer:true
            // },
            dva:{
                hmr:true
            },
            dynamicImport: true,
            title: 'acc-web',
            // dll: {
            //     include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch', 'antd/es']
            // },
            locale: {
                enable: true, // default false
                default: 'zh-CN', // default zh-CN
                baseNavigator: true
            },
            targets:['ie9'],
            ...(!process.env.TEST && os.platform() === 'darwin'
                ? {
                    dll: {
                        include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
                        exclude: ['@babel/runtime'],
                    }
                }
                : {}),
        }],
    ],
    //路由
    routes: pageRoutes,
    define: {
        "APP_TYPE": process.env.APP_TYPE || ''
    },
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    theme: {

        'primary-color': defaultSettings.primaryColor,
    }
}

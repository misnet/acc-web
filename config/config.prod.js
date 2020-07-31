import pageRoutes from './router.config';
import defaultSettings from '../src/defaultSettings';
import os from "os";
// ref: https://umijs.org/config/
export default {
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: {
                //immer:true
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
    hash:true,
    //路由
    routes: pageRoutes,
    define: {
        "APP_TYPE": process.env.APP_TYPE || '',
        "process.env.API_GATEWAY":'https://acc.api.depoga.com/v3/gateway',
        "process.env.API_KEY": 1000,
        "process.env.TITLE":'KUGA ACC',
        "process.env.API_SECRET":'43c84d3848059992ab39d41378a360eb'
    },
    lessLoaderOptions: {
        javascriptEnabled: true,
    },
    theme: {

        'primary-color': defaultSettings.primaryColor,
    }
}

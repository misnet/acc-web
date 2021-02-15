import { defineConfig } from 'umi';
import pageRoutes from './router.config';
import defaultSettings from '../src/defaultSettings';
import os from "os";
// ref: https://umijs.org/config/
export default defineConfig({
    define: {
        "process.env.API_GATEWAY": 'http://acc.api.kuga.wang/v3/gateway',
        "process.env.API_KEY": 1000,
        "process.env.TITLE": 'ACC.DEV',
        "process.env.API_SECRET": '43c84d3848059992ab39d41378a360eb'
    }
});

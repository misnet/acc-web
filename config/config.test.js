// ref: https://umijs.org/config/

import { defineConfig } from 'umi';
export default defineConfig({
    define: {
        "APP_TYPE": process.env.APP_TYPE || '',
        "process.env.API_GATEWAY": 'https://acc.api.depoga.net/v3/gateway',
        "process.env.API_KEY": 1000,
        "process.env.TITLE": 'ACC.TEST',
        "process.env.API_SECRET": '04ebe033d4efb4c9e90d543d5167699b'
    }
});

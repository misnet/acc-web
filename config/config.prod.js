
import { defineConfig } from 'umi';
export default defineConfig({
    define: {
        "process.env.API_GATEWAY": 'https://acc.api.depoga.com/v3/gateway',
        "process.env.API_KEY": 1000,
        "process.env.TITLE": 'KUGA ACC',
        "process.env.API_SECRET": '43c84d3848059992ab39d41378a360eb'
    }
});

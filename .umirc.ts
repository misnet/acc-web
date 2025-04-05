import access from '@/access';
import { defineConfig } from '@umijs/max';
import { THEME_SOLUTIOIN } from './src/constants/index';

export default defineConfig({
    define: {
        'process.env.UMI_ENV': process.env.UMI_ENV,
        'process.env.API_HOST': process.env.API_HOST,
    },
    access: {},
    model: {},
    initialState: {},
    jsMinifier: 'esbuild',
    jsMinifierOptions: {
        minifyWhitespace: true,
        minifyIdentifiers: true,
        minifySyntax: true,
    },
    request: {
        dataField: '',
    },
    cssLoaderModules: {
        exportLocalsConvention: 'camelCase',
    },
    layout: {
        title: 'XPod',
        navTheme: 'dark',
        primaryColor: '#9b4dca',
        pwa: false,
        headerRender: true,
    },
    antd: {
        theme: THEME_SOLUTIOIN,
    },
    favicons: [
        // 完整地址
        '/img/favicon.ico',
        // 此时将指向 `/favicon.png` ，确保你的项目含有 `public/favicon.png`
        '/img/logo3.png'
    ],


    npmClient: 'yarn',
});

import access from '@/access';
import { defineConfig } from '@umijs/max';
import { THEME_SOLUTIOIN } from './src/constants/index';

import { DEFAULT_USERINFO, SYS_CONFIG } from './src/constants';
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
    routes: [
        {
            path: '/login',
            component: './login',
            hideInMenu: true,
            hideInBreadcrumb: true,
            headerRender: false,
            footerRender: false,
            menuRender: false,
            menuHeaderRender: false,
        },
        {
            name: '首页',
            path: '/',
            component: './home',
            //access: 'canView',
            icon: 'HomeOutlined',
        },
        {
            name: '用户管理',
            path: '/users',
            component: './users/index',
            icon: 'UserOutlined'
        },
        {
            name: '角色管理',
            path: '/roles',
            hideInMenu: !SYS_CONFIG.ssa,
            component: './roles/index',
            icon: 'UsergroupAddOutlined'
        },
        {
            name: '分配菜单',
            hideInMenu: true,
            path: '/roles/assign-menus',
            component: './roles/assign-menus',
        },
        {
            name: '权限资源列表',
            hideInMenu: true,
            path: '/roles/resources',
            component: './roles/resources',
        },
        {
            name: '子资源列表',
            hideInMenu: true,
            path: '/roles/subresources',
            component: './roles/subresources',
        },
        {
            name: '资源分配',
            hideInMenu: true,
            path: '/roles/assign-res',
            component: './roles/assign-res',
        },
        {
            name: '菜单管理',
            path: '/menus',
            icon: 'MenuOutlined',
            hideInMenu: !SYS_CONFIG.ssa,
            component: './menus/index',
        },
        {
            name: '配置参数',
            hideInMenu: !SYS_CONFIG.ssa,
            path: '/configuration',
            icon: 'SettingOutlined',
            component: './configuration/index',
        },
        {
            name: 'API日志',
            path: '/apilogs',
            component: './apilogs/index',
            icon: 'BarsOutlined'
        },
        {
            name: '系统检测',
            path: '/system/test',
            component: './system/test',
            icon: 'ToolOutlined'
        },
        {
            name: '使用说明',
            path: 'https://docs.podorn.com/?s=acc',
            icon: 'QuestionCircleOutlined'

        },
        {
            path: '/exceptions/msg',
            component: "./exceptions/msg",
        },
        {
            path: '/*',
            component: './404',
        },
    ],
});

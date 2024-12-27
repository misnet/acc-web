// 运行时配置
import RightContent from './components/header/right-content';
import Footer from './components/footer/index';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { DEFAULT_USERINFO, SYS_CONFIG } from './constants';
import { notification } from 'antd';
import { getCacheData } from './utils/utils';
import { history } from '@umijs/max';

import Package from '../package.json';
import { BarsOutlined, HomeOutlined, MenuOutlined, QuestionCircleOutlined, SettingOutlined, ToolOutlined, UsergroupAddOutlined, UserOutlined } from '@ant-design/icons';
const loginPath = '/login';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export function getInitialState(): Promise<{ name: string }> {
    let userInfo = getCacheData('userInfo', { type: 'local' });
    if (!userInfo) {
        userInfo = DEFAULT_USERINFO;
    }
    return userInfo;
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
    return {
        title: `${Package.alias} V${Package.version}`,
        logo: '/static/logo3.svg',
        menu: {
            locale: false,
        },
        // rightRender: () => {
        //     return <RightContent fullname={initialState.fullname} />
        // },
        access: {},
        siderWidth: 150,
        layout: 'mix',
        fixSiderbar: true,
        fixedHeader: true,
        headerRender: true,
        rightContentRender: (props) => {
            return <RightContent fullname={initialState.fullname} />
        },
        footerRender: () => <Footer />,
        onPageChange: () => {
            const { location } = history;
            // 如果没有登录，重定向到 login
            if ((!initialState?.uid || initialState.uid === 0) && location.pathname !== loginPath) {
                history.push(loginPath);
            }
        },
        route: {
            path: "/",
            redirect: '/home',
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
                    path: '/home',
                    component: './home',
                    access: 'canView',
                    icon: <HomeOutlined />,
                },
                {
                    name: '用户管理',
                    path: '/users',
                    component: './users/index',
                    icon: <UserOutlined />
                },
                {
                    name: '角色管理',
                    path: '/roles',
                    hideInMenu: !SYS_CONFIG.ssa,
                    component: './roles/index',
                    icon: <UsergroupAddOutlined />
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
                    icon: <MenuOutlined />,
                    hideInMenu: !SYS_CONFIG.ssa,
                    component: './menus/index',
                },
                {
                    name: '配置参数',
                    hideInMenu: !SYS_CONFIG.ssa,
                    path: '/configuration',
                    icon: <SettingOutlined />,
                    component: './configuration/index',
                },
                {
                    name: 'API日志',
                    path: '/apilogs',
                    component: './apilogs/index',
                    icon: <BarsOutlined />
                },
                {
                    name: '系统检测',
                    path: '/system/test',
                    component: './system/test',
                    icon: <ToolOutlined />
                },
                {
                    name: '使用说明',
                    path: 'https://help.printful.ink/tags/acc',
                    icon: <QuestionCircleOutlined />

                },
                {
                    path: '/exceptions/msg',
                    component: "./exceptions/msg",
                },
                {
                    path: '/*',
                    components: './404',
                },
            ],
        },
    };
};

export const request: RequestConfig = {
    timeout: 10000,
    errorConfig: {
        errorHandler: (error) => {
            console.log('error--', error);
            //判断是否网络故障
            if (error.name === 'AxiosError') {
                notification.error({
                    message: '提示',
                    description: '网络故障，请稍后再试',
                    placement: 'topRight',
                });
            }
        },
    },
    // errorConfig: {
    //   errorHandler(){
    //   },
    //   errorThrower(){
    //   }
    // },
    requestInterceptors: [
        (url, options) => {
            const newOptions = Object.assign({}, options);
            if (!newOptions.headers) {
                newOptions.headers = {};
            }
            newOptions.headers['Access-Token-Type'] = 'JWT';
            newOptions.headers['Appkey'] = SYS_CONFIG.appKey;
            newOptions.headers['Locale'] = SYS_CONFIG.lang;
            let userInfo = getCacheData('userInfo', { type: 'local' });

            if (userInfo && userInfo.accessToken) {
                newOptions.headers['Authorization'] = 'Bearer ' + userInfo.accessToken;
            }
            return { url, options: newOptions };
        },
    ],
    responseInterceptors: [
        (response) => {
            if (Object.prototype.toString.call(response.data) === '[object Blob]') {
                return response;
            }
            if (!response.data.success) {
                //当token失效时，清除缓存,跳转到登录页
                if (response.data.code === 99004) {
                    // localStorage.clear();
                    sessionStorage.clear();
                    history.push('/login');
                }
                // const msg = response.data.message ? response.data.message : '发生意外';
                // notification.error({
                //     message: '提示',
                //     description: msg,
                //     placement: 'topRight',
                // });
            }
            //console.log('response---',response.data);
            return response;
        },
    ],
};

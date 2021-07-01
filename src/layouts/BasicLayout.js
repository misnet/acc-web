import React, { Suspense, useEffect } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Media from 'react-media';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import SiderMenu from '@/components/SiderMenu';

import { useDispatch, useLocation, useSelector } from 'umi';
import { hasPermission } from '../utils/auth';
import config from '../config';
// lazy load SettingDrawer
//import PageLoading from '@/components/PageLoading';
//const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));
const { Content } = Layout;

const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = item => {
    if (item && item.children) {
        if (item.children[0] && item.children[0].path) {
            redirectData.push({
                from: `${item.path}`,
                to: `${item.children[0].path}`,
            });
            item.children.forEach(children => {
                getRedirect(children);
            });
        }
    }
};
const basicLayout = props => {
    const dispatch = useDispatch();
    const collapsed = useSelector(state => state.global.collapsed);
    //const layout = useSelector(state => state.setting.layout);
    const setting = useSelector(state => state.setting);
    const menuData = useSelector(state => state.menu.menuData);

    const location = useLocation();
    /**
     * 获取面包屑映射
     * @param {Object} menuData 菜单配置
     */
    const getBreadcrumbNameMap = () => {
        const routerMap = {};
        const flattenMenuData = data => {
            data.forEach(menuItem => {
                if (menuItem.children) {
                    flattenMenuData(menuItem.children);
                }
                // Reduce memory usage
                routerMap[menuItem.path] = menuItem;
            });
        };
        flattenMenuData(menuData);
        return routerMap;
    }

    const breadcrumbNameMap = getBreadcrumbNameMap();
    const matchParamsPath = pathname => {
        const pathKey = Object.keys(breadcrumbNameMap).find(key =>
            pathToRegexp(key).test(pathname)
        );
        return breadcrumbNameMap[pathKey];
    };

    const getPageTitle = pathname => {
        const currRouterData = matchParamsPath(pathname);
        if (!currRouterData) {
            return config.SYS_NAME;
        }
        //TODO:取消页面title的翻译
        // const pageName = formatMessage({
        //     id: currRouterData.locale || currRouterData.name,
        //     defaultMessage: currRouterData.name,
        // });
        return `${currRouterData.name} - ${config.SYS_NAME}`;
    };

    const getLayoutStyle = () => {
        const { fixSiderbar, layout } = setting;

        if (fixSiderbar && layout !== 'topmenu' && !props.isMobile) {
            return {
                paddingLeft: collapsed ? '80px' : '256px',
            };
        }
        return null;
    };

    const getContentStyle = () => {
        const { fixedHeader } = setting;
        return {
            margin: '24px 24px 0',
            paddingTop: fixedHeader ? 64 : 0,
            zIndex: 1
        };
    };

    const handleMenuCollapse = collapsed => {
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };

    useEffect(() => {
        dispatch({
            type: 'user/fetchCurrent',
        });
        dispatch({
            type: 'menu/getMenuData'
        })
    }, []);
    useEffect(() => {
        if (props.isMobile && !props.collapsed) {
            handleMenuCollapse(false);
        }
    }, [props.isMobile, props.collapsed]);

    const getContext = () => {
        return {
            location,
            breadcrumbNameMap: breadcrumbNameMap,
        };
    }

    const {
        children,
        isMobile,
    } = props;
    const isTop = setting.layout === 'topmenu';
    const routerConfig = matchParamsPath(location.pathname);
    console.log('getLayoutStyle', getLayoutStyle());
    const layout = (
        <Layout>
            {isTop && !isMobile ? null : (
                <SiderMenu
                    logo={logo}
                    theme={setting.navTheme}
                    onCollapse={handleMenuCollapse}
                    menuData={menuData}
                    isMobile={isMobile}
                    collapsed={collapsed}
                    fixSiderbar={setting.fixSiderbar}
                    primaryColor={setting.primaryColor}
                    contentWidth={setting.contentWidth}
                    layout={setting.layout}
                    fixedHeader={setting.fixedHeader}
                    autoHideHeader={setting.autoHideHeader}
                    {...props}
                />
            )}
            <Layout
                style={{
                    ...getLayoutStyle(),
                    minHeight: '100vh',
                }}
            >
                <Header
                    menuData={menuData}
                    handleMenuCollapse={handleMenuCollapse}
                    logo={logo}
                    isMobile={isMobile}
                    {...props}
                />
                <Content style={getContentStyle()}>
                    <Authorized
                        // authority={routerConfig && routerConfig.authority}
                        authority={() => hasPermission('root')}
                        noMatch={<Exception403 />}
                    >

                        {children}
                    </Authorized>
                </Content>
                <Footer />
            </Layout>
        </Layout>
    );
    return (

        <DocumentTitle title={getPageTitle(location.pathname)}>
            <ContainerQuery query={query}>
                {params => (
                    <Context.Provider value={getContext()}>
                        <div className={classNames(params)}>{layout}</div>
                    </Context.Provider>
                )}
            </ContainerQuery>
        </DocumentTitle>

    );
}
export default basicLayout;
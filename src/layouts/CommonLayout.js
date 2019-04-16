import React, { Suspense } from 'react';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import classNames from 'classnames';
import { ContainerQuery } from 'react-container-query';
import { connect } from 'dva';
const { Content } = Layout;
import Footer from './Footer';
import Header from './Header';
import SiderMenu from '@/components/SiderMenu';
import logo from '../assets/logo.svg';

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
    },
};
class CommonLayout extends React.PureComponent{
    constructor(props){
        super(props);
    }
    handleMenuCollapse = collapsed => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/changeLayoutCollapsed',
            payload: collapsed,
        });
    };
    render(){
        const layout =(
            <Layout>
                <SiderMenu
                    logo={logo}
                    onCollapse={this.handleMenuCollapse}
                    menuData={[]}
                    {...this.props}
                />
                <Layout>
                    <Header/>
                    <Content>
                        {this.props.children}
                    </Content>
                    <Footer/>
                </Layout>
            </Layout>
        );
        return(
              <DocumentTitle title={"Test"}>
                  <ContainerQuery query={query}>
                      {params => <div className={classNames(params)}>{layout}</div>}
                  </ContainerQuery>
              </DocumentTitle>
        );
    }
}

export default connect(({ user, global, loading }) => ({
    currentUser: user.currentUser,
    collapsed: global.collapsed,
    fetchingNotices: loading.effects['global/fetchNotices'],
    notices: global.notices,
}))(CommonLayout);
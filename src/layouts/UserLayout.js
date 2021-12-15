import React, { Fragment } from 'react';
import { Link } from 'umi';
import DocumentTitle from 'react-document-title';
import { CopyrightOutlined } from '@ant-design/icons';
import { Row, Col } from 'antd';
import classNames from 'classnames';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import config from '../config';
import { getRandNumber } from '../utils/utils';
const links = [];

const copyright = (
  <Fragment>
    Copyright <CopyrightOutlined /> 2018 Donny 出品
  </Fragment>
);
class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = config.SYS_NAME;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - Kuga Demo2`;
    }
    return title;
  }
  getBackgroundImageIndex() {
    let bgIndex = window.sessionStorage.getItem('bgindex');
    if (!bgIndex) {
      bgIndex = getRandNumber(1, 7);
      window.sessionStorage.setItem('bgindex', bgIndex);
    }
    return bgIndex;
  }
  render() {
    const { routerData, match } = this.props;
    const bgIndex = this.getBackgroundImageIndex();
    return (
      <DocumentTitle title={config.SYS_NAME}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={classNames(styles.loginColumn, styles.loginForm)}>
              {this.props.children}
              <GlobalFooter className={styles.footer} links={links} copyright={copyright} />
            </div>
            <div className={classNames(styles.loginColumn, styles.loginBg, styles['bg' + bgIndex])}></div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;

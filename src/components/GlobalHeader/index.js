import React, { PureComponent } from 'react';
import { Link } from 'umi';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo } = this.props;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        {!collapsed ? <MenuFoldOutlined className={styles.trigger} onClick={this.toggle} /> : <MenuUnfoldOutlined className={styles.trigger} onClick={this.toggle} />}
        <RightContent {...this.props} />
      </div>
    );
  }
}

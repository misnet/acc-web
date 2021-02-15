import React, { Fragment } from 'react';
import { CopyrightOutlined, GithubOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
          {
              key: 'Donny 首页',
              title: 'Donny 首页',
              href: 'http://www.tapy.org',
              blankTarget: true,
          },
          {
              key: 'github',
              title: <GithubOutlined />,
              href: 'https://github.com/misnet',
              blankTarget: true,
          },
      ]}
      copyright={
        <Fragment>
            Copyright <CopyrightOutlined /> 2018 Kuga.wang
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;

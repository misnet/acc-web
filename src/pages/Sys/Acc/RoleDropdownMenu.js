import React from 'react';
import PropTypes from 'prop-types';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Button, Menu } from 'antd';

export default ({ onMenuClick, menuOptions = [], buttonStyle, dropdownProps }) => {
    const menu = menuOptions.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>);
    return (
        <Dropdown overlay={<Menu onClick={onMenuClick}>{menu}</Menu>} {...dropdownProps}>
            <a className="ant-dropdown-link">
                更多 <DownOutlined />
            </a>
        </Dropdown>
    );
};

import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Button, Icon, Menu } from 'antd';

const RoleDropdownMenu = ({ onMenuClick, menuOptions = [], buttonStyle, dropdownProps }) => {
    const menu = menuOptions.map(item => <Menu.Item key={item.key}>{item.name}</Menu.Item>);
    return (
        <Dropdown overlay={<Menu onClick={onMenuClick}>{menu}</Menu>} {...dropdownProps}>
            <a className="ant-dropdown-link">
                更多 <Icon type="down" />
            </a>
        </Dropdown>
    );
};

RoleDropdownMenu.propTypes = {
    onMenuClick: PropTypes.func,
    menuOptions: PropTypes.array.isRequired,
    buttonStyle: PropTypes.object,
    dropdownProps: PropTypes.object,
};

export default RoleDropdownMenu;

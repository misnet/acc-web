import { Dropdown, Avatar, Space, App } from 'antd';
import type { MenuProps } from 'antd';
import { history, useModel } from '@umijs/max';
import { stringify } from 'querystring';
import { useState } from 'react';
import UpdateProfileDrawer from '@/components/user/update-profile-drawer';
interface Props {
    fullname?: string;
    avatar?: string;
}
const RightContent: React.FC<Props> = (props) => {
    const [state, setState] = useState({
        profileDrawerOpen: false
    })

    const { onLogout } = useModel('user');
    const onProfileDrawerOpenChange = (visible: boolean) => {
        setState({ ...state, profileDrawerOpen: visible });
    }
    const onClick: MenuProps['onClick'] = ({ key }) => {
        console.log('onclick key:', key);
        if (key === 'logout') {
            const { search, pathname } = window.location;
            const urlParams = new URL(window.location.href).searchParams;
            /** 此方法会跳转到 redirect 参数所在的位置 */
            const redirect = urlParams.get('redirect');
            // Note: There may be security issues, please note
            if (window.location.pathname !== '/login' && !redirect) {
                history.replace({
                    pathname: '/login',
                    search: stringify({
                        redirect: pathname + search,
                    }),
                });
            }
            onLogout();
        } else if (key === 'updateprofile') {
            setState(prev => ({ ...prev, profileDrawerOpen: true }));
        }
    };
    const items: MenuProps['items'] = [{
        key: 'updateprofile',
        label: <a >修改资料</a>
    }, {
        key: 'logout',
        label: <a >退出登录</a>
    }];
    return <App><div style={{ display: 'flex' }}>
        <UpdateProfileDrawer open={state.profileDrawerOpen} onOpenChange={onProfileDrawerOpenChange} />
        <Space>
            <Dropdown menu={{ items, onClick }}>
                <a onClick={e => e.preventDefault} style={{ lineHeight: '50px', height: '50px', display: 'block' }}>
                    <Space><Avatar size='small' src={props.avatar ? props.avatar : 'https://pod.kity.me/static/logo3.svg'} />
                        <span>{props.fullname ? props.fullname : 'Unknown'}</span>
                    </Space>
                </a>
            </Dropdown>
        </Space>
    </div></App>
}
export default RightContent;
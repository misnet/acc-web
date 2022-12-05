import { useState } from 'react';
import styles from '../Login.less';
import { Form, Button, Alert, Input } from 'antd';
import { GooglePlusOutlined, WechatOutlined } from '@ant-design/icons';
import { generateUUID, setGlobalSetting, getGlobalSetting } from '@/utils/utils';
import { useLocation } from 'umi';
import systemConfig from '../../../config';
const page = props => {
    const [state, setState] = useState({
        visible: false,
        oauthUrl: ''
    });
    const updateState = (d) => {
        setState(prev => {
            return {
                ...prev,
                ...d
            }
        })
    }
    const curLocation = useLocation();
    const apiConfig = systemConfig.getOption();
    const { url, autologin = 1 } = curLocation.query;
    const onConnect = client => {
        let redirectUrl = url;
        if (!redirectUrl) {
            redirectUrl = '/';
        }
        const security_token = generateUUID();
        const stateData = {
            url: window.location.origin + '/user/oauth?client=' + client + '&url=' + encodeURIComponent(redirectUrl) + '&autologin=' + autologin,
            security_token,
            appkey: apiConfig.appKey
        }
        setGlobalSetting({
            [client + '_' + security_token]: security_token
        });
        let state = 'url=' + encodeURIComponent(stateData.url) + '&security_token=' + encodeURIComponent(security_token);
        state += '&appkey=' + stateData.appkey;
        //console.log('state', encodeURIComponent(state));
        const left = (window.screen.availWidth - 600) / 2;
        const baseUrl = `${apiConfig.gateway.split('//')[0]}//${apiConfig.gateway.split('//')[1].split('/')[0]}`;
        const oauthUrl = baseUrl + '/oauth/client?client=' + client + '&state=' + encodeURIComponent(state);
        updateState({ visible: true, oauthUrl });
        // const connectWindow = window.open(oauthUrl, 'connectWindow', 'top=20,left=' + left + ',height=610,width=600,menubar=no,status=no,location=no,toolbar=no');
        // connectWindow.addEventListener('beforeunload', () => {
        //     console.log('test');
        // });
    }
    const renderMessage = content => {
        return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
    };
    return <>
        {!state.visible && <Form onFinish={props.handleSubmit}>
            {props.loginStatus === 'error' &&
                !props.submitting &&
                renderMessage('账户或密码错误')}
            <Form.Item name='user' rules={[{
                required: true,
                message: '请输入用户名'
            }]}>
                <Input placeholder={"用户名"} size="large" />
            </Form.Item>
            <Form.Item name='password' rules={[{
                required: true,
                message: '请输入密码'
            }]}>

                <Input type="password" size="large" placeholder={"请输入密码"} />
            </Form.Item>
            <Form.Item>
                <Button size="large" className={styles.submit} type="primary" htmlType="submit">登陆</Button>
            </Form.Item>
        </Form>}
        {state.visible && <iframe width={600} height={600} frameBorder={0} border={0} src={state.oauthUrl} />}

        <div>
            <Button size="large" icon={<GooglePlusOutlined />} onClick={() => onConnect('google')} type="default" >Google 登陆</Button>

            <Button size="large" icon={<WechatOutlined />} onClick={() => onConnect('wechat')} type="default" >微信 登陆</Button>
        </div>
    </>
}
export default page;
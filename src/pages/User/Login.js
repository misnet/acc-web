import { Link, useSelector, useDispatch } from 'umi';
import { Input, Alert, Button, Row, Col, Form } from 'antd';
import { GooglePlusOutlined } from '@ant-design/icons';
import styles from './Login.less';
import systemConfig from '../../config';
import { generateUUID, setGlobalSetting, getGlobalSetting } from '../../utils/utils';

export default () => {
    const loadingEffect = useSelector(state => state.loading);
    const loginStore = useSelector(state => state.login);
    const submitting = loadingEffect.effects['login/login'];
    const dispatch = useDispatch();
    const apiConfig = systemConfig.getOption();
    const handleSubmit = (values) => {
        dispatch({
            type: 'login/login',
            payload: {
                ...values
            },
        });
    };

    const renderMessage = content => {
        return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
    };
    const onConnect = client => {
        const security_token = generateUUID();
        const stateData = {
            url: 'http://localhost:8001/user/oauth?client=' + client + '&url=/',
            security_token,
            appkey: apiConfig.appKey
        }
        setGlobalSetting({
            [client + '_' + security_token]: security_token
        });
        let state = 'url=' + encodeURIComponent(stateData.url) + '&security_token=' + encodeURIComponent(security_token);
        state += '&appkey=' + stateData.appkey;
        console.log('state', encodeURIComponent(state));

        const baseUrl = `${apiConfig.gateway.split('//')[0]}//${apiConfig.gateway.split('//')[1].split('/')[0]}`;
        const oauthUrl = baseUrl + '/oauth/client?client=' + client + '&state=' + encodeURIComponent(state);
        const connectWindow = window.open(oauthUrl, 'connectWindow', 'height=610,width=600,top=20');
        connectWindow.addEventListener('beforeunload', () => {
            console.log('test');
        })
    }

    return (
        <div className={styles.main} >
            <Form onFinish={handleSubmit}>
                {loginStore.loginStatus === 'error' &&
                    !submitting &&
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

                <Form.Item>
                    <Button size="large" icon={<GooglePlusOutlined />} onClick={() => onConnect('google')} type="default" >Google 登陆</Button>
                </Form.Item>
                <Form.Item>
                    <Button size="large" icon={<GooglePlusOutlined />} onClick={() => onConnect('wechat')} type="default" >微信 登陆</Button>
                </Form.Item>
            </Form>
        </div>
    );
}
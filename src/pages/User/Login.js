import { Link, useSelector, useDispatch } from 'umi';
import { Input, Alert, Button, Row, Col, Form } from 'antd';
import styles from './Login.less';

export default () => {
    const loadingEffect = useSelector(state => state.loading);
    const loginStore = useSelector(state => state.login);
    const submitting = loadingEffect.effects['login/login'];
    const dispatch = useDispatch();

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
            </Form>
        </div>
    );
}
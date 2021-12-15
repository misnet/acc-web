import styles from '../Login.less';
import { Form, Button, Alert, Input } from 'antd';
import { GooglePlusOutlined, WechatOutlined } from '@ant-design/icons';
const page = props => {
    const renderMessage = content => {
        return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
    };
    return <Form onFinish={props.handleSubmit}>
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

        <div>
            <Button size="large" icon={<GooglePlusOutlined />} onClick={() => props.onConnect('google')} type="default" >Google 登陆</Button>

            <Button size="large" icon={<WechatOutlined />} onClick={() => props.onConnect('wechat')} type="default" >微信 登陆</Button>
        </div>
    </Form>
}
export default page;
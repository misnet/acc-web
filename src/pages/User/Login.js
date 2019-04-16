import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'umi/link';
import { Input, Alert, Button,Form,Row,Col } from 'antd';
import styles from './Login.less';


@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (e) => {
     e.preventDefault();
      this.props.form.validateFields(['user','password'], { force: true }, (err, values) => {
          if(!err){
              this.props.dispatch({
                  type: 'login/login',
                  payload: {
                      ...values
                  },
              });
          }
      });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
      const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.main}>
                    <Form onSubmit={this.handleSubmit}>
                    {login.loginStatus === 'error' &&
                    login.type === 'account' &&
                    !login.submitting &&
                    this.renderMessage('账户或密码错误')}
                    <Form.Item>
                        {
                            getFieldDecorator('user',{
                                rules:[{
                                    required:true,
                                    message:'请输入用户名'
                                }]
                            })(
                                <Input placeholder={"用户名"} size="large"/>
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('password',{
                                rules:[{
                                    required:true,
                                    message:'请输入密码'
                                }]
                            })(
                                <Input type="password" size="large" placeholder={"请输入密码"} />
                            )
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button size="large" className={styles.submit}  type="primary" htmlType="submit">登陆</Button>
                    </Form.Item>
                </Form>
      </div>
    );
  }
}

export default Form.create()(LoginPage);
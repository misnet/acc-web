/**
 * 个人资料页面
 */
import React, { PureComponent } from 'react';
import {
  Divider,
  Form,
  Button,
  Table,
  Spin,
  Card,
  Input,
  Affix,
  Row,
  Icon,
  Col,
  message,
} from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from '../common.less';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import { formatMessage } from 'umi-plugin-react/locale';
import _ from 'lodash';
import md5 from 'md5';
const FormItem = Form.Item;

@connect(({ user }) => ({
  user
}))
@Form.create()
class ProfilePage extends PureComponent {
  constructor(props){
      super(props);
      this.state = {
        confirmDirty: false
      }
  }
  onSave = () => {
    this.props.form.validateFields((error, values) => {
      if (!error) {
        this.props.dispatch({
            type:'user/changePassword',
            payload:{
                password:md5(values.password)
            },
            callback:()=>{
                message.success('密码修改成功');
            }
        })
      }
    });
  };
  handleConfirmBlur = (e) => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['repassword'], { force: true });
    }
    callback();
  }
  render() {
    const {form:{getFieldDecorator}} = this.props;
    return (
      <PageHeaderWrapper title={'个人中心'}>
        <Card bordered={false}>
          <Affix offsetTop={64} className={styles.navToolbarAffix}>
            <div className={styles.navToolbar}>
              <Button icon="save" type="primary" onClick={this.onSave}>
                {formatMessage({ id: 'form.save' })}
              </Button>
              <Divider />
            </div>
          </Affix>
          <div className={styles.tableList}>
            <Row>
              <Col xs={{ span: 24 }} sm={{ span: 24 }}>
                <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                  label="新密码"
                >
                  {getFieldDecorator('password', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '请输入新密码',
                      },
                      {
                          min:6,
                          message:'密码长度不少于6位'
                      },
                      {
                        validator: this.validateToNextPassword,
                      }
                    ],
                  })(<Input type="password" placeholder="请输入新密码" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col xs={{ span: 24 }} sm={{ span: 24 }}>
              <FormItem
                  labelCol={{ span: 8 }}
                  wrapperCol={{ sm: { span: 16 }, xs: { span: 24 } }}
                  label="确认新密码"
                >
                  {getFieldDecorator('repassword', {
                    initialValue: '',
                    rules: [
                      {
                        required: true,
                        message: '再输一次新密码',
                      },
                      {
                          min:6,
                          message:'密码长度不少于6位'
                      },
                      {
                        validator: this.compareToFirstPassword,
                      },
                    ],
                  })(<Input type="password" placeholder="请再输入一次新密码" maxLength={20} onBlur={this.handleConfirmBlur}/>)}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default ProfilePage;

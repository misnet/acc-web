
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Icon,List, Avatar,Button } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { ChartCard, yuan, Field } from 'ant-design-pro/lib/Charts';
import 'ant-design-pro/dist/ant-design-pro.css';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import styles from './Workplace.less';
import moment from 'moment';
import config from '../../config';
import AppModal from './AppModal';

@connect(({ global,user,stats,app,loading }) => ({
  global,
  user,
  stats,
  app,
  loading: loading.effects['app/appList'],
  updateLoading: loading.effects['app/update'],
  createLoading :loading.effects['app/create'],
}))
class Workplace extends PureComponent {
  componentDidMount(){
    this.props.dispatch({
      type:'app/appList'
    })
  }
  /**
   * 关闭弹窗
   */
  onCancelModal = () => {
    this.props.dispatch({
      type: 'app/hideModal',
    })
  }
   /**
   * 点提交新建/编辑用户表单的OK键
   * @param values
   */
  onSubmitAppForm = (values) => {
    const {app: {modalType}} = this.props
    this.props.dispatch({
      type: `app/${modalType}`,
      payload: values,
    })
  }
  /**
   * 点新建时
   */
  onCreateApp = () => {
    this.props.dispatch({
      type: 'app/showModal',
      payload: {
        modalType: 'create',
        editData:{},
      },
    });
  }
  /**
   * 点编辑应用时
   */
  onEditApp = (record) => {
    this.props.dispatch({
      type: 'app/showModal',
      payload: {
        modalType: 'update',
        editData: record,
      },
    })
  }
  render() {
    const {
      user:{currentUser},
      updateLoading,
      createLoading,
      loading,app:{data:{list},editData,modalVisible,modalType}} = this.props;
    const ModalProps = {
      title: modalType === 'create' ? '新建应用' : '编辑应用',
      visible: modalVisible,
      onOk: this.onSubmitAppForm,
      confirmLoading: modalType === 'create'?createLoading:updateLoading,
      onCancel:this.onCancelModal,
      editData
    };
    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{currentUser.username}，你好！</div>
          <div>{moment().format(config.DATE_FORMAT)}</div>
        </div>
      </div>
    );

    return (
      <PageHeaderLayout content={pageHeaderContent} >
        <List 
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
        dataSource={['', ...list]}
        renderItem={
          item=>item?
          (<List.Item key={item.id}>
        <Card hoverable 
            title={item.name+":"+item.id}
            className={item.disabled?styles.disabledApp:{}}
            extra={<a onClick={()=>this.onEditApp(item)}>修改</a>}
        >
        <Card.Meta
          style={{padding:"10px"}}
          description={
            <Ellipsis lines={2} style={{height:"42px"}}>
            {item.shortDesc}
            </Ellipsis>
        }>

        </Card.Meta>
          <Card.Grid className={styles.gridStyle}><a href={"/sys/userlist?appId="+item.id+"&appName="+item.name }>用户管理</a></Card.Grid>
          <Card.Grid className={styles.gridStyle}><a href={"/sys/rolelist/index?appId="+item.id+"&appName="+item.name}>角色管理</a></Card.Grid>
          <Card.Grid className={styles.gridStyle}><a href={"/sys/menulist?appId="+item.id+"&appName="+item.name}>菜单管理</a></Card.Grid>
          <Card.Grid className={styles.gridStyle}>配置管理</Card.Grid>
        </Card></List.Item>):(<List.Item >
          <Button type="dashed" className={styles.newButton} onClick={this.onCreateApp}><Icon type="plus"></Icon>新增应用</Button>
        </List.Item>)}>
        </List>
        {modalVisible && <AppModal {...ModalProps} />}
      </PageHeaderLayout>
    );
  }
}
export default Workplace;
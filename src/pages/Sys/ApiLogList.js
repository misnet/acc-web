/**
 * 系统管理--APILOG列表界面
 * @author Donny
 *
 */
import React, { PureComponent } from 'react'
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
  Table,
  Card,
  Form,
  Popconfirm,
  Button,
  Divider,
  Affix,
  Icon,
  Modal,
  Tag
} from 'antd'
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import UserModal from './UserModal';
import styles from '../common.less'
import { formatMessage } from 'umi-plugin-react/locale';
import JSONPretty from 'react-json-pretty';
import ReactJson from 'react-json-view';
const JSONPrettyMon = require('react-json-pretty/dist/monikai');

import {getCachedApp,getGlobalSetting, setGlobalSetting} from '@/utils/utils';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',')

@connect(({apiLog, loading}) => ({
    apiLog,
  loading: loading.effects['apiLog/apiLogList']
}))
class ListPage extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
        showModal:false,
        content:'',
        title:''
    }
  }
  componentDidMount () {
    const {dispatch,location:{query}} = this.props;
    
    dispatch({
      type: 'apiLog/apiLogList',
      payload: {
        limit: getGlobalSetting('pageSize'),
        page: 1,
      },
    });
    
  }
  /**
   * 关闭弹窗
   */
  onCancelModal = () => {
    this.setState({
        showModal:false
    })
  }
  
  handleTableChange = (pagination, filtersArg, sorter) => {
    setGlobalSetting({pageSize: pagination.pageSize});
    this.props.dispatch({
      type: 'apiLog/apiLogList',
      payload: {
        limit: pagination.pageSize,
        page: pagination.current,
      },
    })
  }
  onShowJSON=(title,jsonData)=>{
    this.setState({
        title:title,
        showModal:true,
        content:jsonData
    })
  }
  
  render () {
    const {loading, 
      apiLog: {data},
    } = this.props
    
    // const {selectedRows} = this.state;
    // 分页定义
    const paginationProps = {
      showTotal (total) {
        return `共 ${total} 条记录`
      },
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: data.limit,
      current: data.page,
      total: data.total,
    }

    // 表列定义
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      }, {
        title: '方法',
        dataIndex: 'method',
        key: 'method',
      }, {
        title: '访问时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render:(text,record)=>{

            return moment(record.createTime * 1000).format('YYYY年MM月DD日 HH:mm:ss')
        }
      }, {
        title: '响应时间（秒）',
        dataIndex: 'duration',
        key: 'duration',
      }, {
        title: '状态码',
        dataIndex: 'status',
        key: 'status',
        render:(text,record)=>{
            if(record.result){
                return record.result.status==0?<Tag color="green">0</Tag>:<Tag color="#f50">{record.result.status}</Tag>
            } else{
                return '无';
            }
        }
      }, {
        title: '参数',
        dataIndex: 'params',
        key: 'params',
        render:(text,record)=><a onClick={()=>this.onShowJSON('参数',record.params)}>查看</a>
      }, {
        title: '响应',
        dataIndex: 'result',
        key: 'result',
        render:(text,record)=>{return record.result?<a onClick={()=>this.onShowJSON('响应结果',record.result)}>查看</a>:'无'}
      }]

    
    return (
      <PageHeaderWrapper title={"API日志列表"}>
        <Card bordered={false}>
       
          <div className={styles.tableList}>

            <Table
              rowKey={record => record.id}

              loading={loading}
              dataSource={data.list}
              columns={columns}
              onChange={this.handleTableChange}
              pagination={paginationProps}
            />
          </div>
          <Modal
            title={this.state.title}
            visible={this.state.showModal}
            onCancel={this.onCancelModal}
            width={600}

          >
              
              <ReactJson style={{wordBreak:"break-all"}} theme="monokai" displayDataTypes={false} src={this.state.content} />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
export default  ListPage;
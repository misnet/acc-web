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
  Popover,
  Icon,
  Modal,
  Tag
} from 'antd'
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import UserModal from './UserModal';
import styles from '../common.less'
import { formatMessage } from 'umi-plugin-react/locale';
import ReactJson from 'react-json-view';


import {getCachedApp,getGlobalSetting, setGlobalSetting} from '@/utils/utils';

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',')

@connect(({apiLog, loading,global}) => ({
   apiLog,
   loading: loading.effects['apiLog/apiLogList'],
   global,
   ipLoading:loading.effects['global/ipSearch']
}))
class ListPage extends PureComponent {
  constructor(props){
    super(props);
    this.state = {
        showModal:false,
        content:'',
        title:'',
        ipDetail:''
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
  onShowIp=(ip)=>{
      const key = 'IP_'+ip;
      let address = sessionStorage.getItem(key);
      if(!address){
        this.props.dispatch({
            type:'global/ipSearch',
            payload:{
                ip
            },
            callback:(ipInfo)=>{
                let region = [];
                if(ipInfo.country){
                    region.push(ipInfo.country)
                };
                if(ipInfo.prov){
                    region.push(ipInfo.prov)
                };
                if(ipInfo.city){
                    region.push(ipInfo.city)
                };
                if(ipInfo.area){
                    region.push(ipInfo.area)
                };
                address = region.join(' ');
                sessionStorage.setItem(key,address);
                this.setState({
                    ipDetail:address
                });
            }
        });
      }else{
          this.setState({
              ipDetail:address
          });
      }
  }
  showIpDetail=()=>{
    if(this.props.ipLoading){
        return '加载中...';
    }else{
        return this.state.ipDetail;
    }   
  }
  render () {
    const {loading, 
      apiLog: {data},
      global:{ipInfo},
      ipLoading
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
          title:'IP',
          dataIndex:'ip',
          key:'ip',
          render:(text,record)=><Popover content={this.showIpDetail(record.ip)} trigger="click" onClick={()=>this.onShowIp(record.ip)}><a>{record.ip}</a></Popover>
      },{
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
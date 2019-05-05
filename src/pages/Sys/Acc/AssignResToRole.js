/**
 * 角色管理--给角色分配某个指定的权限资源
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Checkbox, Table, Button,Affix,Divider,Radio } from 'antd';
import { routerRedux } from 'dva/router';
import { indexOf, without,findIndex,remove } from 'lodash';
import { formatMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from '../../common.less';
import {getCachedApp} from '@/utils/utils';
@connect(({ app,operations, loading }) => ({
    app,
    operations,
    loading: loading.effects['operations/list'],
    saveLoading: loading.effects['operations/assign'],
}))
@Form.create()
class AssignResToRole extends PureComponent {
    state = {
        checkAll: 2,
        selectedRowKeys: [], 
    };
    onSelect = (e,code) => {
        console.log('e',e);
        const { operations: { data },dispatch } = this.props;
        let newOps = [...data.op];
        const index = findIndex(newOps,item=>item.code==code);
        if(index>-1){
            newOps[index]['allow'] = e.target.value;
            console.log('newOps[index]',index,code,newOps[index]);
            console.log('newOps',newOps);
            dispatch({
                type:'operations/save',
                payload:{
                    ...data,
                    op:newOps
                }
            })
        }
    };
    onSelectAll = (e) => {
        const { operations: { data },dispatch } = this.props;
        let newData = [];
        if (e.target.value===1) {
            newData = data.op.map(record => ({
                ...record,
                allow:1
            }));
        } else if(e.target.value===0) {
            newData = data.op.map(record => ({
                ...record,
                allow:0
            }));
        }else{
            newData = data.op.map(record => ({
                ...record,
                allow:-1
            }));
            console.log('newData',newData);
        }
        dispatch({
            type:'operations/save',
            payload:{
                ...data,
                op:newData
            }
        })
        // console.log('selectedRowKeys',selectedRowKeys);
        // this.setState({
        //     checkAll: e.target.value,
        //     selectedRowKeys,
        // });
    };
    onSave = () => {
        const { 
            dispatch, 
            match: { params },
            operations:{data},
            app:{currentApp}
         } = this.props;
        dispatch({
            type: 'operations/assign',
            payload: { 
                appId:currentApp.id,
                rid: params.rid, 
                opcodes: data.op,
                res:params.rcode
            },
        });
    };
    componentDidMount() {
        const { dispatch, match: { params }} = this.props;
        if(!params.rcode || !params.rid){
            routerRedux.push('/exception/404');
            return;
        }


        const currentApp = getCachedApp();
        if (!currentApp) {
            routerRedux.push("/exception/404");
            return;
        }
        dispatch({
            type:'app/setCurrentApp',
            payload:currentApp
        });

        dispatch({
            type: 'operations/list',
            payload: { appId:currentApp.id,rid: params.rid, res: params.rcode },
        });
    }

    render() {
        const {
            operations: { data },
            loading,
            saveLoading,
            match: { params },
            dispatch,
            form:{getFieldDecorator}
        } = this.props;
        const { selectedRowKeys,checkAll } = this.state;
        // 表列定义
        const columns = [
            {
                title: '操作名称',
                key: 'text',
                dataIndex: 'text',
            },
            {
                title: '操作代码',
                key: 'code',
                dataIndex: 'code',
            },
            {
                title: '当前权限结果',
                key: 'allow',
                dataIndex: 'allow',
                render: (text, record) => <span>{record.allow == 1 ? '允许' : (record.allow == 0)?'禁止':'不设置'}</span>,
            },
            {
                title: (
                    //console.log('record.code',selectedRowKeys,record.code,indexOf(selectedRowKeys, record.code));
                    getFieldDecorator('all',{
                        initialValue:checkAll
                    })(
                        <Radio.Group
                            buttonStyle="solid"
                            size="small"
                            onChange={this.onSelectAll} 
                        >
                            <Radio.Button value={1}>允许</Radio.Button>
                            <Radio.Button value={0}>禁止</Radio.Button>
                            <Radio.Button value={-1}>不设置</Radio.Button>
                        </Radio.Group>
                    )
                ),
                key: 'assign',
                dataIndex: 'assign',
                render: (text, record) => {
                    //console.log('record.code',selectedRowKeys,record.code,indexOf(selectedRowKeys, record.code));
                    return getFieldDecorator('assign_'+record.code,{
                        initialValue:record.allow
                    })(
                        <Radio.Group
                            size="small"
                            buttonStyle="solid"
                            onChange={(e)=>this.onSelect(e,record.code)} 
                        >
                            <Radio.Button value={1}>允许</Radio.Button>
                            <Radio.Button value={0}>禁止</Radio.Button>
                            <Radio.Button value={-1}>不设置</Radio.Button>
                        </Radio.Group>
                    )
                }
            },
        ];
        const returnBack = () => {
            dispatch(routerRedux.push(`/sys/rolelist/role-res/${params.rid}`));
        };
        return (
            <PageHeaderWrapper title="权限资源分配">
                <Card bordered={false}>
                    <Affix offsetTop={64} className={styles.navToolbarAffix}>
                        <div className={styles.navToolbar}>
                        
                        <Button icon="arrow-left" onClick={returnBack}>
                            返回
                        </Button>
                        <Button
                            icon="check"
                            type="primary"
                            loading={saveLoading}
                            onClick={this.onSave}
                        >
                            保存
                        </Button>
                        <Divider />
                        </div>
                    </Affix>
                    <Table
                        rowKey={record => record.code}
                        loading={loading}
                        dataSource={data.op}
                        columns={columns}
                        pagination={false}
                    />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default AssignResToRole;
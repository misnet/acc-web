/**
 * 角色管理--列出所有权限资源，以供选择分配权限
 * @author Donny
 *
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Table, Button,Affix,Divider,Modal,Form, Input,Tree } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { Link, routerRedux } from 'dva/router';
import { forEach } from 'lodash';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from '../../common.less';
import {getCachedApp} from '@/utils/utils';
@connect(({ app,resources, loading }) => ({
    app,
    resources,
    loading: loading.effects['resources/list'],
}))
@Form.create()
class ResourcesList extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            sampleModalVisible:false,
            importModalVisible:false,
            uploaded:false,
            resourceXml:''
        }
    }
    resourceXmlSample = `<?xml version="1.0" encoding="UTF-8"?>
<privileges>
    <resource code="RES_USER" title="用户">
        <op code="OP_ADD" title="添加"/>
        <op code="OP_EDIT" title="编辑"/>
        <op code="OP_REMOVE" title="删除"/>
    </resource>
    <resource code="RES_ARTICLE" title="文章">
        <op code="OP_ADD" title="添加"/>
        <op code="OP_EDIT" title="编辑"/>
        <op code="OP_REMOVE" title="删除"/>
    </resource>
</privileges>`;
    componentDidMount() {
        const { dispatch ,location: { query }} = this.props;
        const currentApp = getCachedApp(query);
        if (!currentApp) {
            routerRedux.push("/exception/404");
            return;
        }else{
            dispatch({
                type:'app/setCurrentApp',
                payload:currentApp
            });
        }
        dispatch({
            type: 'resources/list',
            payload: {
                appId:currentApp.id
            },
        });
    };
    importResource = ()=>{
        this.setState({
            importModalVisible:true
        });
        this.props.dispatch({
            type:'resources/setParsedXml',
            payload:{
                parsedKey:null,
                parsedResources:null
            }
        })
    };
    nextStep = ()=>{
        const {resources:{parsedKey},dispatch,app:{currentApp}} = this.props;
        if(!this.props.resources.parsedKey){
            this.startImport();
        }else{
            //开始正式导入
            console.log('import..');
            this.props.dispatch({
                type:'resources/importResources',
                payload:{
                    parsedKey:parsedKey,
                    appId:currentApp.id
                },
                callback:(result)=>{
                    if(result){
                        //导入成功
                        this.setState({
                            importModalVisible:false
                        });
                        dispatch({
                            type: 'resources/list',
                            payload: {
                                appId:currentApp.id
                            },
                        });
                    }
                }
            })
        }
    }
    prevStep = ()=>{
        if(!this.props.resources.parsedKey){
            this.cancelImport();
        }else{
            this.props.dispatch({
                type:'resources/setParsedXml',
                payload:{
                    parsedKey:null,
                    parsedResources:null
                }
            });
        }
    }
    startImport=()=>{
        const {form:{getFieldValue,validateFields},dispatch,app:{currentApp}} = this.props;
        
        validateFields(['resourceXml'],(err)=>{
            if(!err){
                const resourceXml = getFieldValue('resourceXml');
                this.setState({
                    //importModalVisible:false
                    resourceXml
                });
                dispatch({
                    type:'resources/preparseXml',
                    payload:{
                        appId:currentApp.id,
                        xml:resourceXml
                    }
                })
            }else{
                console.log('err',err);
            }
        })
        
    };
    cancelImport=()=>{
        this.setState({
            importModalVisible:false
        })
    };
    createTree=(resources)=>{
        return <Tree
        showLine
        >
        {resources.map(item=>(
            <Tree.TreeNode title={item.title+'，代码：'+item.code} key={item.code}>
            {Array.isArray(item.op)?(
                item.op.map(opAction=>(
                    <Tree.TreeNode title={opAction.title+'，代码：'+opAction.code} key={item.code+'.'+opAction.code}/>
                ))
            ):null}
            </Tree.TreeNode>
        ))}
        </Tree>
    }
    showResourceSample = ()=>{
        Modal.info({
            width:550,
            okText:'知道了',
            title:'资源XML内容示例',
            content:(<Input.TextArea rows={10} defaultValue={this.resourceXmlSample}></Input.TextArea>)
        });
    }
    render() {
        const { resources: { data,parsedResources }, loading, match: { params }, dispatch,form:{getFieldDecorator} } = this.props;
        const dataSource = [];
        forEach(data, (value, key) => {
            dataSource.push({
                code: value.code,
                text: value.text,
            });
        });

        const returnBack = () => {
            dispatch(routerRedux.push('/sys/rolelist/index'));
        };
        // 表列定义
        const columns = [
            {
                title: '资源名称',
                key: 'text',
                dataIndex: 'text',
            },
            {
                title: '资源代码',
                key: 'code',
                dataIndex: 'code',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <Link
                            to={`/sys/rolelist/assign-role-res/${params.rid}/${record.code}/${record.text}`}
                        >
                            分配权限
                        </Link>
                    </span>
                ),
            },
        ];
        return (
            <PageHeaderWrapper title="权限资源分配">
                <Card bordered={false}>
                    <Affix offsetTop={64} className={styles.navToolbarAffix}>
                        <div className={styles.navToolbar}>
                        <Button icon="arrow-left" type="default" onClick={returnBack}>
                        {formatMessage({id:'form.return'})}
                        </Button>
                        <Button type="default" onClick={this.showResourceSample}>
                        资源示例
                        </Button>
                        <Button icon="arrow-up" type="primary" onClick={this.importResource}>
                        资源导入
                        </Button>
                        <Divider />
                        </div>
                    </Affix>
                    <Table
                        rowKey={record => record.code}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                    />
                    {this.state.importModalVisible?<Modal
                    visible = {this.state.importModalVisible}
                    onCancel={this.prevStep}
                    onOk={this.nextStep}
                    title={'导入权限资源XML'}
                    okText={parsedResources?'确定':'下一步'}
                    cancelText={parsedResources?'上一步':'取消'}
                    >
                    {parsedResources?(this.createTree(parsedResources)):
                    <Form.Item>
                    {getFieldDecorator('resourceXml',{
                        initialValue:this.state.resourceXml,
                        rules:[{
                            required:true,
                            message:'请填写权限资源XML内容'
                        }]
                    })(
                        <Input.TextArea rows="10"></Input.TextArea>
                    )}
                    </Form.Item>}
                    
                    </Modal>:null}
                    
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default ResourcesList;
/**
 * 角色管理--列出所有权限资源，以供选择分配权限
 * @author Donny
 *
 */
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, ArrowUpOutlined } from '@ant-design/icons';

import { Card, Table, Button, Form, Affix, Divider, Modal, Input, Tree } from 'antd';
import { Link, history, useDispatch, useSelector, useIntl } from 'umi';
import { forEach } from 'lodash';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from '../../common.less';
import { getCachedApp } from '@/utils/utils';

export default (props) => {
    const intl = useIntl();
    const { app, resources } = useSelector(state => state);
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['resources/list'];
    const dispatch = useDispatch();
    const [state, setState] = useState({
        sampleModalVisible: false,
        importModalVisible: false,
        uploaded: false,
        resourceXml: ''
    });
    const [form] = Form.useForm();
    const resourceXmlSample = `<?xml version="1.0" encoding="UTF-8"?>
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
    useEffect(() => {
        const { query } = props.location;
        const currentApp = getCachedApp(query);
        if (!currentApp) {
            history.push("/exception/404");
            return;
        } else {
            dispatch({
                type: 'app/setCurrentApp',
                payload: currentApp
            });
        }
        dispatch({
            type: 'resources/list',
            payload: {
                appId: currentApp.id
            },
        });
    }, []);
    const importResource = () => {
        setState(prevState => {
            return {
                ...prevState,
                importModalVisible: true
            }
        });
        dispatch({
            type: 'resources/setParsedXml',
            payload: {
                parsedKey: null,
                parsedResources: null
            }
        })
    };
    const { currentApp } = app;
    const nextStep = () => {
        if (!resources.parsedKey) {
            startImport();
        } else {
            //开始正式导入
            console.log('import..');
            dispatch({
                type: 'resources/importResources',
                payload: {
                    parsedKey: resources.parsedKey,
                    appId: currentApp.id
                },
                callback: (result) => {
                    if (result) {
                        //导入成功
                        setState(prevState => {
                            return {
                                ...prevState,
                                importModalVisible: false
                            }
                        });
                        dispatch({
                            type: 'resources/list',
                            payload: {
                                appId: currentApp.id
                            },
                        });
                    }
                }
            })
        }
    }
    const prevStep = () => {
        if (!resources.parsedKey) {
            cancelImport();
        } else {
            dispatch({
                type: 'resources/setParsedXml',
                payload: {
                    parsedKey: null,
                    parsedResources: null
                }
            });
        }
    }
    const startImport = () => {
        form.validateFields(['resourceXml']).then(values => {
            const resourceXml = form.getFieldValue('resourceXml');
            setState(prevState => {
                //importModalVisible:false
                return {
                    ...prevState,
                    resourceXml

                }
            });
            dispatch({
                type: 'resources/preparseXml',
                payload: {
                    appId: currentApp.id,
                    xml: resourceXml
                }
            })
        }).catch(err => {
            console.log('err', err);
        })

    };
    const cancelImport = () => {
        setState(prevState => {
            return {
                ...prevState,
                importModalVisible: false
            }
        })
    };
    const createTree = (resources) => {
        return <Tree
            showLine
            treeData={resources.map(item => {
                const node = {
                    title: item.title + '，代码：' + item.code,
                    key: item.code,
                    children: []
                }
                if (Array.isArray(item.op)) {
                    item.op.map(opAction => (
                        node.children.push({
                            title: opAction.title + '，代码：' + opAction.code,
                            key: item.code + '.' + opAction.code
                        })
                    ));
                }
                return node;
            })}>
        </Tree >
    }
    const showResourceSample = () => {
        Modal.info({
            width: 550,
            okText: '知道了',
            title: '资源XML内容示例',
            content: (<Input.TextArea rows={10} defaultValue={resourceXmlSample}></Input.TextArea>)
        });
    }
    const params = props.match.params;
    const dataSource = [];
    forEach(resources.data, (value, key) => {
        dataSource.push({
            code: value.code,
            text: value.text,
        });
    });

    const returnBack = () => {
        history.push('/sys/rolelist/index');
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
                        <Button icon={<ArrowLeftOutlined />} type="default" onClick={returnBack}>
                            {intl.formatMessage({ id: 'form.return' })}
                        </Button>
                        <Button type="default" onClick={showResourceSample}>
                            资源示例
                        </Button>
                        <Button icon={<ArrowUpOutlined />} type="primary" onClick={importResource}>
                            资源导入
                        </Button>
                        <Divider />
                    </div>
                </Affix>
                <Table
                    rowKey={record => record.code}
                    loading={loading}
                    dataSource={resources.data}
                    columns={columns}
                />
                {state.importModalVisible ? <Modal
                    visible={state.importModalVisible}
                    onCancel={prevStep}
                    onOk={nextStep}
                    title={'导入权限资源XML'}
                    okText={resources.parsedResources ? '确定' : '下一步'}
                    cancelText={resources.parsedResources ? '上一步' : '取消'}
                >
                    {resources.parsedResources ? (createTree(resources.parsedResources)) :
                        <Form form={form}><Form.Item name='resourceXml' initialValue={state.resourceXml} rules={[{
                            required: true,
                            message: '请填写权限资源XML内容'
                        }]}>
                            <Input.TextArea rows="10"></Input.TextArea>
                        </Form.Item></Form>}

                </Modal> : null}

            </Card>
        </PageHeaderWrapper>
    );
}
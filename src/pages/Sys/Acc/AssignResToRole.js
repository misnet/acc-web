/**
 * 角色管理--给角色分配某个指定的权限资源
 * @author Donny
 *
 */
import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, CheckOutlined } from '@ant-design/icons';

import { Card, Checkbox, Form, Table, Button, Affix, Divider, Radio } from 'antd';
import { history, useDispatch, useSelector } from 'umi';
import { indexOf, without, findIndex, remove } from 'lodash';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from '../../common.less';
import { getCachedApp } from '@/utils/utils';

export default (props) => {
    const { app, operations } = useSelector(state => state);
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['operations/list'];
    const saveLoading = loadingEffect.effects['operations/assign'];
    const [state, setState] = useState({
        checkAll: 2,
        selectedRowKeys: [],
    });
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const onSelect = (e, code) => {
        let newOps = [...operations.data.op];
        const index = findIndex(newOps, item => item.code == code);
        if (index > -1) {
            newOps[index]['allow'] = e.target.value;
            console.log('newOps[index]', index, code, newOps[index]);
            console.log('newOps', newOps);
            dispatch({
                type: 'operations/save',
                payload: {
                    ...operations.data,
                    op: newOps
                }
            })
        }
    };
    const onSelectAll = (e) => {
        const data = operations.data;
        let newData = [];
        if (e.target.value === 1) {
            newData = data.op.map(record => {
                form.setFieldsValue({
                    ['assign_' + record.code]: 1
                });
                return {
                    ...record,
                    allow: 1
                }
            });
        } else if (e.target.value === 0) {
            newData = data.op.map(record => {
                form.setFieldsValue({
                    ['assign_' + record.code]: 0
                });
                return {
                    ...record,
                    allow: 0
                }
            });


        } else {
            newData = data.op.map(record => {
                form.setFieldsValue({
                    ['assign_' + record.code]: -1
                });
                return {
                    ...record,
                    allow: -1
                }
            });
        }
        dispatch({
            type: 'operations/save',
            payload: {
                ...data,
                op: newData
            }
        })
        // console.log('selectedRowKeys',selectedRowKeys);
        // this.setState({
        //     checkAll: e.target.value,
        //     selectedRowKeys,
        // });
    };
    const onSave = () => {
        const { params } = props.match;
        const { data } = operations;
        const { currentApp } = app;
        dispatch({
            type: 'operations/assign',
            payload: {
                appId: currentApp.id,
                rid: params.rid,
                opcodes: data.op,
                res: params.rcode
            },
        });
    };
    useEffect(() => {
        const { params } = props.match;
        if (!params.rcode || !params.rid) {
            history.push('/exception/404');
            return;
        }


        const currentApp = getCachedApp();
        if (!currentApp) {
            history.push("/exception/404");
            return;
        }
        dispatch({
            type: 'app/setCurrentApp',
            payload: currentApp
        });

        dispatch({
            type: 'operations/list',
            payload: { appId: currentApp.id, rid: params.rid, res: params.rcode },
        });
    }, []);

    const { data } = operations;
    const { params } = props.match;
    const { selectedRowKeys, checkAll } = state;
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
            render: (text, record) => <span>{record.allow == 1 ? '允许' : (record.allow == 0) ? '禁止' : '不设置'}</span>,
        },
        {
            title: (
                <Form.Item name='all' initialValue={checkAll}>
                    <Radio.Group
                        buttonStyle="solid"
                        size="small"
                        onChange={onSelectAll}
                    >
                        <Radio.Button value={1}>允许</Radio.Button>
                        <Radio.Button value={0}>禁止</Radio.Button>
                        <Radio.Button value={-1}>不设置</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            ),
            key: 'assign',
            dataIndex: 'assign',
            render: (text, record) => {
                return <Form.Item name={'assign_' + record.code} initialValue={record.allow}>
                    <Radio.Group
                        size="small"
                        buttonStyle="solid"
                        onChange={(e) => onSelect(e, record.code)}
                    >
                        <Radio.Button value={1}>允许</Radio.Button>
                        <Radio.Button value={0}>禁止</Radio.Button>
                        <Radio.Button value={-1}>不设置</Radio.Button>
                    </Radio.Group>
                </Form.Item>

            }
        },
    ];
    const returnBack = () => {
        history.push(`/sys/rolelist/role-res/${params.rid}`);
    };
    return (
        <PageHeaderWrapper title="权限资源分配">
            <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>

                        <Button icon={<ArrowLeftOutlined />} onClick={returnBack}>
                            返回
                        </Button>
                        <Button
                            icon={<CheckOutlined />}
                            type="primary"
                            loading={saveLoading}
                            onClick={onSave}
                        >
                            保存
                        </Button>
                        <Divider />
                    </div>
                </Affix>
                <Form form={form}>
                    <Table
                        rowKey={record => record.code}
                        loading={loading}
                        dataSource={data.op}
                        columns={columns}
                        pagination={false}
                    /></Form>
            </Card>
        </PageHeaderWrapper>
    );
}
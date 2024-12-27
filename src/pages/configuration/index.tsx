import { ActionType, PageContainer, ProTable, ProDescriptionsItemProps, ProColumns } from '@ant-design/pro-components';
import { history, Link, useModel, useSearchParams } from '@umijs/max';
import { Button, Input, message, Popconfirm, Tag } from 'antd';
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import EditDrawer from './edit-drawer';
import { apiRequest } from '@/utils/utils';
const ListPage: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [searchParams] = useSearchParams();
    const appId = searchParams.get('appId');
    const appName = searchParams.get('appName');
    const [state, setState] = useState({
        editDrawerOpen: false,
        editRecord: null,
    });
    const onToggleEdit = (record: Xpod.ConfigurationInfo | null, open: boolean) => {
        setState((prev) => {
            return {
                ...prev,
                editRecord: record,
                editDrawerOpen: open,
            };
        });
    };
    const onOpenChange = (open: boolean) => {
        setState((prev) => {
            return {
                ...prev,
                editDrawerOpen: open,
            };
        });
    };
    const onNew = () => {
        onToggleEdit(null, true);
    };
    const onConfirmSave = (value: any) => {
        const payload = {
            ...value,
            appId,
            id: state.editRecord?.id ? state.editRecord?.id : 0,
        };
        if (payload.id > 0) {
            apiRequest('acc.configuration.update', payload).then((res) => {
                console.log('res', res);
                if (res.success) {
                    message.success('保存成功');
                    onToggleEdit(null, false);
                    actionRef.current?.reload();
                } else {
                    message.error(res.message);
                }
            });
        } else {
            apiRequest('acc.configuration.create', payload).then((res) => {
                console.log('res create', res);
                if (res.success) {
                    message.success('保存成功');
                    onToggleEdit(null, false);
                    actionRef.current?.reload();
                } else {
                    message.error(res.message);
                }
            });
        }
    };
    const columns: ProColumns<any>[] = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
            hideInSearch: true,
            fixed: 'left',
        },
        {
            title: '配置项名称/备注',
            dataIndex: 'configName',
            fixed: 'left',
            hideInSearch: true,
            render: (_, record) => {
                return (
                    <div>
                        <div>{record.configName}</div>
                        <div style={{ color: '#ccc' }}>{record.remark}</div>
                    </div>
                );
            },
        },
        {
            title: '配置项Key/Value值',
            dataIndex: 'configKey',
            hideInSearch: true,
            render: (_, record) => {
                return (
                    <div>
                        <div>{record.configKey}</div>
                        <div style={{ color: '#ccc' }}>{record.configValue}</div>
                    </div>
                );
            },
        },
        {
            title: '所属模块',
            hideInSearch: true,
            dataIndex: 'module',
        },
        {
            title: '是否启用',
            dataIndex: 'isEnabled',
            width: 90,
            hideInSearch: true,
            render: (text) => (text === 'y' ? <Tag color="green">启用</Tag> : <Tag color="orange">禁用</Tag>),
        },
        {
            title: '是否只读',
            dataIndex: 'readonly',
            width: 90,
            hideInSearch: true,
            render: (text) => (text === 'y' ? <Tag color="green">只读</Tag> : <Tag color="orange">读写</Tag>),
        },
        {
            title: '配置类型',
            dataIndex: 'itemType',
            width: 80,
            hideInSearch: true,
        },
        {
            title: '时间',
            hideInSearch: true,
            dataIndex: 'createdTime',
            valueType: 'dateRange',
            render: (_, record) => {
                return (
                    <>
                        <div>创建：{record.createdTime > 0 ? dayjs.unix(record.createdTime).format('YYYY-MM-DD HH:mm') : '-'}</div>
                        <div>修改：{record.updatedTime > 0 ? dayjs.unix(record.updatedTime).format('YYYY-MM-DD HH:mm') : '-'}</div>
                    </>
                );
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            hideInSearch: true,
            fixed: 'right',
            width: 100,
            render: (_, record) => {
                return record.readonly == 'n' ? (
                    <>
                        <a onClick={() => onToggleEdit(record, true)}>编辑</a>
                    </>
                ) : null;
            },
        },
    ];
    return (
        <PageContainer title={appName ? `应用[${appName}]——参数配置` : '参数配置'}>
            <ProTable<any>
                actionRef={actionRef}
                headerTitle="参数配置"
                rowKey="id"
                search={false}
                scroll={{ x: 'max-content' }}
                request={async (params) => {
                    const result = await apiRequest('acc.configuration.items', { ...params, appId });
                    console.log('result', result);
                    return {
                        total: result.data.total,
                        data: result.data.list,
                        success: true,
                    };
                }}
                toolBarRender={() => [
                    <Button key="1" type="primary" onClick={onNew}>
                        新建
                    </Button>,
                ]}
                columns={columns}
            />
            <EditDrawer dataSource={state.editRecord} open={state.editDrawerOpen} onOpenChange={onOpenChange} onConfirm={onConfirmSave} />
        </PageContainer>
    );
};

export default ListPage;

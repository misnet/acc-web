import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Divider, Popconfirm, Tag, App, Space, Button, Dropdown, Input } from "antd";
import type { MenuProps } from 'antd';
import { apiRequest, getLocalSetting, setLocalSetting } from "@/utils/utils";
import { useRef, useState } from "react";
import EditDrawer from "./components/edit-drawer";
import ImportResources from "./components/import-resources";
import { Link, useSearchParams } from "@umijs/max";
import { getRoleAssignPolicyText } from "@/constants/format";
import { ArrowLeftOutlined, ArrowUpOutlined, DownOutlined } from "@ant-design/icons";
import { history } from '@umijs/max';
const Page: React.FC = () => {
    const [searchParams] = useSearchParams();
    const rid = searchParams.get('rid');

    const appId = searchParams.get('appId');
    const appName = searchParams.get('appName');
    const { message, modal } = App.useApp();
    const actionRef = useRef();
    const [state, setState] = useState({

        importModalVisible: false
    });
    const onImportModalClose = () => {
        setState(prev => ({
            ...prev,
            importModalVisible: false
        }));
        actionRef.current?.reload();
    }
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
    const columns = [
        {
            title: '资源名称',
            key: 'text',
            dataIndex: 'text',
            hideInSearch: true,
        },
        {
            title: '资源代码',
            key: 'code',
            dataIndex: 'code',
            hideInSearch: true,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 120,
            hideInSearch: true,
            render: (text, record) => (
                <span>
                    {record.hasChild ? <Link to={`/roles/subresources?rid=${rid}&res=${record.code}&appId=${appId}&appName=${appName ? encodeURIComponent(appName) : ''}`} >查看子资源</Link> :
                        <Link to={`/roles/assign-res?rid=${rid}&rescode=${record.code}&resname=${record.text}&appId=${appId}&appName=${appName ? encodeURIComponent(appName) : ''}`} >
                            分配权限
                        </Link>}
                </span>
            ),
        },
    ];
    const showResourceSample = () => {
        modal.info({
            width: 550,
            okText: '知道了',
            title: '资源XML内容示例',
            content: (<Input.TextArea rows={10} defaultValue={resourceXmlSample}></Input.TextArea>)
        });
    }
    const importResource = () => {
        setState(prev => ({ ...prev, importModalVisible: true }));
    }
    const onBack = () => {
        history.back();
    }
    return <PageContainer title={appName ? `应用[${appName}]——资源管理` : '资源管理'}>
        <ImportResources appId={appId} open={state.importModalVisible} onClose={onImportModalClose} />
        <ProTable
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            search={false}
            toolBarRender={() => [
                <Button type="default" key='return' icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>,
                <Button type="default" key='sample' onClick={showResourceSample}>资源示例</Button>,
                <Button type="primary" key='import' icon={<ArrowUpOutlined />} onClick={importResource}>资源导入</Button>,
            ]}
            pagination={false}
            request={async (params) => {
                const payload = {
                    ...params,
                    appId
                }
                const response = await apiRequest('acc.role.resourcegroup', payload);
                if (response.success) {
                    return {
                        data: response.data,
                        total: response.data.length,
                        success: true,

                    }
                } else {
                    return {
                        data: [],
                        total: 0,
                        success: true,
                    }
                }
                console.log('response', response);

            }}
        />
    </PageContainer >
}
export default Page;
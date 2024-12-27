import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Divider, Popconfirm, Tag, App, Space, Button, Dropdown, Input } from "antd";
import type { MenuProps } from 'antd';
import { apiRequest, getLocalSetting, setLocalSetting } from "@/utils/utils";
import { useRef, useState } from "react";
import { Link, useSearchParams } from "@umijs/max";
import { ArrowLeftOutlined, ArrowUpOutlined, DownOutlined } from "@ant-design/icons";
import { history } from '@umijs/max';
const Page: React.FC = () => {
    const [searchParams] = useSearchParams();
    const rid = searchParams.get('rid');
    const rescode = searchParams.get('res');
    const { message, modal } = App.useApp();
    const actionRef = useRef();


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
                    <Link to={`/roles/assign-res?rid=${rid}&rescode=${record.parentCode}&resname=${record.text}&dataId=${record.id}`} >
                        分配权限
                    </Link>
                </span>
            ),
        },
    ];
    const onBack = () => {
        history.back();
    }
    return <PageContainer >
        <ProTable
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            scroll={{ x: 'max-content' }}
            search={false}
            toolBarRender={() => [
                <Button type="default" key='return' icon={<ArrowLeftOutlined />} onClick={onBack}>返回</Button>,
            ]}
            request={async (params) => {
                const payload = {
                    ...params,
                    res: rescode
                }
                const response = await apiRequest('acc.role.resourcegroup.children', payload);
                if (response.success) {
                    return {
                        data: response.data.list,
                        total: response.data.total,
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
    </PageContainer>
}
export default Page;
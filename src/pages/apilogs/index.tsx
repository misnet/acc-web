import { ActionType, PageContainer, ProTable, ProDescriptionsItemProps, ProColumns } from '@ant-design/pro-components';
import { history, Link, useModel } from '@umijs/max';
import { Button, Input, message, Modal, Popconfirm, Popover, Tag } from 'antd';

import ReactJson from 'react-json-view';
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import EditDrawer from './edit-drawer';
import { apiRequest } from '@/utils/utils';
const ListPage: React.FC = () => {
    const actionRef = useRef<ActionType>();
    const [state, setState] = useState({
        showModal: false,
        content: '',
        title: '',
        ipDetail: ''
    });
    const showIpDetail = () => {
        if (!state.ipDetail) {
            return '加载中...';
        } else {
            return state.ipDetail;
        }
    }
    const onCancelModal = () => {
        setState(prevState => {
            return {
                ...prevState,
                showModal: false
            }
        })
    }
    const onShowJSON = (title, jsonData) => {
        setState(prevState => {
            return {
                ...prevState,
                title: title,
                showModal: true,
                content: jsonData
            }
        })
    }
    const onShowIp = (ip) => {
        const key = 'IP_' + ip;
        let address = sessionStorage.getItem(key);
        if (!address) {
            apiRequest('common.ip', { ip }).then(response => {
                if (response.success) {
                    const ipInfo = response.data;
                    let region = [];
                    if (ipInfo.country) {
                        region.push(ipInfo.country)
                    };
                    if (ipInfo.prov) {
                        region.push(ipInfo.prov)
                    };
                    if (ipInfo.city) {
                        region.push(ipInfo.city)
                    };
                    if (ipInfo.area) {
                        region.push(ipInfo.area)
                    };
                    address = region.join(' ');
                    sessionStorage.setItem(key, address);
                    setState(prev => ({
                        ...prev,
                        ipDetail: address
                    }));
                }
            })
        } else {
            setState(prevState => {
                return {
                    ...prevState,
                    ipDetail: address
                }
            });
        }
    }
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
            render: (text, record) => {

                return dayjs.unix(parseInt(record.createTime)).format('YYYY年MM月DD日 HH:mm:ss')
            }
        }, {
            title: '响应时间（秒）',
            dataIndex: 'duration',
            key: 'duration',
        }, {
            title: '状态码',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                if (record.result) {
                    return record.result.status == 0 ? <Tag color="green">0</Tag> : <Tag color="#f50">{record.result.status}</Tag>
                } else {
                    return '无';
                }
            }
        }, {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            render: (text, record) => <Popover content={showIpDetail(record.ip)} trigger="click" onClick={() => onShowIp(record.ip)}><a>{record.ip}</a></Popover>
        }, {
            title: '参数',
            dataIndex: 'params',
            key: 'params',
            render: (text, record) => <a onClick={() => onShowJSON('参数', record.params)}>查看</a>
        }, {
            title: '响应',
            dataIndex: 'result',
            key: 'result',
            render: (text, record) => { return record.result ? <a onClick={() => onShowJSON('响应结果', record.result)}>查看</a> : '无' }
        }]
    return (
        <PageContainer >
            <ProTable<any>
                actionRef={actionRef}
                headerTitle="API访问日志"
                rowKey="id"
                search={false}
                scroll={{ x: 'max-content' }}
                request={async (params) => {
                    const result = await apiRequest('acc.apilog.list', params);
                    return {
                        total: result.data.total,
                        data: result.data.list,
                        success: true,
                    };
                }}
                toolBarRender={false}
                columns={columns}
            />
            <Modal
                title={state.title}
                visible={state.showModal}
                onCancel={onCancelModal}
                width={600}

            >

                <ReactJson style={{ wordBreak: "break-all" }} theme="monokai" displayDataTypes={false} src={state.content} name={null} />
            </Modal>
        </PageContainer>
    );
};

export default ListPage;

/**
 * 权限弹窗
 * @param {*} props 
 */
import { Drawer, Table, Alert, Row, Col, Button, Space } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'umi';
import { cloneDeep, remove } from 'lodash';
const page = props => {
    const [state, setState] = useState({
        roleList: []
    });
    const updateState = (d => {
        setState(prevState => {
            return {
                ...prevState,
                ...d
            }
        })
    })
    const dispatch = useDispatch();
    const roleListData = useSelector(state => state.role.data);
    /**
     * 获取全部角色
     */
    const fetchAllRoles = () => {
        dispatch({
            type: "role/list",
            payload: {
                appId: props.appId,
                limit: 1000
            }
        });
    }
    /**
     * 删除角色
     * @param {*} roleId 
     */
    const onRemoveRole = roleId => {
        const list = cloneDeep(state.roleList);
        remove(list, r => r.roleId === roleId);
        updateState({
            roleList: list
        })
    }
    /**
     * 添加角色
     * @param {*} record 
     */
    const onAddRole = record => {
        const list = cloneDeep(state.roleList);
        const finded = list.find(item => item.roleId === record.id);
        if (!finded) {
            list.push({
                roleId: record.id,
                roleName: record.name
            });
            // console.log('onAddRole', list, record);
            updateState({
                roleList: list
            })
        }

    }
    const userRoleColumns = [{
        dataIndex: 'roleName',
        title: '角色名称'
    }, {
        dataIndex: 'action',
        title: '操作',
        render: (text, record) => {
            return <a onClick={() => onRemoveRole(record.roleId)}>删除</a>
        }
    }]
    const roleColumns = [
        {
            dataIndex: 'name',
            title: '角色名称'
        },
        {
            dataKey: 'defaultAllow',
            title: '默认权限',
            width: 100,
            render: (text, record) => {
                return record.defaultAllow > 0 ? '允许' : '禁止'
            }
        }
    ];
    useEffect(() => {
        updateState({
            roleList: props.roleList
        })
    }, [props.roleList]);
    useEffect(() => {
        fetchAllRoles();
    }, []);

    const footer = <Space align='end' direction='horizontal' style={{ justifyContent: 'right', width: '100%' }}>
        <Button type="primary" onClick={() => props.onOk(state.roleList)}>确定</Button>
        <Button type="default" onClick={props.onClose}>关闭</Button>
    </Space>
    return <Drawer
        title='角色分配'
        width={600}
        visible={props.visible}
        onClose={props.onClose}
        footer={footer}
    >
        <Alert style={{ margin: "10px 0" }} type="info" message="提示：要添加角色请点左边的角色所在的行" showIcon />
        <Row gutter={20}>
            <Col xs={{ span: 12 }}>
                <Table
                    bordered
                    rowKey={r => r.id}
                    columns={roleColumns}
                    pagination={false}
                    dataSource={roleListData.list}
                    onRow={record => {
                        return {
                            onClick: () => onAddRole(record)
                        }
                    }} />
            </Col>
            <Col xs={{ span: 12 }}>
                <Table pagination={false}
                    bordered
                    rowKey={r => r.roleId}
                    columns={userRoleColumns}
                    pagination={false}
                    dataSource={state.roleList} />
            </Col>
        </Row>
    </Drawer>
}
export default page;
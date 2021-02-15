/**
 * 角色管理--角色列表界面
 * @author Donny
 *
 */
import React, { useState, useEffect } from "react";
import { history, useDispatch, Link, useSelector, useIntl } from "umi";
import { PlusOutlined } from '@ant-design/icons';
import { Table, Card, Button, Form, Divider, Modal, Affix } from "antd";
import PageHeaderWrapper from "../../../components/PageHeaderWrapper";
import RoleModal from "./RoleModal";
import styles from "../../common.less";
import DICT from "../../../dict";
import DropdownMenu from "./RoleDropdownMenu";
import { getCachedApp } from '@/utils/utils';
const { confirm } = Modal;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(",");

export default (props) => {
    const intl = useIntl();
    const {
        app,
        role
    } = useSelector(state => state);
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects["role/list"];
    const createLoading = loadingEffect.effects["role/create"];
    const updateLoading = loadingEffect.effects["role/update"];
    const [state, setState] = useState({
        appId: '',
        appName: ''
    });
    const dispatch = useDispatch();
    useEffect(() => {
        const { query } = props.location;
        //将当前的网址上的appId和appName缓存起来，如果网址没有这两参数，自动从缓存读取
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
            type: "role/list",
            payload: {
                appId: currentApp.id
            }
        });

        setState({
            appName: currentApp.name,
            appId: currentApp.id
        });
    }, []);
    /**
     * 关闭弹窗
     */
    const onCancelModal = () => {
        dispatch({
            type: "role/hideModal"
        });
    };
    /**
     * 点新建时
     */
    const onCreate = () => {
        dispatch({
            type: "role/showModal",
            payload: {
                modalType: "create"
            }
        });
    };
    /**
     * 点编辑时
     */
    const onEdit = record => {
        dispatch({
            type: "role/showModal",
            payload: {
                modalType: "update",
                editData: record
            }
        });
    };
    /**
     * 删除
     * @param record
     */
    const onDelete = record => {
        dispatch({
            type: "role/remove",
            payload: {
                id: record.id
            }
        });
    };

    /**
     * 点提交新建/编辑表单的OK键
     * @param e
     */
    const onSubmitForm = values => {
        dispatch({
            type: `role/${role.modalType}`,
            payload: { ...values, appId: state.appId }
        });
    };

    const handleTableChange = (pagination, filtersArg, sorter) => {
        dispatch({
            type: "role/list",
            payload: {
                page: pagination.current,
                limit: pagination.pageSize
            }
        });
    };
    const selectMenu = (record, e) => {
        switch (e.key) {
            case "assignMenu":

                history.push(
                    `/sys/rolelist/assign-role-menu/${record.id}`
                )

                break;
            case "assignResource":

                history.push(`/sys/rolelist/role-res/${record.id}`)

                break;
            case "delete":
                confirm({
                    title: "确定要删除这条记录?",
                    onOk: () => {
                        onDelete(record);
                    }
                });
                break;
            default:
                break;
        }
    };
    const { data, modalVisible, modalType, editData } = role;

    const modalProps = {
        item: modalType === "create" ? {} : editData,
        visible: modalVisible,
        title: modalType === "create" ? "新建角色" : "编辑角色",
        onOk: onSubmitForm,
        confirmLoading:
            modalType === "create" ? createLoading : updateLoading,
        onCancel: () => onCancelModal()
    };
    const paginationProps = {
        showTotal(total) {
            return `共 ${total} 条记录`;
        },
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: data.limit,
        current: data.page,
        total: data.total
    };

    // 表列定义
    const columns = [
        {
            title: "ID",
            key: "id",
            dataIndex: "id"
        },
        {
            title: "优先级",
            key: "priority",
            dataIndex: "priority"
        },
        {
            title: "角色名称",
            key: "name",
            dataIndex: "name"
        },
        {
            title: "用户数量",
            key: "cntUser",
            dataIndex: "cntUser",
            render: (text, record) => (
                <Link to={`/sys/rolelist/assign-role-users/${record.id}`}>
                    {record.cntUser}
                </Link>
            )
        },
        {
            title: "类型",
            key: "roleType",
            dataIndex: "roleType",
            render: (text, record) =>
                record.roleType == 1 ? "普通" : "超级管理员"
        },
        {
            title: "默认权限",
            key: "defaultAllow",
            dataIndex: "defaultAllow",
            render: (text, record) =>
                record.defaultAllow > 0 ? "允许" : "禁止"
        },
        {
            title: "分配策略",
            key: "assignPolicy",
            dataIndex: "assignPolicy",
            render: (text, record) => {
                if (
                    record.assignPolicy ==
                    DICT.ROLE_ASSIGN_POLICY_TO_LOGINED
                ) {
                    return "自动分配给登陆的会员";
                } else if (
                    record.assignPolicy ==
                    DICT.ROLE_ASSIGN_POLICY_TO_UNLOGINED
                ) {
                    return "自动分配给未登陆的会员";
                } else {
                    return "不自动分配";
                }
            }
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a onClick={() => onEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <DropdownMenu
                        onMenuClick={e => selectMenu(record, e)}
                        menuOptions={[
                            { key: "assignMenu", name: "分配菜单" },
                            { key: "assignResource", name: "分配资源" },
                            { key: "delete", name: "删除" }
                        ]}
                    />
                </span>
            )
        }
    ];

    return (
        <PageHeaderWrapper title={app.currentApp.name + "角色管理"}>
            <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={onCreate}
                        >
                            {intl.formatMessage({ id: "form.new" })}
                        </Button>
                        <Divider />
                    </div>
                </Affix>
                <div className={styles.tableList}>
                    <Table
                        rowKey={record => record.id}
                        loading={loading}
                        dataSource={data.list}
                        columns={columns}
                        onChange={handleTableChange}
                        pagination={paginationProps}
                    />
                </div>
            </Card>
            {modalVisible && <RoleModal {...modalProps} />}
        </PageHeaderWrapper>
    );
}


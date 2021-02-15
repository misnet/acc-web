/**
 * 系统管理--菜单列表界面
 * @author Donny
 *
 */
import React, { useEffect } from "react";
import { PlusOutlined } from '@ant-design/icons';
import { Table, Form, Card, Affix, Popconfirm, Button, Divider } from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import MenuModal from "./MenuModal";
import styles from "../common.less";
import { getCachedApp } from '@/utils/utils';
import { useSelector, useDispatch, history, useIntl } from 'umi';


export default (props) => {
    const intl = useIntl();
    const loadingEffect = useSelector(state => state.loading);
    const createLoading = loadingEffect.effects["menu/create"];
    const updateLoading = loadingEffect.effects["menu/update"];
    const loading = loadingEffect.effects["menu/menuList"];
    const app = useSelector(state => state.app);
    const menu = useSelector(state => state.menu);
    const getValue = obj =>
        Object.keys(obj)
            .map(key => obj[key])
            .join(",");
    const dispatch = useDispatch();
    useEffect(() => {
        const { query } = props.location;
        const currentApp = getCachedApp(query);
        if (!currentApp) {
            history.push("/exception/404");
            return;
        } else {
            dispatch({
                type: "app/setCurrentApp",
                payload: currentApp
            });
        }
        dispatch({
            type: "menu/menuList"
        });
    }, []);

    /**
     * 关闭弹窗
     */
    const onCancelModal = () => {
        dispatch({
            type: "menu/hideModal"
        });
    };
    /**
     * 点新建时
     */
    const onCreate = () => {
        dispatch({
            type: "menu/showModal",
            payload: {
                modalType: "create"
            }
        });
    };
    /**
     * 点编辑菜单时
     */
    const onEdit = record => {
        dispatch({
            type: "menu/showModal",
            payload: {
                modalType: "update",
                editMenu: record
            }
        });
    };
    /**
     * 删除用户
     * @param record
     */
    const onDelete = record => {
        dispatch({
            type: "menu/deleteMenu",
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
            type: `menu/${menu.modalType}`,
            payload: { ...values, appId: app.currentApp.id }
        });
    };
    const handleTableChange = (pagination, filtersArg, sorter) => {

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = getValue(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            ...filters
        };
        dispatch({
            type: "menu/menuList",
            payload: params
        });
    };
    const { data, modalVisible, modalType, editMenu } = menu;


    const modalProps = {
        item: modalType === "create" ? {} : editMenu,
        visible: modalVisible,
        title: modalType === "create" ? "新建菜单" : "编辑菜单",
        onOk: onSubmitForm,
        menuList: data,
        confirmLoading:
            modalType === "create" ? createLoading : updateLoading,
        onCancel: () => onCancelModal()
    };
    // 表列定义
    const columns = [
        {
            title: "菜单名",
            dataIndex: "name",
            key: "name",
            render: (text, record) => (
                <span>
                    <span>{record.name}</span>
                </span>
            )
        },
        {
            title: "ID",
            dataIndex: "id",
            key: "id"
        },
        {
            title: "链接",
            key: "link",
            render: (text, record) => record.url
        },
        {
            title: "显示",
            dataIndex: "display",
            key: "display",
            render: (text, record) =>
                record.display === 1 ? "显示" : "隐藏"
        },
        {
            title: "排序权重",
            key: "sortByWeight",
            render: (text, record) => record.sortByWeight
        },
        {
            title: "操作",
            key: "action",
            render: (text, record) => (
                <span>
                    <a onClick={() => onEdit(record)}>编辑</a>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="菜单删除时，子菜单也会被一起删除，确定要删除这个菜单?"
                        placement="left"
                        onConfirm={() => onDelete(record)}
                    >
                        <a>删除</a>
                    </Popconfirm>
                </span>
            )
        }
    ];

    return (
        <PageHeaderWrapper title={app.currentApp.name + "菜单管理"}>
            <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>
                        <div className={styles.navToolbar}>
                            <Button
                                icon={<PlusOutlined />}
                                type="primary"
                                onClick={onCreate}
                            >
                                {intl.formatMessage({ id: "form.new" })}
                            </Button>
                        </div>
                        <Divider />
                    </div>
                </Affix>
                <div className={styles.tableList}>
                    <Table
                        rowKey={record => record["id"]}
                        pagination={false}
                        loading={loading}
                        dataSource={data}
                        columns={columns}
                        onChange={handleTableChange}
                    />
                </div>
            </Card>
            {modalVisible && <MenuModal {...modalProps} />}
        </PageHeaderWrapper>
    );
}

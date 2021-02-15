/**
 * 角色管理--给角色分配菜单访问界面
 * @author Donny
 *
 */
import React, { useEffect, useState } from 'react';
import { history, useSelector, useDispatch, useIntl } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Spin, Form, Tree, Button, Affix, Divider } from 'antd';
import { union } from 'lodash';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from '../../common.less';
import { getCachedApp } from '@/utils/utils';

export default (props) => {
    const intl = useIntl();
    const { app,
        menu,
        assignMenus } = useSelector(state => state);
    const dispatch = useDispatch();
    const loadingEffect = useSelector(state => state.loading);
    const assignLoading = loadingEffect.effects['assignMenus/assign'];
    const loading = loadingEffect.effects['menu/menuList'];
    const [state, setState] = useState({
        checkedMenuIds: { checked: [], halfChecked: [] },
        expandedMenuIds: [],
    });
    const { params } = props.match;
    useEffect(() => {
        //将当前的网址上的appId和appName缓存起来，如果网址没有这两参数，自动从缓存读取
        const currentApp = getCachedApp({});
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
            type: 'menu/menuList',
            payload: { rid: params.rid },
        }).then(r => {
            console.log(r);
        })
    }, []);


    // 选中了某菜单
    const onCheckMenu = (checkKeys, e) => {
        const checkedKeys = union(checkKeys, e.halfCheckedKeys);
        const { match: { params } } = props;
        dispatch({
            type: 'assignMenus/assign',
            payload: { rid: params.rid, menuIds: checkedKeys.join(',') },
        });
    };

    const returnBack = () => {
        history.push('/sys/rolelist/index');
    };
    const data = menu.data;
    // 从数据中分离出checked和halfChecked
    let checkedMenuIds = { checked: [], halfChecked: [] };
    const expandedMenuIds = [];

    data.map(record => {
        let noneCheckedLength = 0;
        expandedMenuIds.push(record.id + '');
        if (record.children) {
            noneCheckedLength = record.children.length;
            record.children.map(childItem => {
                if (childItem.allow && childItem.allow > 0) {
                    noneCheckedLength--;
                    checkedMenuIds.checked.push(childItem.id + '');
                }
                expandedMenuIds.push(childItem.id + '');
            });
        }
        if (record.allow && record.allow > 0) {
            if (noneCheckedLength == 0) {
                checkedMenuIds.checked.push(record.id + '');
            } else {
                checkedMenuIds.halfChecked.push(record.id + '');
            }
        }
    });

    // data.map(record => {
    //     expandedMenuIds.push(record.id+'');
    //     if (record.children) {
    //         record.children.map(childItem => {
    //             expandedMenuIds.push(childItem.id+ '');
    //         });
    //     }
    // });
    return (
        <PageHeaderWrapper title="分配菜单">
            <Card bordered={false}>
                <Affix offsetTop={64} className={styles.navToolbarAffix}>
                    <div className={styles.navToolbar}>

                        <Button icon={<ArrowLeftOutlined />} onClick={returnBack}>
                            {intl.formatMessage({ id: 'form.return' })}
                        </Button>
                        <Divider />
                    </div>
                </Affix>

                <Spin spinning={loading} size="large">
                    <Tree
                        checkable
                        onCheck={onCheckMenu}
                        expandedKeys={expandedMenuIds}
                        checkedKeys={checkedMenuIds.checked}
                        treeData={data.map(record => {
                            const node = {
                                title: record.name,
                                key: record.id + '',
                                children: []
                            }
                            if (record.children) {
                                record.children.map(submenu => {
                                    node.children.push({
                                        title: submenu.name,
                                        key: submenu.id + ''
                                    })
                                })
                            }
                            return node;
                        })}
                    >

                    </Tree>
                </Spin>
            </Card>
        </PageHeaderWrapper>
    );
}
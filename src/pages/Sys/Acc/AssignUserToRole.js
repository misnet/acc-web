/**
 * 角色管理--角色分配给用户界面
 * @author Donny
 *
 */
import React, { useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Spin, Form, Transfer, Button } from 'antd';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import styles from './Assign.less';
import { getCachedApp } from '@/utils/utils';
import { history, useDispatch, useSelector } from 'umi';

export default () => {
    const assignUsers = useSelector(state => state.assignUsers);
    const loadingEffect = useSelector(state => state.loading);
    const loading = loadingEffect.effects['assignUsers/list'];
    const dispatch = useDispatch();
    useEffect(() => {
        const { params } = props.match;
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
            type: 'assignUsers/list',
            payload: { rid: params.rid, appId: currentApp.id },
        });
    }, []);

    /**
     * 分配或取消分配操作
     * @param tagetKeys
     * @param direction
     * @param moveKeys
     */
    const onTransferChange = (tagetKeys, direction, moveKeys) => {
        const dire = direction === 'right' ? 'assign' : 'unassign';
        const uids = direction === 'right' ? tagetKeys : moveKeys;
        dispatch({
            type: `assignUsers/${dire}`,
            payload: { uid: uids.join(','), rid: params.rid },
        });
    };
    const { data: { assigned, unassigned } }
        = assignUsers;
    const chosenList = [];
    if (Array.isArray(assigned) && assigned.length > 0) {
        for (let i = 0; i < assigned.length; i++) {
            chosenList.push(assigned[i].uid);
        }
    }
    const returnBack = () => {
        history.push('/sys/rolelist/index');
    };
    return (
        <PageHeaderWrapper title="分配用户">
            <Card bordered={false}>
                <div className={styles.operatorSection}>
                    <Button icon={<ArrowLeftOutlined />} type="primary" onClick={returnBack}>
                        返回
                        </Button>
                </div>

                <Spin spinning={loading} size="large">
                    <Transfer
                        titles={['未分配的用户', '已分配的用户']}
                        rowKey={record => record.uid}
                        dataSource={unassigned}
                        render={record => (record.username ? record.username : '')}
                        targetKeys={chosenList}
                        onChange={onTransferChange}
                    />
                </Spin>
            </Card>
        </PageHeaderWrapper>
    );
}
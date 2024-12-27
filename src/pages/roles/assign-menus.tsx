import { apiRequest } from "@/utils/utils";
import { PageContainer } from "@ant-design/pro-components";
import { useSearchParams, history } from "@umijs/max";
import { App, Button, Tree } from "antd";
import { useEffect, useRef, useState } from "react";
import { union } from 'lodash';

const Page: React.FC = () => {
    const { message } = App.useApp();
    const dataRef = useRef();
    const [searchParams] = useSearchParams();
    const roleId = searchParams.get('rid');

    const appId = searchParams.get('appId');
    const appName = searchParams.get('appName');
    const [state, setState] = useState({
        expandedMenuIds: [],
        checkedMenuIds: [],
        data: []
    });
    const formatMenuData = (data: any) => {
        if (data) {
            return data.map((item: any) => {
                const children = formatMenuData(item.children);
                if (Array.isArray(children) && children.length > 0) {
                    item.children = children;
                } else {
                    delete (item?.children);
                }
                return {
                    title: item.name + '[' + item.id + ']',
                    key: item.id + '',
                    children: item.children
                };
            });
        }
        return [];
    }
    const allKeys = (data: any) => {
        if (data) {
            return data.map((item: any) => {
                const keys = allKeys(item.children);
                if (Array.isArray(keys) && keys.length > 0) {
                    return [item.id + '', ...keys];
                }
                return [item.id + ''];
            }).flat();
        }
        return [];
    }
    const getCheckedKeys = (data: any, m: Array<string>) => {
        data.map(record => {
            if (record.children) {
                getCheckedKeys(record.children, m);
            }
            if (record.allow && record.allow === 'y') {
                m.push(record.id + '');
            }
        });
    }
    useEffect(async () => {
        if (roleId) {
            const response = await apiRequest('acc.menu.list', { rid: roleId, appId });
            console.log(response);
            if (response.success) {
                let m = [];
                getCheckedKeys(response.data, m);
                setState(prev => ({
                    ...prev,
                    checkedMenuIds: m,
                    expandedMenuIds: allKeys(response.data),
                    data: formatMenuData(response.data)
                }));
            } else {
                message.error(response.message || '获取菜单失败');
                setState(prev => ({ ...prev, data: [] }))
            }
        }
    }, [roleId]);
    const onCheckMenu = async (keys, e) => {

        const checkedKeys = union(keys, e.halfCheckedKeys);
        //checkedKeys提交服务端
        const response = await apiRequest('acc.role.assignmenu', {
            rid: roleId,
            appId,
            menuIds: checkedKeys.join(',')
        });
        if (response.success) {
            message.success('菜单分配成功');
        } else {
            message.error(response.message || '菜单分配失败');
        }
        setState(prev => ({
            ...prev,
            checkedMenuIds: keys
        }))
    }
    const onBack = () => {
        location.href = '/roles?appId=' + appId + '&appName=' + (appName ? encodeURIComponent(appName) : '');
        // history.push('/roles');
    }
    return <PageContainer title={appName ? `应用[${appName}]——分配菜单` : '分配菜单'} extra={[
        <Button type="primary" key="return" onClick={onBack}>返回</Button>
    ]}>
        <Tree
            checkable
            defaultExpandAll
            onCheck={onCheckMenu}
            expandedKeys={state.expandedMenuIds}
            checkedKeys={state.checkedMenuIds}

            treeData={state.data}
        ></Tree>
    </PageContainer>

}
export default Page;
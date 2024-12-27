import { apiRequest } from "@/utils/utils";
import { DrawerForm, ProFormCascader, ProFormCheckbox, ProFormDigit, ProFormRadio, ProFormText } from "@ant-design/pro-components";
import { useEffect, useRef } from "react";
import { cloneDeep } from 'lodash';
interface EditDrawerProps {
    dataSource: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFinish: (values: any) => void;
    appId?: number;
}
const EditDrawer: React.FC<EditDrawerProps> = (props) => {
    const frmRef = useRef();
    useEffect(() => {
        setTimeout(() => {

            if (props.dataSource) {
                frmRef.current?.setFieldsValue(props.dataSource);
            } else {
                frmRef.current?.resetFields();
            }
        }, 100);
    }, [props.dataSource]);

    const formatMenuData = (data: any) => {
        if (data) {
            return data.map((item: any) => {

                const current = cloneDeep(item);
                console.log('item.children', item.children);
                const children = formatMenuData(item.children);
                if (Array.isArray(children) && children.length > 0) {
                    //current放在children第一个
                    item.children = children;
                    item.children.unshift({
                        label: '--' + current.name + '--',
                        value: current.id
                    });
                }
                return {
                    label: item.name,
                    value: item.id,
                    children: item.children
                };
            });
        }
        return [];
    }
    return <DrawerForm
        formRef={frmRef}
        open={props.open}
        onOpenChange={props.onOpenChange}
        width={360}
        title={props.dataSource ? '编辑菜单' : '新增菜单'}
        onFinish={props.onFinish}
        initialValues={{
            defaultAllow: 0,
            priority: 0,
            roleType: 1,
            assignPolicy: 0
        }}
    >
        <ProFormText name="name" label="菜单名称" rules={[{
            required: true,
            message: '请输入菜单名称',
        }]} fieldProps={{ maxLength: 20 }} />

        <ProFormText name="url" label="链接地址" rules={[{
            required: true,
            message: '请输入链接地址',
        }]} fieldProps={{ maxLength: 200 }} />
        <ProFormCascader name="parentId" label="上级菜单" request={async () => {
            const response = await apiRequest('acc.menu.list', { appId: props.appId });
            if (response.success) {
                return formatMenuData(response.data);
            }
            return [];
        }} placeholder={'不选择表示顶级菜单'} />
        <ProFormDigit name="sortByWeight" label="排序权重" rules={[{
            required: true,
            message: '请输入排序权重',
        }]} fieldProps={{ maxLength: 20 }} />
        <ProFormRadio.Group name="display" label="显示" options={[{
            label: '显示',
            value: 'y'
        }, {
            label: '隐藏',
            value: 'n'
        }]} />
    </DrawerForm>
}
export default EditDrawer;
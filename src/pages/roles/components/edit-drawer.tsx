import { DICT } from "@/constants";
import { DrawerForm, ProFormCheckbox, ProFormDigit, ProFormRadio, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { useEffect, useRef } from "react";

interface EditDrawerProps {
    dataSource: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFinish: (values: any) => void;
}
const EditDrawer: React.FC<EditDrawerProps> = (props) => {
    const frmRef = useRef();
    useEffect(() => {
        setTimeout(() => {

            if (props.dataSource) {
                frmRef.current?.setFieldsValue({
                    ...props.dataSource,
                    defaultAllow: props.dataSource.defaultAllow === 'y',
                });
            } else {
                frmRef.current?.resetFields();
            }
        }, 100);
    }, [props.dataSource]);
    return <DrawerForm
        formRef={frmRef}
        open={props.open}
        onOpenChange={props.onOpenChange}
        width={300}
        title={props.dataSource ? '编辑角色' : '新增角色'}
        onFinish={props.onFinish}
        initialValues={{
            defaultAllow: false,
            priority: 0,
            roleType: 1,
            assignPolicy: 0
        }}
    >
        <ProFormText name="name" label="角色名称" rules={[{
            required: true,
            message: '请输入角色名称',
        }]} fieldProps={{ maxLength: 20 }} />

        <ProFormRadio.Group name="roleType" label="类型" rules={[
            {
                required: true,
                message: '请选择类型'
            }
        ]} options={DICT.ROLE_TYPES} />
        <ProFormRadio.Group name="assignPolicy" label="分配策略" rules={[
            {
                required: true,
                message: '请选择分配策略'
            }
        ]} options={DICT.ROLE_ASSIGN_POLICY} />
        <ProFormDigit name="priority" label="优先级" rules={[{
            required: true,
            message: '请输入优先级',
        }]} fieldProps={{ maxLength: 20 }} />
        <ProFormCheckbox name="defaultAllow" label="默认允许" />
    </DrawerForm>
}
export default EditDrawer;
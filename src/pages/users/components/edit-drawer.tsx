import { apiRequest } from "@/utils/utils";
import { DrawerForm, ProFormCheckbox, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
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
                frmRef.current?.setFieldsValue(props.dataSource);
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
        title={props.dataSource ? '编辑用户' : '新增用户'}
        onFinish={props.onFinish}
    >
        <ProFormText name="username" label="用户名" rules={[{
            required: true,
            message: '请输入用户名',
        }]} fieldProps={{ maxLength: 50 }} />
        <ProFormText.Password name="password" label="密码" rules={[
            {
                required: !props.dataSource?.uid,
                message: '请输入密码',
            },
            {
                min: 6,
                message: '密码最少6位',
            }
        ]} placeholder={props.dataSource?.uid ? '如不修改请放空' : '请填写密码'} />
        <ProFormText name="fullname" label="姓名" rules={[
            {
                required: true,
                message: '请输入姓名'
            }
        ]} />
        <ProFormText name="mobile" label="手机号" rules={[{
            pattern: /^(13|15|17|18|19)([0-9]{9})$/,
            message: "请输入正确手机号码"
        }]} />
        <ProFormText name="email" label="Email" rules={[
            {
                type: 'email',
                message: '请输入正确的Email地址'
            }
        ]} />
        <ProFormTextArea name="memo" label="备注" fieldProps={{
            maxLength: 100,
            showCount: true
        }} />
        <ProFormCheckbox.Group name="appIds" label="应用" rules={[
            {
                type: "array",
                required: true,
                min: 1,
                message: '至少选择1个应用'
            },
        ]}
            request={async () => {
                const response = await apiRequest('acc.app.list', {
                    pageSize: 100,
                    current: 1
                });
                if (response.success) {
                    return response.data.list.map(item => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    });
                }
                return [];
            }} />
    </DrawerForm>
}
export default EditDrawer;
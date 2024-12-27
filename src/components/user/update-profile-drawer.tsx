import { apiRequest, getCacheData } from "@/utils/utils";
import { DrawerForm, ProFormText } from "@ant-design/pro-components";
import { useModel } from "@umijs/max";
import { useEffect, useRef } from "react";
import md5 from 'crypto-js/md5';
import { App } from "antd";
import { SYS_CONFIG } from "@/constants";
interface UpdateProfileDrawerProps {
    open: boolean;
    onOpenChange: (visible: boolean) => void;
}
const UpdateProfileDrawer: React.FC<UpdateProfileDrawerProps> = (props) => {
    const { message } = App.useApp();
    let userInfo = getCacheData('userInfo', { type: 'local' });
    const { updateUserInfo } = useModel('user');
    const frm = useRef();
    useEffect(() => {
        setTimeout(() => {
            frm.current?.setFieldsValue(userInfo);
        }, 100);
    }, [userInfo]);
    const onFinish = async (values) => {
        delete values.username;
        if (values.password && SYS_CONFIG.passwordHashByMd5) {
            values.password = md5(values.password).toString();
        }
        if (values.repassword && SYS_CONFIG.passwordHashByMd5) {
            values.repassword = md5(values.repassword).toString();
        }
        const response = await apiRequest('acc.user.profile.update', values);
        if (response.success) {
            const { fullname, mobile, email } = values;
            updateUserInfo({ fullname, mobile, email });
            props.onOpenChange(false);
            message.success('修改成功');
        } else {
            message.error(response.message || '修改失败');
        }
    }
    return <DrawerForm formRef={frm} width={400} title='修改资料' open={props.open} onOpenChange={props.onOpenChange} onFinish={onFinish}>
        <ProFormText name='username' label='用户名' disabled readonly />
        <ProFormText name='fullname' label='姓名' rules={[
            {
                required: true,
                message: '请输入姓名'
            }
        ]} />
        <ProFormText.Password name='password' label='新密码' rules={[
            {
                min: 6,
                message: '密码最少6位',
            }
        ]} placeholder={'如不修改请放空'} />
        <ProFormText.Password name='repassword' label='确认密码' rules={[
            {
                min: 6,
                message: '确认密码最少6位',
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('确认密码和新密码不一致!'));
                },
            }),
        ]} placeholder={'如不修改请放空'} dependencies={['password']} />
        <ProFormText name='mobile' label='手机号' rules={[
            {
                pattern: /^(13|15|17|18|19)([0-9]{9})$/,
                message: "请输入正确手机号码"
            }
        ]} />
        <ProFormText name='email' label='邮箱' rules={[
            {
                type: 'email',
                message: '请输入正确的Email地址'
            }
        ]} />
    </DrawerForm>
}
export default UpdateProfileDrawer;
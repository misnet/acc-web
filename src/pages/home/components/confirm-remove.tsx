import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { useEffect, useRef } from "react";
interface ConfirmRemoveModalProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    onConfirm: (v: any) => void;
}
const ConfirmRemoveModal: React.FC<ConfirmRemoveModalProps> = ({ open, onOpenChange, onConfirm }) => {
    const frm = useRef();
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                frm.current?.resetFields();
            }, 100);
        }
    }, [open])
    return (
        <ModalForm
            formRef={frm}
            width={370}
            title="确认删除"
            open={open}
            onOpenChange={onOpenChange}
            onFinish={onConfirm}
        >
            <ProFormText
                name="secret"
                label=""
                placeholder="请输入要删除的应用秘钥"
                rules={[{ required: true, message: '请输入要删除的应用秘钥' }]} />
        </ModalForm>
    )
}
export default ConfirmRemoveModal;
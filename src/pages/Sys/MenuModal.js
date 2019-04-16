import {Form, Input, Select, Modal, Checkbox,InputNumber} from 'antd';
import React from 'react';
import PropTypes from 'prop-types'
const FormItem = Form.Item;
const menuModal = ({
       item = {},
       onOk,
       menuList = {},
       form: {
           getFieldDecorator,
           validateFields,
           getFieldsValue,
       },
       ...modalProps
    }) => {
    const submitForm = ()=>{
        validateFields((err) => {
            if (!err) {
                onOk({...getFieldsValue()});
            }
        });
    }
    const modalOpts = {
        onOk:submitForm,
        ...modalProps,
    }
    return (
        <Modal
            {...modalOpts}
        >
            <FormItem
                labelCol={{span: 5}}
                wrapperCol={{span: 15}}
                label="菜单名称"
            >
                {getFieldDecorator('name', {
                    initialValue: item.name,
                    rules: [
                        {
                            required: true,
                            message: '请输入菜单名称',
                        },
                    ],
                })(
                    <Input placeholder="请输入" maxLength={50}/>
                )}

            </FormItem>
            <FormItem
                labelCol={{span: 5}}
                wrapperCol={{span: 15}}
                label="链接"
            >

                {getFieldDecorator('url', {
                    initialValue: item.url,
                    rules: [
                        {
                            required: true,
                            message: '请输入菜单链接地址',
                        },
                    ],
                })(
                    <Input placeholder="请输入" maxLength={100}/>
                )}
            </FormItem>
            <FormItem
                labelCol={{span: 5}}
                wrapperCol={{span: 15}}
                label="父级菜单"
            >
                {getFieldDecorator('parentId', {
                initialValue: item.parentId,
                })(
                <Select
                    style={{width: '100%'}}
                >
                    <Select.Option value="0">--选择上级菜单--</Select.Option>
                    {menuList.map((opt, e) => {
                        let optionComponent = [];
                        optionComponent.push(<Select.Option value={opt.id}>{opt.name}</Select.Option>)

                        return optionComponent;
                    })}
                </Select>
                )}

            </FormItem>
            <FormItem
                labelCol={{span: 5}}
                wrapperCol={{span: 15}}
                label="显示/隐藏"
            >{getFieldDecorator('display', {
                initialValue:item.display>0,
                valuePropName:'checked'
            })(
              <Checkbox defaultChecked={item.display > 0} name="display">显示</Checkbox>
            )}
            </FormItem>

            <FormItem
                labelCol={{span: 5}}
                wrapperCol={{span: 15}}
                label="排序权重"
            >
                {getFieldDecorator('sortByWeight', {
                    initialValue: item.sortByWeight?item.sortByWeight:0,
                    rules: [
                        {
                            required: true,
                            message: '请输入权重值，0-99999之间任意数字，数字越大排序越前面',
                        },
                    ],
                })(
                    <InputNumber min={0} max={99999} placeholder="请输入" maxLength={5}/>
                )}
            </FormItem>
        </Modal>
    );
}
menuModal.propTypes = {
    form: PropTypes.object.isRequired,
    type: PropTypes.string,
    item: PropTypes.object,
    onOk: PropTypes.func
}
export default Form.create()(menuModal);

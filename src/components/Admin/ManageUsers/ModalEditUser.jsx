import { Divider, Input, Modal, Form, Row, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { putUpdateUser } from '../../../services/api';

const ModalEditUser = (props) => {

    const { open, setOpen, dataEditUser, handleReLoad } = props;
    const [form] = Form.useForm()
    const [isSubmit, setIsSubmit] = useState(false)

    useEffect(() => {
        form.setFieldsValue({
            _id: dataEditUser._id,
            email: dataEditUser.email,
            fullName: dataEditUser.fullName,
            phone: dataEditUser.phone,
        });
    }, [dataEditUser]);

    const onFinish = async (values) => {
        setIsSubmit(true)
        const { _id, fullName, phone } = values;
        const res = await putUpdateUser(_id, fullName, phone);
        if (res && res.data) {
            message.success('Cập nhật người dùng thành công');
            handleReLoad();
            setOpen(false);
            setIsSubmit(false)
        } else {
            message.error(res.message)
        }
    }

    return (
        <>
            <Modal
                forceRender
                maskClosable={false}
                title="CẬP NHẬT NGƯỜI DÙNG"
                open={open}
                onOk={() => form.submit()}
                onCancel={() => setOpen(false)}
                confirmLoading={isSubmit}
                okText="Cập nhập"
                cancelText="Hủy"
                centered
            >
                <Divider />
                <Form
                    form={form}
                    name='edit-user'
                    onFinish={onFinish}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        hidden
                        labelCol={{ span: 24 }} //whole column
                        label="id"
                        name="_id"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Email"
                        name="email"
                    >
                        <Input disabled style={{ color: '#000000e0', backgroundColor: '#ffffff' }} />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập Tên hiển thị!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        labelCol={{ span: 24 }} //whole column
                        label="Số điện thoại"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập số điện thoại!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal >
        </>
    );
}

export default ModalEditUser;


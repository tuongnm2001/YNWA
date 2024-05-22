import React, { useState } from 'react';
import { Button, Modal, Form, Row, Col, Input, Divider, message, notification } from 'antd';
import useFormInstance from 'antd/es/form/hooks/useFormInstance';
import { postAddNewUser } from '../../../services/api';

const ModalAddUser = (props) => {
    const { open, setOpen, handleReLoad } = props;
    const [isSubmit, setIsSubmit] = useState(false)
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            await form.validateFields(); // Kiểm tra các trường dữ liệu trong form
            const formData = form.getFieldsValue();
            const { fullName, password, email, phone } = formData;
            setIsSubmit(true)
            const res = await postAddNewUser(fullName, password, email, phone);
            if (res && res.data) {
                message.success("Thêm người dùng thành công ")
                // notification.success({
                //     description: ("Thêm người dùng thành công ")
                // })
                handleReLoad();
                // setOpen(false);
                handleCancel();
                setIsSubmit(false)
            } else {
                message.error(res.message)
                setIsSubmit(false)
            }
        } catch (errorInfo) {
            console.log('Validation failed:', errorInfo);
            // Nếu có lỗi, bạn có thể hiển thị thông báo hoặc thực hiện các hành động khác
            message.error('Vui lòng điền đầy đủ thông tin và đúng định dạng');
        }
    };

    const handleCancel = () => {
        form.resetFields()
        setOpen(false);
    };

    return (
        <>

            <Modal
                title="THÊM MỚI NGƯỜI DÙNG"
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                maskClosable={false}
                width={600}
                confirmLoading={isSubmit}
                centered
                okText="Thêm mới"
                cancelText="Hủy"
            >
                <Divider />
                <Form
                    name="add-new-user"
                    autoComplete="off"
                    form={form}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Tên hiển thị "
                                name="fullName"
                                rules={[{ required: true, message: 'Vui lòng nhập Tên hiển thị của bạn !' }]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Vui lòng nhập email của bạn !' }]}
                            >
                                <Input width={400} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu của bạn !' }]}
                            >
                                <Input.Password width={400} />
                            </Form.Item>
                        </Col>

                        <Col span={24}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Số điện thoại"
                                name="phone"
                                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn !' }]}
                            >
                                <Input width={400} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};
export default ModalAddUser;
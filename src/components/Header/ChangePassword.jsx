import { Button, Form, Input, message, notification } from 'antd';
import './ChangePassword.scss'
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { postUserChangePassword } from '../../services/api';

const ChangePassword = () => {

    const [form] = useForm();
    const user = useSelector(state => state.account.user);

    const onFinish = async (values) => {
        const { email, oldPassword, newPassword } = values;

        const res = await postUserChangePassword(email, oldPassword, newPassword);
        console.log(res);
        if (res && res.data) {
            message.success("Đổi mật khẩu thành công");
            form.setFieldValue('oldPassword', '')
            form.setFieldValue('newPassword', '')
        } else {
            notification.error({
                message: "Đổi mật khẩu thất bại",
                description: res.message
            })
        }
    }

    return (
        <div className='change-password-container'>
            <div className='change-password-content'>
                <Form
                    className='form-change-password'
                    form={form}
                    name='form-change-password'
                    onFinish={onFinish}
                    initialValues={{
                        email: user.email
                    }}
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        labelCol={{ span: 24 }} //whole column
                        rules={[{ required: true, message: 'Vui lòng nhập Email của bạn !' }]}
                    >
                        <Input disabled style={{ color: '#000000e0', backgroundColor: '#ffffff' }} />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu hiện tại"
                        name="oldPassword"
                        labelCol={{ span: 24 }} //whole column
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại của bạn !' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu mới"
                        name="newPassword"
                        labelCol={{ span: 24 }} //whole column
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới của bạn !' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Button
                        type='primary'
                        onClick={() => form.submit()}
                        className='btn-change-password'
                    >
                        Cập nhật
                    </Button>

                </Form>
            </div>
        </div >
    );
}

export default ChangePassword;
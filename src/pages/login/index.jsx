import { Button, Divider, Form, Input, message, notification } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { login } from '../../services/api';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const LoginPage = () => {

    const navigate = useNavigate();
    const [isSubmit, setIsSubmit] = useState(false);
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        const { email, password } = values
        setIsSubmit(true)
        const res = await login(email, password)
        if (res && res.statusCode === 201) {
            localStorage.setItem('access_token', res.data.access_token)
            dispatch(doLoginAction(res.data.user))
            message.success('Đăng nhập thành công')
            setIsSubmit(false)
            navigate('/')
        } else {
            setIsSubmit(false)
            notification.error({
                message: 'Có lỗi xảy ra',
                description:
                    res.message,
                duration: 5
            })
        }
    };


    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Đăng Nhập</h2>
                            <Divider />
                        </div>
                        <Form
                            name="login"
                            // style={{ maxWidth: 600, margin: '0 auto' }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Email"
                                name="email"
                                rules={[{ required: true, message: 'Vui lòng nhập email của bạn !' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Mật khẩu"
                                name="password"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu của bạn !' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                            // wrapperCol={{ offset: 6, span: 16 }}
                            >
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Đăng Nhập
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <p className="text text-normal">Chưa có tài khoản ?
                                <span>
                                    <Link to='/register' > Đăng Ký </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default LoginPage;
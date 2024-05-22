import { Avatar, Button, Col, Form, Input, Row, Upload, message, notification } from "antd";
import './UserInfo.scss'
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import { useState, useEffect } from "react";
import { postUploadAvatar, putUpdateInfo } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { doUpdateUserInfoAction, doUploadAvatarAction } from "../../redux/account/accountSlice";

const UserInfo = () => {

    const [form] = useForm();
    const dispatch = useDispatch();
    const tempAvatar = useSelector(state => state.account.tempAvatar);
    const user = useSelector(state => state.account.user);
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "");

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${tempAvatar || user.avatar}`;

    useEffect(() => {
        if (tempAvatar) {
            setUserAvatar(tempAvatar);
        }
    }, [tempAvatar]);

    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        try {
            const res = await postUploadAvatar(file);
            if (res && res.data) {
                const newAvatar = res.data.fileUploaded;
                dispatch(doUploadAvatarAction({ avatar: newAvatar }));
                setUserAvatar(newAvatar);
                onSuccess("OK");
                message.success(`Tải ảnh thành công`);
            } else {
                onError("Error");
                message.error(`Tải ảnh thất bại.`);
            }
        } catch (error) {
            onError(error);
            message.error(`Tải ảnh thất bại.`);
        }
    }

    const props = {
        maxCount: 1,
        multiple: false,
        customRequest: handleUploadAvatar,
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                // Handle successful upload here if needed
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onFinish = async (values) => {
        const { _id, fullName, phone } = values;
        const res = await putUpdateInfo(_id, userAvatar, phone, fullName)
        if (res && res.data) {
            dispatch(doUpdateUserInfoAction({ avatar: userAvatar, phone, fullName }))

            message.success('Cập nhật thông tin người dùng thành công!')
            localStorage.removeItem('access_token')
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra ',
                description: res.message
            })
        }
    }

    return (
        <Row gutter={16}>
            <Col className="gutter-row" md={10}>
                <div className="content-left-user-info">
                    <Avatar size={150} src={urlAvatar} alt="" className="avatar" />

                    <Upload
                        {...props}
                        showUploadList={false}
                    >
                        <Button
                            className="btn-DoiAnh"
                            icon={<UploadOutlined />}
                        >
                            Đổi ảnh
                        </Button>
                    </Upload>
                </div>
            </Col>

            <Col className="gutter-row" md={14}>
                <div className="content-right-user-info">
                    <Form
                        onFinish={onFinish}
                        name="user-info"
                        autoComplete="off"
                        form={form}
                        initialValues={{
                            _id: user.id,
                            email: user.email, // Gán giá trị email từ Redux vào Form
                            fullName: user.fullName, // Gán giá trị fullName từ Redux vào Form
                            phone: user.phone, // Gán giá trị phone từ Redux vào Form
                        }}
                    >
                        <Form.Item
                            labelCol={{ span: 24 }} //whole column
                            label="Id"
                            name="_id"
                            hidden
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: 'Vui lòng nhập Email của bạn !' }]}
                        >
                            <Input disabled style={{ color: '#000000e0', backgroundColor: '#ffffff' }} />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Tên hiển thị"
                            name="fullName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên hiển thị của bạn !' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            labelCol={{ span: 24 }}
                            label="Số điện thoại"
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại của bạn !' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            style={{ float: 'right' }}
                        >
                            Cập nhật
                        </Button>
                    </Form>
                </div>
            </Col>
        </Row>
    );
}

export default UserInfo;

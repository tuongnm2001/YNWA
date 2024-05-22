import React, { useState } from 'react';
import { Button, Modal, Tabs } from 'antd';
import { FormOutlined, RobotOutlined } from '@ant-design/icons';
import UserInfo from './UserInfo';
import ChangePassword from './ChangePassword';

const ModalManageAccount = (props) => {

    const { open, setOpen } = props;

    const handleOk = () => {

    };

    const items = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            children: <UserInfo />,
            icon: <FormOutlined />
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />,
            icon: <RobotOutlined />
        }
    ]

    return (
        <Modal
            title="Quản lí tài khoản"
            open={open}
            onOk={handleOk}
            onCancel={() => setOpen(false)}
            footer={null}
            maskClosable={false}
            centered
        >
            <Tabs
                defaultActiveKey="1"
                items={items}
            // onChange={onChange}
            />
        </Modal>
    );
}

export default ModalManageAccount;
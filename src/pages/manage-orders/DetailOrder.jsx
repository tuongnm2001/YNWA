import React, { useEffect, useState } from 'react';
import { Button, Drawer } from 'antd';
import { Space, Table, Tag } from 'antd';

const DetailOrder = (props) => {

    const { open, setOpen, dataDetailOrder } = props;

    const newData = dataDetailOrder?.detail?.map((item, index) => ({
        key: `${dataDetailOrder._id}-${index}`,
        index: index + 1,
        bookName: item.bookName,
        quantity: item.quantity,
        type: dataDetailOrder.type,
        totalPrice: dataDetailOrder.totalPrice
    }))

    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            key: 'index',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'bookName',
            key: 'bookName',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                return (
                    <Tag color={'green'} key={type}>
                        {type.toUpperCase()}
                    </Tag>
                );
            },
        }
    ];

    return (
        <Drawer
            title={`CHI TIẾT ĐƠN HÀNG - ${dataDetailOrder.name}`}
            onClose={() => setOpen(false)}
            open={open}
        >
            <Table
                columns={columns}
                dataSource={newData}
                pagination={false}
            />

            <div style={{ marginTop: 30, float: 'right' }}>
                <span style={{ fontSize: 20, fontWeight: 500, color: '#df4545' }}>
                    Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetailOrder.totalPrice)}
                </span>
            </div>
        </Drawer>
    );
}

export default DetailOrder;
import React, { useEffect, useState } from 'react';
import './OrderHistory.scss'
import { Table, Tag } from 'antd';
import { getOrderHistory } from '../../services/api';
import moment from 'moment';
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'

const OrderHistory = () => {

    const [listDataOrderHistory, setListDataOrderHistory] = useState([])

    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span>{moment(record.createdAt).format('DD/MM/YYYY HH:mm:ss')}</span>
            ),
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (text, record) => (
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.totalPrice)}</span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: () => (
                <Tag color="green">Thành công</Tag>
            ),
        },
        {
            title: 'Chi tiết',
            dataIndex: 'detail',
            key: 'detail',
            render: (detail) => (
                <JsonView
                    name="Chi tiết mua hàng"
                    src={detail}
                    collapsed={true}
                    theme={'vscode'}

                />

            )
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const fetchAllOrderHistory = async () => {
        const res = await getOrderHistory();
        if (res && res.data) {
            const data = res.data.map((item, index) => {
                return {
                    no: index + 1,
                    _id: item._id,
                    name: item.name,
                    email: item.email,
                    phone: item.phone,
                    userId: item.userId,
                    detail: item.detail.map(detailItem => ({
                        bookName: detailItem.bookName,
                        quantity: detailItem.quantity,
                        _id: detailItem._id
                    })),
                    totalPrice: item.totalPrice,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                }
            })
            setListDataOrderHistory(data)
        }
    }

    useEffect(() => {
        fetchAllOrderHistory()
    }, [])

    return (
        <div className="order-history-container">
            <div className='title-order-history'>
                Lịch sử mua hàng
            </div>

            <Table
                pagination={false}
                columns={columns}
                dataSource={listDataOrderHistory}
                onChange={onChange}
                scroll={{ x: true }}
                style={{ flexWrap: 'wrap' }}
            />
        </div>
    );
}

export default OrderHistory;
import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { getListOrder } from '../../services/api';
import moment from 'moment';
import DetailOrder from './DetailOrder';


const ManageOrders = () => {

    const [listOrder, setListOrder] = useState([])
    const [isShowDetailOrder, setIsShowDetailOrder] = useState(false)
    const [dataDetailOrder, setDataDetailOrder] = useState([])

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record) => {
                return (
                    <a onClick={() => { setIsShowDetailOrder(true), setDataDetailOrder(record) }}>
                        {record._id}
                    </a>
                )
            }
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'name'
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address'
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
        },
        {
            title: 'Ngày mua',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text, record) => (
                <span>{moment(record.createdAt).format('MM/DD/YYYY HH:mm:ss')}</span>
            ),
            sorter: {
                compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                multiple: 1,
            },
        }
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const headerTable = () => {
        return (
            <div style={{ fontSize: 18, fontWeight: 500 }}>DANH SÁCH ĐƠN HÀNG</div>
        )
    }

    const fetchAllListOrder = async () => {
        const res = await getListOrder();
        if (res && res.data) {
            setListOrder(res.data.result)
        }
    }

    useEffect(() => {
        fetchAllListOrder()
    }, [])

    return (
        <>
            <Table
                title={headerTable}
                columns={columns}
                dataSource={listOrder.map(item => ({
                    ...item,
                    key: item._id
                }))}
                onChange={onChange}
                pagination={false}
                scroll={{ x: true }}
                style={{ flexWrap: 'wrap' }}

            />

            <DetailOrder
                open={isShowDetailOrder}
                setOpen={setIsShowDetailOrder}
                dataDetailOrder={dataDetailOrder}
            />
        </>
    );
}

export default ManageOrders;
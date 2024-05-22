import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Popconfirm, message, notification } from 'antd';
import InputSearchBooks from './InputSearchBooks';
import { TfiExport } from 'react-icons/tfi';
import { DeleteOutlined, EditOutlined, PlusOutlined, QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { deleteABook, getListBookWithPaginate } from '../../../services/api';
import moment from 'moment';
import ModalViewDetailBook from './ModalViewDetailBook';
import ModalAddNewBook from './ModalAddNewBook';
import ModalUpdateBook from './ModalUpdateBook';

const TableBooks = () => {

    const [listAllBooks, setListAllBook] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState('sort=-updatedAt')
    const [isViewDetailBook, setIsViewDetailBook] = useState(false)
    const [isShowModalAddNewBook, setIsShowModalAddNewBook] = useState(false)
    const [dataDetailBook, setDataDetailBook] = useState({})
    const [isShowModalUpdateBook, setIsShowModalUpdateBook] = useState(false)
    const [dataUpdateBook, setDataUpdateBook] = useState([])

    const fetchAllBook = async () => {

        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`

        if (filter) {
            query += `&${filter}`
        }

        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await getListBookWithPaginate(query);
        if (res && res.data) {
            setListAllBook(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchAllBook()
    }, [current, pageSize, filter, sortQuery])

    const handleSearchBooks = (query) => {
        setFilter(query)
    }

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            render: (text, record) => (
                <a onClick={() => handleViewDetailBook(record)}>{record._id}</a>
            )
        },
        {
            title: 'Tên sách',
            dataIndex: 'mainText',
            fixed: 'left',
            sorter: (a, b) => a.mainText.localeCompare(b.mainText)

        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category)
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: (a, b) => a.author.localeCompare(b.author)
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: (a, b) => a.price - b.price,
            render: (text, record) => (
                <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record.price)}</span>
            ),
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            render: (text, record) => (
                <span>{moment(record.updatedAt).format('MM/DD/YYYY HH:mm:ss')}</span>
            ),
            sorter: true
        },
        {
            title: 'Actions',
            render: (text, record, index) => {
                return (
                    <div className='btn-action'>
                        <EditOutlined onClick={() => handleUpdateBook(record)} style={{ color: '#ffc107' }} />

                        <Popconfirm
                            title="XÓA SẢN PHẨM"
                            description={(
                                <span>
                                    Bạn có chắc muốn xóa sản phẩm <span style={{ color: 'red' }}>{record.mainText}</span> không?
                                </span>
                            )}
                            icon={
                                < QuestionCircleOutlined
                                    style={{
                                        color: 'red',
                                    }}
                                />
                            }
                            onConfirm={() => confirm(record._id)}
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{
                                loading: isLoading
                            }}
                        >
                            <DeleteOutlined style={{ color: '#dc3545' }} />
                        </Popconfirm>
                    </div>

                )
            }
        }
    ];

    const handleUpdateBook = (data) => {
        setIsShowModalUpdateBook(true)
        setDataUpdateBook(data)
    }

    //delete book
    const confirm = async (id) => {
        setIsLoading(true);
        const res = await deleteABook(id);
        if (res && res.data) {
            message.success('Xóa sản phẩm thành công');
            fetchAllBook();
            setIsLoading(false);
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
            setIsLoading(false);
        }
    };

    const handleViewDetailBook = (data) => {
        setIsViewDetailBook(true)
        setDataDetailBook(data)
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
            console.log(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }

        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
            setSortQuery(q)
        }
    }

    const styleButton = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    }

    const handleReload = () => {
        setFilter('')
        setSortQuery('')
        fetchAllBook()
    }

    const renderHeaderTable = () => {
        return (
            <div className='header-table-container'>
                <span className='table-list-user'>DANH SÁCH SẢN PHẨM</span>
                <div className='button-header'>
                    {/* <Button type="primary" onClick={() => handleExportUser()} style={styleButton}><TfiExport />Export</Button> */}

                    {/* <Button type="primary" onClick={() => handleImportUser()} style={styleButton}><TfiImport />Import</Button> */}

                    <Button type="primary" onClick={() => setIsShowModalAddNewBook(true)}><PlusOutlined />Thêm mới</Button>

                    <Tooltip placement="topLeft" title={'Tải lại'} >
                        <Button onClick={() => handleReload()}>
                            <ReloadOutlined />
                        </Button>
                    </Tooltip>
                </div>
            </div >
        )
    }

    return (
        <>
            <InputSearchBooks
                handleSearchBooks={handleSearchBooks}
            />

            <Table
                title={renderHeaderTable}
                columns={columns}
                dataSource={listAllBooks.map((item) => ({
                    ...item,
                    key: item._id
                }))}
                onChange={onChange}
                pagination={{
                    defaultPageSize: 1,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '15'],
                    current: current,
                    pageSize: pageSize,
                    showSizeChanger: true,
                    total: total
                }}
                scroll={{ x: true }}
                loading={isLoading}
                style={{ flexWrap: 'wrap' }}
            />;

            <ModalViewDetailBook
                open={isViewDetailBook}
                setOpen={setIsViewDetailBook}
                dataDetailBook={dataDetailBook}
            />

            <ModalAddNewBook
                open={isShowModalAddNewBook}
                setOpen={setIsShowModalAddNewBook}
                fetchAllBook={fetchAllBook}
            />

            <ModalUpdateBook
                open={isShowModalUpdateBook}
                setOpen={setIsShowModalUpdateBook}
                dataUpdateBook={dataUpdateBook}
                fetchAllBook={fetchAllBook}
            />
        </>
    );
}

export default TableBooks;
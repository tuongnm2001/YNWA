import { Table, Button, Tooltip, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { deleteAUser, getUserWithPaginate } from '../../../services/api';
import InputSearch from './InputSearch';
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ModalViewDetailUser from './ModalViewDetailUser';
import { TfiExport } from "react-icons/tfi";
import { TfiImport } from "react-icons/tfi";
import ModalAddUser from './ModalAddUser';
import moment from 'moment';
import ModalImportDataUser from './ModalImportDataUser';
import './TableUser.scss'
import * as XLSX from 'xlsx';
import ModalEditUser from './ModalEditUser';

const TableUser = () => {
    const [listUsers, setListUser] = useState([])
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [filter, setFilter] = useState('')
    const [sortQuery, setSortQuery] = useState('sort=-updatedAt')
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [isShowModalViewDetail, setIsShowModalViewDetail] = useState(false)
    const [dataUserView, setDataUserView] = useState({})
    const [isShowModalAddUser, setIsShowModalAddUser] = useState(false)
    const [isShowModalImportDataUser, setIsShowModalImportDataUser] = useState(false)
    const [isShowModalEditUser, setIsShowModalEditUser] = useState(false)
    const [dataEditUser, setDataEditUser] = useState([])
    const [confirmLoading, setConfirmLoading] = useState(false);

    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
            width: 20,
            render: (text, record, index) => {
                return (
                    <a onClick={() => { setDataUserView(record); setIsShowModalViewDetail(true); }}>
                        {record._id}
                    </a >
                )
            }
        },
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            fixed: 'left',
            sorter: (a, b) => a.fullName.localeCompare(b.fullName)
        },
        {
            title: 'Email',
            dataIndex: 'email',
            sorter: true,
            sorter: (a, b) => a.email.localeCompare(b.email)
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone'
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: `createdAt`,
            render: (text, record) => (
                <span>{moment(record.createdAt).format('MM/DD/YYYY HH:mm:ss')}</span>
            ),
            // sorter: (a, b) => a.createdAt.localeCompare(b.createdAt)
            sorter: true
        },
        {
            title: 'Action',
            render: (text, record, index) => {
                return (
                    <div className='btn-action'>
                        <EditOutlined onClick={() => handleEditUser(record)} style={{ color: '#ffc107' }} />

                        <Popconfirm
                            title={`XÓA NGƯỜI DÙNG`}
                            description={(
                                <span>
                                    Bạn có chắc muốn xóa người dùng <span style={{ color: 'red' }}>{record.email}</span> không?
                                </span>
                            )}
                            icon={
                                < QuestionCircleOutlined
                                    style={{
                                        color: 'red',
                                    }}
                                />
                            }
                            okButtonProps={{
                                loading: confirmLoading,
                            }}
                            onConfirm={() => handleOk(record._id)}
                            okText="Xóa"
                            cancelText="Hủy"
                        >
                            <DeleteOutlined style={{ color: '#dc3545' }} />
                        </Popconfirm >
                    </div >
                )
            }
        },

    ];

    const handleOk = async (_id) => {
        setConfirmLoading(true);
        const res = await deleteAUser(_id);
        if (res && res.data) {
            message.success('Xóa người dùng thành công!');
            handleReLoad();
            setConfirmLoading(false);
        } else {
            message.error(res.message)
            setConfirmLoading(false);
        }
    };


    const handleEditUser = (user) => {
        setIsShowModalEditUser(true)
        setDataEditUser(user)
    }

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        // console.log('params', pagination, filters, sorter, extra);
        if (sorter && sorter.field) {
            const q = sorter.order === 'ascend' ? `sort=${sorter.field}` : `sort=-${sorter.field}`
            setSortQuery(q)
        }
    };

    const getAllUserWithPaginate = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`

        if (filter) {
            query += `&${filter}`
        }

        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await getUserWithPaginate(query);

        if (res && res.data) {
            setListUser(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        getAllUserWithPaginate()
    }, [current, pageSize, filter, sortQuery])

    const handleSearch = (query) => {
        setFilter(query)
    }

    const handleReLoad = () => {
        setFilter('')
        setSortQuery('')
        getAllUserWithPaginate();
    }

    const styleButton = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    }

    const handleAddNewUser = () => {
        setIsShowModalAddUser(true)
    }

    const handleExportUser = () => {
        const worksheet = XLSX.utils.json_to_sheet(listUsers);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
        XLSX.writeFile(workbook, "DataSheet.xlsx");
    }

    const handleImportUser = () => {
        setIsShowModalImportDataUser(true)
    }

    const renderHeaderTable = () => {
        return (
            <div className='header-table-container'>
                <span className='table-list-user'>DANH SÁCH NGƯỜI DÙNG</span>
                <div className='button-header'>
                    <Button type="primary" onClick={() => handleExportUser()} style={styleButton}><TfiExport />Export</Button>

                    <Button type="primary" onClick={() => handleImportUser()} style={styleButton}><TfiImport />Import</Button>

                    <Button type="primary" onClick={() => handleAddNewUser()}><PlusOutlined />Thêm mới</Button>

                    <Tooltip placement="topLeft" title={'Tải lại'} >
                        <Button onClick={() => handleReLoad()}>
                            <ReloadOutlined />
                        </Button>
                    </Tooltip>
                </div>
            </div >
        )
    }

    return (
        <>
            <InputSearch
                handleSearch={handleSearch}
            />
            <Table
                title={renderHeaderTable}
                columns={columns}
                // dataSource={listUsers}
                dataSource={listUsers.map((user) => ({
                    ...user,
                    key: user._id // or key: user.id if it's available
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
            />

            <ModalViewDetailUser
                open={isShowModalViewDetail}
                setOpen={setIsShowModalViewDetail}
                dataUserView={dataUserView}
            />

            <ModalAddUser
                open={isShowModalAddUser}
                setOpen={setIsShowModalAddUser}
                handleReLoad={handleReLoad}
            />

            <ModalImportDataUser
                open={isShowModalImportDataUser}
                setOpen={setIsShowModalImportDataUser}
                handleReLoad={handleReLoad}
            />

            <ModalEditUser
                open={isShowModalEditUser}
                setOpen={setIsShowModalEditUser}
                dataEditUser={dataEditUser}
                handleReLoad={handleReLoad}
            />
        </>

    );
}

export default TableUser;
import React, { useState } from 'react';
import { Button, Modal, message, Upload, Table, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { postCreateListUserBulk } from '../../../services/api';
import templateFile from './template.xlsx?url'

const ModalImportDataUser = (props) => {

    const { Dragger } = Upload;
    const { open, setOpen, handleReLoad } = props;
    const [isSubmit, setIsSubmit] = useState(true);
    const [isShowUploadList, setIsShowUploadList] = useState(true);
    const [dataSource, setDataSource] = useState([]);

    const columns =
        [
            { dataIndex: 'fullName', title: 'Tên hiển thị', key: 'fullName' },
            { dataIndex: 'email', title: 'Email', key: 'email' },
            { dataIndex: 'phone', title: 'Số điện thoại', key: 'phone' },
        ]

    const handleOk = async () => {
        const data = dataSource.map((item) => {
            item.password = '123456'
            return item;
        })

        const res = await postCreateListUserBulk(data)
        if (data && data.length > 0) {
            notification.success({
                description: `Success: ${res.data.countSuccess}, Error: ${res.data.countError}`,
                message: 'Upload thành công !'
            })
            setOpen(false);
            setIsShowUploadList(false);
            setDataSource([]);
            handleReLoad();
        } else {
            notification.error({
                description: res.message,
                message: 'Có lỗi xảy ra !'
            })
        }

    };

    const handleCancel = () => {
        setOpen(false);
        setDataSource([]);
        setIsSubmit(true);
        setIsShowUploadList(false);
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess('ok')
        }, 1000);
    }

    const propsUpload = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
                // Đọc dữ liệu từ file excel
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const dataJson = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    // Lấy dữ liệu từ dòng thứ 2 (vì dòng đầu tiên thường là tiêu đề)
                    const importedData = dataJson.slice(1).map(row => ({
                        fullName: row[0],
                        email: row[1],
                        phone: row[2],
                    }));
                    setDataSource(importedData);
                    setIsSubmit(false)
                };
                reader.readAsArrayBuffer(info.file.originFileObj);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    return (
        <>
            <Modal
                title="Import data user"
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                okText={"Import data"}
                maskClosable={false}
                okButtonProps={{ disabled: isSubmit }}
                centered
                width={"50vw"}
            >
                <Dragger {...propsUpload} showUploadList={isShowUploadList}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv .xls .xlsx . or &nbsp;
                        <a onClick={(e) => e.stopPropagation()} href={templateFile} download>Download Sample File</a>
                    </p>
                </Dragger>

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    style={{ paddingTop: '20px' }}
                    rowKey={record => record.fullName}
                />
            </Modal >
        </>
    );
}

export default ModalImportDataUser;

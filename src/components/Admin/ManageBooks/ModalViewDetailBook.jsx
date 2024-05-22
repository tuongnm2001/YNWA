import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Drawer, Divider, Image, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const ModalViewDetailBook = (props) => {

    const { open, setOpen, dataDetailBook } = props

    //format createdAt , updatedAt
    const formattedCreatedAt = moment(dataDetailBook?.createdAt).format('MM/DD/YYYY HH:mm:ss');
    const formattedUpdatedAt = moment(dataDetailBook?.updatedAt).format('MM/DD/YYYY HH:mm:ss');

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (dataDetailBook) {

            let imgThumbnail = {}, imgSlider = [];

            if (dataDetailBook.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataDetailBook.thumbnail,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${dataDetailBook?.thumbnail}`
                }

            }

            if (dataDetailBook.slider && dataDetailBook.slider.length > 0) {
                dataDetailBook.slider.map((item) => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: item,
                        status: 'done',
                        url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`
                    })
                })

            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataDetailBook])

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </button>
    );

    const items = [
        {
            key: '1',
            label: 'Id',
            children: dataDetailBook?._id
        },
        {
            key: '2',
            label: 'Tên sách',
            children: dataDetailBook?.mainText,
        },
        {
            key: '3',
            label: 'Tác giả',
            children: dataDetailBook?.author,
        },
        {
            key: '4',
            label: 'Giá tiền',
            children: <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataDetailBook.price)}</span>
        },
        {
            key: '5',
            label: 'Số lượng',
            children: dataDetailBook?.quantity,
        },
        {
            key: '6',
            label: 'Đã bán',
            children: dataDetailBook?.sold,
        },
        {
            key: '7',
            label: 'Thể loại',
            span: 2,
            children: <Badge status="processing" text={dataDetailBook?.category} />,
        },

        {
            key: '8',
            label: 'Ngày tạo',
            children: formattedCreatedAt
        },

        {
            key: '9',
            label: 'Ngày cập nhật',
            children: formattedUpdatedAt,
        }
    ];

    return (
        <>
            <Drawer
                title="CHI TIẾT SẢN PHẨM"
                onClose={() => setOpen(false)}
                open={open}
                width={'100vw'}
            >
                <Descriptions
                    bordered
                    column={2}
                    items={items}
                />
                <Divider orientation="left">Ảnh sản phẩm</Divider>

                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={{ showRemoveIcon: false }}
                />
                {previewImage && (
                    <Image
                        wrapperStyle={{
                            display: 'none',
                        }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>

        </>
    );
}

export default ModalViewDetailBook;
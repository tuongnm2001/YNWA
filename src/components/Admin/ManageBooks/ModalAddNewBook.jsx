import React, { useEffect, useState } from 'react';
import { Image, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Space, Upload, notification, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { callUploadBookImg, createABook, getAllCategory } from '../../../services/api';

const ModalAddNewBook = (props) => {

    const { open, setOpen } = props;
    const [listCategory, setListCategory] = useState([])
    const [loading, setLoading] = useState(false);
    const [loadingSlider, setLoadingSlider] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const [dataThumbnail, setDataThumbnail] = useState({})
    const [dataSlider, setDataSlider] = useState([])

    const [form] = Form.useForm()

    const fetchAllCategory = async () => {
        const res = await getAllCategory();
        let dataCategory = [];
        if (res && res.data) {
            res.data.map((item) => {
                dataCategory.push({
                    value: item,
                    label: item
                })
            })
        }
        setListCategory(dataCategory)
    }


    useEffect(() => {
        fetchAllCategory()
    }, [])

    //upload
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handlePreview = async (file) => {

        getBase64(file.originFileObj, (url) => {
            setPreviewImage(url);
            setPreviewOpen(true);
            setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
        });
    };

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleUploadFileThumbnail = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            setDataThumbnail([{
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    }

    const handleUploadFileSlider = async ({ file, onSuccess, onError }) => {
        const res = await callUploadBookImg(file);
        if (res && res.data) {
            //copy previous state => upload multiple images
            setDataSlider((dataSlider) => [...dataSlider, {
                name: res.data.fileUploaded,
                uid: file.uid
            }])
            onSuccess('ok')
        } else {
            onError('Đã có lỗi khi upload file');
        }
    }

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isLt2M) {
            message.error('Image must smaller than 4MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    const handleChange = (info, type) => {
        if (info.file.status === 'uploading') {
            type ? setLoadingSlider(true) : setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, (url) => {
                type ? setLoadingSlider(false) : setLoading(false);
                setImageUrl(url);
            });
        }
    };

    const onFinish = async (values) => {
        if (dataThumbnail.length === 0) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng tải ảnh Thumbnail'
            })
            return;
        }

        if (dataSlider.length === 0) {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: 'Vui lòng tải ảnh Slider'
            })
            return;
        }

        const { mainText, author, price, category, quantity, sold } = values;
        const imgThumbnail = dataThumbnail[0].name;
        const imgSlider = dataSlider.map(item => item.name)

        setLoading(true)
        const res = await createABook(mainText, author, price, category, quantity, sold, imgThumbnail, imgSlider);
        if (res && res.data) {
            message.success('Thêm sản phẩm thành công')
            props.fetchAllBook();
            setOpen(false)
            setLoading(false)
            form.resetFields();
        } else {
            notification.error({
                message: 'Có lỗi xảy ra',
                description: res.message
            })
            setLoading(false)
        }
    }

    return (
        <>
            <Modal
                title="THÊM MỚI SẢN PHẨM"
                open={open}
                onOk={() => { form.submit() }}
                onCancel={() => { setOpen(false); form.resetFields() }}
                centered
                maskClosable={false}
                okText="Thêm mới"
                cancelText="Hủy"
                width={800}
                confirmLoading={loading}
            >
                <Divider />
                <Form
                    form={form}
                    onFinish={onFinish}
                    name="add-new-book"
                    autoComplete="off"
                >
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Tên sản phẩm"
                                name="mainText"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập Tên sản phẩm!',
                                        },
                                    ]
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Tác giả"
                                name="author"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tên tác giả!',
                                        },
                                    ]
                                }
                            >
                                <Input />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Giá sản phẩm"
                                name="price"

                                rules={
                                    [
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập giá sản phẩm!',
                                        },
                                    ]
                                }
                            >
                                <InputNumber
                                    min={0}
                                    step={1000}
                                    addonAfter="VND"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Thể loại"
                                name="category"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập chọn thể loại!',
                                        },
                                    ]
                                }
                            >
                                <Select
                                    showSearch
                                    placeholder="Chọn thể loại"
                                    allowClear
                                    options={listCategory}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Số lượng"
                                name="quantity"
                                rules={
                                    [
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập số lượng!',
                                        },
                                    ]
                                }
                            >
                                <InputNumber
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Đã bán"
                                name="sold"
                                initialValue={0}
                            >
                                <InputNumber
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }} //whole column
                                label="Ảnh Thumbnail"
                                name="thumbnail"
                            >
                                <Upload
                                    name="thumbnail"
                                    listType="picture-card"
                                    className='avatar-uploader'
                                    maxCount={1}
                                    multiple={false}
                                    onPreview={handlePreview}
                                    customRequest={handleUploadFileThumbnail}
                                    beforeUpload={beforeUpload}
                                    onChange={handleChange}
                                >
                                    <div>
                                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                labelCol={{ span: 24 }}
                                label="Ảnh Slider"
                                name="slider"
                            >
                                <Upload
                                    multiple
                                    name="slider"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    onPreview={handlePreview}
                                    customRequest={handleUploadFileSlider}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'slider')}
                                >
                                    <div>
                                        {loadingSlider ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal >

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
        </>
    );
}

export default ModalAddNewBook;
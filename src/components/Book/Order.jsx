import { Button, Col, Divider, Form, Input, InputNumber, Radio, Result, Row, Steps, Tooltip, message, notification } from "antd";
import './Order.scss'
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { doDeleteItemCartAction, doResetOrder, doUpdateCartAction } from "../../redux/order/orderSlice";
import imgCartEmpty from '../../assets/cart-empty.jpg'
import { Link, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { postCreateAnOrder } from "../../services/api";

const Order = () => {

    const carts = useSelector(state => state.order.carts);
    const account = useSelector(state => state.account.user)
    const [totalPrice, setTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0)
    const [form] = Form.useForm();

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0;
            carts.map((item) => {
                sum += item.quantity * item.detail.price;
            })
            setTotalPrice(sum)
        } else {
            setCurrentStep(-1)
            setTotalPrice(0)
        }
    }, [carts])

    const handleChangeInputQuantity = (value, item) => {
        if (!value || value < 1) return;
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantity: value, detail: item, _id: item._id }))
        }
    };

    const handleDeleteProduct = (id) => {
        dispatch(doDeleteItemCartAction({ _id: id }));
    }

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    useEffect(() => {
        if (account) {
            form.setFieldsValue({
                fullName: account.fullName,
                phone: account.phone,
            });
        }
    }, [account, form]);

    const handleClickMainTex = (item) => {
        if (currentStep === 0) {
            navigate(`/book/${convertSlug(item?.detail?.mainText)}?id=${item?._id}`);
        }
    }

    const onChange = (newStep) => {
        if (newStep <= currentStep) {
            setCurrentStep(newStep);
        }
    };

    const onFinish = async (values) => {
        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.mainText,
                quantity: item.quantity,
                _id: item._id
            }
        })

        const data = {
            name: values.fullName,
            address: values.address,
            phone: values.phone,
            totalPrice: totalPrice,
            detail: detailOrder
        }
        setIsLoading(true)
        const res = await postCreateAnOrder(data);
        if (res && res.data) {
            dispatch(doResetOrder());
            message.success('Đặt hàng thành công');
            setCurrentStep(2);
            setIsLoading(false)
        } else {
            notification.error({
                message: 'Đã có lỗi xảy ra',
                description: res.message,
            })
            setIsLoading(false);
        }
    };

    return (
        <>
            <Row gutter={[20, 20]} className="order-container">

                <Steps
                    onChange={onChange}
                    size="small"
                    current={currentStep}
                    status="process"
                    className="step"
                    items={[
                        {
                            title: 'Đơn hàng',
                        },
                        {
                            title: 'Đặt hàng',
                        },
                        {
                            title: 'Thanh toán',
                        },
                    ]}
                />

                <Col md={currentStep === 2 ? 0 : currentStep === -1 ? 24 : 18} sm={24} xs={24}>
                    <div className="content-left-order">
                        {
                            carts && carts.length !== 0 ?
                                <>
                                    <div className="des-cart">
                                        <div className="text-name-cart">Tên sản phẩm</div>
                                        <div className="price-cart">Giá</div>
                                        <div className="quantity-cart">Số lượng</div>
                                        <div className="total-cart">Số tiền</div>
                                    </div>
                                    <Divider />
                                </>
                                :
                                <></>
                        }


                        {
                            carts && carts.length > 0 ?
                                carts.map((item, index) => {
                                    return (
                                        <>
                                            <div className="content-down-order" key={`product-order-${index}`}>
                                                <div className="product-order" >
                                                    <div className="img-order">
                                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} alt="" />
                                                        <div className="mainText-order">
                                                            <span
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleClickMainTex(item)}
                                                            >
                                                                {item.detail.mainText}
                                                            </span>
                                                        </div>
                                                    </div>


                                                    <div className="price-order">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price)}
                                                    </div>

                                                    <div className="quantity-order">
                                                        <InputNumber
                                                            onChange={(value) => handleChangeInputQuantity(value, item)}
                                                            value={item.quantity}
                                                            disabled={currentStep !== 0}
                                                            style={{ backgroundColor: '#ffffff', color: 'black' }}
                                                        />
                                                    </div>

                                                    <div className="total-price-order">
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price * item.quantity)}
                                                    </div>
                                                    {
                                                        currentStep === 0 ?
                                                            <div className="icon-delete-order">
                                                                <Tooltip title="Xóa">
                                                                    <DeleteOutlined style={{ color: '#ff4d4f', cursor: 'pointer' }} onClick={() => handleDeleteProduct(item._id)} />
                                                                </Tooltip>
                                                            </div>
                                                            :
                                                            <div className="icon-delete-order">

                                                            </div>
                                                    }
                                                </div>
                                                <Divider />
                                            </div>
                                        </>
                                    )
                                })
                                :
                                <>
                                    <div className="cart-empty">
                                        <img src={imgCartEmpty} />
                                        <span className="text-cart-empty">Giỏ hàng của bạn còn trống</span>
                                        <Link to={'/'}>
                                            <Button>Mua hàng ngay</Button>
                                        </Link>
                                    </div>
                                </>
                        }
                    </div>
                </Col>

                {
                    currentStep === 0 &&
                    <Col md={6} sm={24} xs={24}>
                        <div className="content-right-order">
                            <div className="summary-order">
                                <span className="title-content-right-order">Đơn hàng</span>

                                <Divider />

                                <div className="content-down-summary">
                                    <div className="total-price-summary">
                                        <span>Tạm tính</span>
                                        <span>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                        </span>
                                    </div>
                                    <div className="total-price-summary">
                                        <span>Giảm giá</span>
                                        <span>0đ</span>
                                    </div>
                                    <div className="total-price-summary">
                                        <span>Phí vận chuyển</span>
                                        <span>0đ</span>
                                    </div>

                                    <div className="total-price-summary">
                                        <span style={{ fontWeight: 600, color: '#ff4d4f' }}>Tổng thanh toán</span>
                                        <span style={{ fontWeight: 600, color: '#ff4d4f' }}>
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                        </span>
                                    </div>

                                    <Button
                                        onClick={() => setCurrentStep(1)}
                                        style={{ width: '100%', backgroundColor: '#1677ff', color: "#ffffff" }} type='primary'
                                        disabled={carts.length === 0}
                                    >
                                        Mua hàng ({carts.length})
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </Col>
                }

                {
                    currentStep === 1 &&
                    <Col md={6} sm={24} xs={24}>
                        <div className="content-right-order">
                            <div className="summary-order">
                                <span className="title-content-right-order">Thanh toán</span>

                                <Divider />

                                <div className="content-down-summary">
                                    <Form
                                        name="basic"
                                        labelCol={{
                                            span: 24,
                                        }}
                                        style={{
                                            maxWidth: 600,
                                        }}
                                        initialValues={{
                                            remember: true,
                                        }}
                                        onFinish={onFinish}
                                        autoComplete="off"
                                        className="custom-form"
                                        form={form}
                                    >
                                        <Form.Item
                                            label="Tên người nhận"
                                            name='fullName'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập tên người nhận!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                        <Form.Item
                                            label="Số điện thoại"
                                            name="phone"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập số điện thoại!',
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            labelCol={{ span: 24 }}
                                            label="Địa chỉ nhận hàng"
                                            name="address"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập địa chỉ nhận hàng!',
                                                },
                                            ]}
                                        >
                                            <TextArea rows={4} />
                                        </Form.Item>

                                        <Radio style={{ padding: '10px 0' }} checked>Thanh toán khi nhận hàng</Radio>
                                        <div className="total-price-summary" style={{ paddingBottom: '20px' }}>
                                            <span style={{ fontWeight: 600, color: '#ff4d4f' }}>Tổng thanh toán</span>
                                            <span style={{ fontWeight: 600, color: '#ff4d4f' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}
                                            </span>
                                        </div>

                                        <Button
                                            loading={isLoading}
                                            onClick={() => form.submit()}
                                            style={{ width: '100%' }} type='primary'
                                        >
                                            Đặt hàng ({carts.length})
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </Col>
                }

                {
                    currentStep === 2 &&
                    <Col md={24}>
                        <Result
                            style={{ height: '370px' }}
                            status="success"
                            title="Đặt hàng thành công!"
                            subTitle="Cảm ơn bạn đã đặt hàng."
                            extra={[
                                <Button type="primary" key="console">
                                    Lịch sử mua hàng
                                </Button>,
                                <Button key="buy">Tiếp tục</Button>,
                            ]}
                        />
                    </Col>
                }
            </Row >
        </>
    );
}

export default Order;
import ImageGallery from "react-image-gallery";
import { Breadcrumb, Card, Col, Divider, Flex, Rate, Row, Tag, message } from 'antd';
import { CheckCircleOutlined, HomeOutlined, LikeOutlined, MinusOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import './view-detail.scss'
import ModalGallery from "./ModalGallery";
import { useState } from "react";
import DetailBookLoader from "./DetailBookLoader";
import Meta from "antd/es/card/Meta";
import { useEffect } from "react";
import { getListBookWithPaginate } from "../../services/api";
import imgFreeShipping from '../../assets/free-shipping.png'
import { useDispatch, useSelector } from "react-redux";
import { doAddBookAction } from "../../redux/order/orderSlice";
import { useRef } from "react";

const ViewDetail = (props) => {
    const navigate = useNavigate()
    const { dataBook } = props;
    const images = dataBook?.items ?? [];
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState({})
    const [currentQuantity, setCurrentQuantity] = useState(1)
    const dispatch = useDispatch();
    const [currentIndex, setCurrentIndex] = useState(0)
    const refGallery = useRef(null)

    const fetchBook = async () => {
        let query = `current=${1}&pageSize=${10}&category=${dataBook?.category}`;

        const res = await getListBookWithPaginate(query);
        if (res && res.data) {
            // Lấy danh sách sách từ kết quả trả về
            const books = res.data.result;

            // Loại bỏ sản phẩm hiện tại (nếu có)
            const filteredBooks = books.filter(book => book._id !== dataBook._id);

            // Cập nhật state với danh sách đã lọc
            setFilter(filteredBooks);
        }
    }


    useEffect(() => {
        fetchBook()
    }, [dataBook])

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

    const handleChangeButton = (type) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return;
            setCurrentQuantity(currentQuantity - 1)
        }

        if (type === 'PLUS') {
            if (currentQuantity === +dataBook.quantity) return; //max
            setCurrentQuantity(currentQuantity + 1)
        }
    }

    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < dataBook.quantity) {
                setCurrentQuantity(+value)
            }
        }
        console.log(currentQuantity);
    }

    const handleAddToCart = (quantity, book) => {
        dispatch(doAddBookAction({ quantity, detail: book, _id: book._id }))
        message.success('Sản phẩm đã được thêm vào giỏ hàng!')
    }

    const handleBuyNow = (quantity, book) => {
        dispatch(doAddBookAction({ quantity, detail: book, _id: book._id }))
        navigate('/order')
    }

    const handleOnClickImage = () => {
        setOpen(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0);
    }

    return (
        <>
            {
                dataBook && dataBook._id ?
                    <>
                        <Breadcrumb
                            style={{ paddingBottom: '20px' }} separator=">"
                            items={[
                                {
                                    title: (
                                        <Link to="/">
                                            <HomeOutlined />&ensp;
                                            <span>Trang chủ </span>
                                        </Link>
                                    ),
                                },
                                {
                                    title: dataBook.mainText,
                                },
                            ]}
                        />

                        <div className="view-detail-container">
                            <Row gutter={[20, 20]}>
                                <Col md={10}>
                                    <div className="view-detail-content-left" >
                                        <ImageGallery
                                            ref={refGallery}
                                            additionalClass="custom-image-gallery"
                                            items={images}
                                            showPlayButton={false} //hide play button
                                            showFullscreenButton={false} //hide fullscreen button
                                            renderLeftNav={() => <></>} //left arrow === <> </>
                                            renderRightNav={() => <></>}//right arrow === <> </>
                                            slideOnThumbnailOver={true}  //onHover => auto scroll images
                                            onClick={() => handleOnClickImage()}
                                        />
                                    </div>
                                </Col>

                                <Col md={14}>
                                    <div className="view-detail-content-right">
                                        <Flex gap="4px" style={{ fontWeight: 700 }}>
                                            <Tag icon={<LikeOutlined />} color="error" style={{ height: 22 }}>
                                                Top Deal
                                            </Tag>

                                            <Tag icon={<CheckCircleOutlined />} color="processing" style={{ height: 22 }}>
                                                Chính hãng
                                            </Tag>

                                            <div className='author'>Tác giả: <span style={{ color: "#0d5cb6", fontSize: 15 }}>{dataBook.author}</span> </div>

                                        </Flex>


                                        <div className='title'>{dataBook.mainText}</div>

                                        <div className='cate'>
                                            <span className='left-side'>Thể loại</span>
                                            <span className='right-side'>{dataBook.category}</span>
                                        </div>

                                        <div className='rating'>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                            <span className='sold'>
                                                <Divider type="vertical" />
                                                Đã bán {dataBook.sold}
                                            </span>

                                        </div>

                                        <div className='price'>
                                            <span className='currency'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook.price)}
                                            </span>
                                        </div>

                                        <div className='delivery'>
                                            <span className='left-side'>Vận chuyển</span>
                                            <span className='right-side'>
                                                <img style={{ height: 25 }} src={imgFreeShipping} />Miễn phí vận chuyển
                                            </span>
                                        </div>

                                        <div className='quantity'>
                                            <span className='left-side'>Số lượng</span>
                                            <span className='right-side'>
                                                <button className="btn-minus" onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                                <input className="inputValue" onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                                <button className="btn-plus" onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                            </span>
                                        </div>
                                        <div className='buy'>
                                            <button className='cart' onClick={() => handleAddToCart(currentQuantity, dataBook)}>
                                                <span>Thêm vào giỏ hàng</span>
                                            </button>
                                            <button className='now' onClick={() => handleBuyNow(currentQuantity, dataBook)}>Mua ngay</button>
                                        </div>
                                    </div>

                                    {
                                        filter.length > 0 ?
                                            <div className="product-same">
                                                <span className="title-product-same">Sản phẩm tương tự</span>
                                                <div className="content-product-same" >
                                                    {
                                                        filter && filter.length > 0 &&
                                                        filter.slice(0, 5).map((item, index) => {
                                                            return (
                                                                <Card
                                                                    key={`product-same-${index}`}
                                                                    onClick={() => { navigate(`/book/${convertSlug(item?.mainText)}?id=${item?._id}`), setCurrentQuantity(1) }}
                                                                    hoverable
                                                                    style={{
                                                                        marginTop: 10,
                                                                        width: 120,
                                                                    }}
                                                                    cover={
                                                                        <img
                                                                            alt="example"
                                                                            src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.thumbnail}`}
                                                                            style={{ height: 100, objectFit: 'contain', marginTop: 10 }}
                                                                        />
                                                                    }
                                                                >
                                                                    <Meta title={item.mainText} description={
                                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                                    } />
                                                                    <span>
                                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                                    </span>
                                                                </Card>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            :
                                            <></>
                                    }
                                </Col>
                            </Row>
                        </div>
                    </>
                    :
                    <><DetailBookLoader /></>
            }

            <ModalGallery
                open={open}
                setOpen={setOpen}
                images={images}
                dataBook={dataBook}
                currentIndex={currentIndex}
            />
        </>
    );
}

export default ViewDetail;
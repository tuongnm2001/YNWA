import React, { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Input, Badge, Dropdown, Space, message, Drawer, Divider, Popover, Button } from 'antd';
import { UserOutlined, MehOutlined, MenuOutlined, ProfileOutlined, LogoutOutlined, BarChartOutlined, OrderedListOutlined, HomeOutlined } from '@ant-design/icons';
import './header.scss';
import { useDispatch, useSelector } from 'react-redux';
import { FaReact } from "react-icons/fa";
import { logout } from '../../services/api';
import { doLogout } from '../../redux/account/accountSlice';
import imgCartEmpty from '../../assets/cart-empty.jpg'
import ModalManageAccount from './ModalManageAccount';
import imgCart from '../../assets/icon-cart.png'

const { Search } = Input;

const HeaderPage = ({ searchTerm, setSearchTerm }) => {

    const isAuthenticated = useSelector(state => state.account.isAuthenticated)
    const user = useSelector(state => state.account.user)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isShowModalManageAccount, setIsShowModalManageAccount] = useState(false)
    const carts = useSelector(state => state.order.carts)
    const location = useLocation();

    const urlAvatar = `${import.meta.env.VITE_BACKEND_URL}/images/avatar/${user?.avatar}`

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    let items = [
        {
            label: (
                <Space>
                    <Avatar size='large' icon={<UserOutlined />} src={urlAvatar} />
                    {/* <Text>{user.fullName}</Text> */}
                    <div style={{ display: 'flex', flexDirection: 'column', color: '#32475cde', marginLeft: '5px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '400' }}>{user.fullName}</span>
                        <span style={{ fontSize: '12px', color: '#32475c99' }}>{user.role}</span>
                    </div>
                </Space>
            ),
            key: '0',
            type: 'group',
        },
        {
            type: 'divider',
        },
        {
            label: <label onClick={() => setIsShowModalManageAccount(true)}><ProfileOutlined /> Quản lí tài khoản</label>,
            key: '1',
        },
        {
            label: (
                <NavLink to="/order-history">
                    <OrderedListOutlined /> Lịch sử mua hàng
                </NavLink>
            ),
            key: '2',
        },
        {
            label: <label onClick={() => handleLogout()}><LogoutOutlined /> Đăng xuất</label>,
            key: '3',
        }
    ];

    if (user.role === "ADMIN") {
        // Tìm vị trí của mục "Quản lí tài khoản" trong mảng và chèn mục "Quản trị" vào sau đó
        const index = items.findIndex(item => item.key === '1');
        if (index !== 0) {
            items.splice(index, 0, {
                label: <Link to="/admin"><BarChartOutlined /> Quản trị</Link>,
                key: '4',
            });
        }
    }

    const handleLogout = async () => {
        const res = await logout()
        if (res && res.data) {
            dispatch(doLogout());
            message.success('Đăng xuất thành công')
            navigate('/')
        }
    }

    const content = (
        <>
            {
                carts.length > 0 ?
                    <>
                        <div className='cart-container' >
                            {
                                carts && carts.length > 0 &&
                                carts.map((item, index) => {
                                    return (
                                        <div className='content-up' key={`carts-${index}`}>
                                            <div className='content-left-cart'>
                                                <div className='img-cart'>
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${item?.detail?.thumbnail}`} alt="" />
                                                </div>

                                                <div className='mainText-cart'>
                                                    <span>{item.detail.mainText}</span>
                                                </div>
                                            </div>

                                            <div className='price-cart'>
                                                <span>
                                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price)}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className='content-down' >
                                <Button type='primary' onClick={() => navigate('/order')}>Xem giỏ hàng</Button>
                            </div >
                        </div>
                    </>
                    :
                    <div className='cart-empty'>
                        <img src={imgCartEmpty} className='icon-cart-empty' style={{ width: 80, height: 80 }} />
                        <span className='text-cart-empty'>Chưa Có Sản Phẩm</span>
                    </div>
            }

        </>
    );

    return (
        <>
            <div className='navbar-container'>
                <div className='header'>
                    <div className="logo" onClick={() => navigate('/')}>
                        <FaReact className="rotating-icon" style={{ color: '#32475c' }} />
                        <MenuOutlined className="menu-icon" type="primary" onClick={() => setOpen(true)} />
                        <span className="title">YNWA</span>
                    </div>

                    <Search
                        className='search-header'
                        placeholder="Tìm kiếm sản phẩm"
                        onChange={(e) => handleSearch(e.target.value)}
                        style={{ width: 600, marginLeft: '20px' }}
                        size="large"
                    />
                    <div className='header-item-right'>

                        <div className='account' onClick={() => navigate('/')} >
                            <HomeOutlined className='icon' />
                            <span>Trang chủ</span>
                        </div>

                        {location.pathname !== '/order' && (
                            isAuthenticated === true ?
                                <Dropdown
                                    arrow="true"
                                    className='dropdown-homepage'
                                    // overlayStyle={{ width: '220px', paddingTop: '10px' }}
                                    menu={{
                                        items,
                                    }}
                                >
                                    <a onClick={(e) => e.preventDefault()} style={{ cursor: 'pointer' }}>
                                        <Space>
                                            <Badge offset={["-5%", "85%"]}
                                                style={{
                                                    width: "8px",
                                                    height: "8px",
                                                    boxShadow: "0 0 0 3px #fff",
                                                    backgroundColor: "#31a24c"
                                                }}
                                                dot>
                                                <Avatar size='large' icon={<UserOutlined />} src={urlAvatar} />

                                            </Badge>
                                            {/* <div style={{ color: '#808089', fontFamily: 'sans-serif', fontWeight: '500' }}>{user.fullName}</div> */}
                                        </Space>
                                    </a>
                                </Dropdown>
                                :
                                <div className='account' onClick={() => navigate('/login')} >
                                    <MehOutlined className='icon' />
                                    <span>Tài khoản </span>
                                </div>
                        )}
                        {location.pathname !== '/order' && (
                            <div className='cart'>
                                <div className='divider' style={{ borderLeft: '1px solid #ebebf0', height: 30 }}></div>
                                <Popover
                                    title={<span className="custom-title-cart">{carts.length > 0 ? "Sản phẩm mới thêm" : ""}</span>}
                                    placement="bottomRight"
                                    content={content}
                                    arrow={true}
                                >
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size="small"
                                        showZero
                                    >
                                        <img src={imgCart} style={{ width: 24, height: 24, marginTop: 4 }} />
                                    </Badge>
                                </Popover>

                            </div>
                        )}
                    </div>
                </div>
            </div >


            <Drawer title={
                <Space>
                    <Avatar size='large' icon={<UserOutlined />} src={urlAvatar} />
                    <div style={{ display: 'flex', flexDirection: 'column', color: '#32475cde', marginLeft: '5px' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '400' }}>{user.fullName}</span>
                        <span style={{ fontSize: '12px', color: '#32475c99' }}>{user.role}</span>
                    </div>
                </Space>
            }
                onClose={() => setOpen(false)}
                open={open}
                placement='left'
            >
                {
                    user.role === 'ADMIN' &&
                    <>
                        <Link to='/admin'>Quản trị</Link>
                        <Divider />
                    </>
                }
                <Link onClick={() => { setIsShowModalManageAccount(true), setOpen(false) }}>Quản lí tài khoản </Link>
                <Divider />
                <Link to='/order-history' onClick={() => setOpen(false)}> Lịch sử mua hàng </Link>
                <Divider />
                <Link>Đăng xuất</Link>
            </Drawer >

            <ModalManageAccount
                open={isShowModalManageAccount}
                setOpen={setIsShowModalManageAccount}
            />

        </>
    );
};

export default HeaderPage;

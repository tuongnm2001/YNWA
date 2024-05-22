import { Avatar, Card, Col, Row, Space, Statistic } from 'antd';
import './DashBoard.scss'
import Meta from 'antd/es/card/Meta';
import { ArrowDownOutlined, ArrowUpOutlined, BookOutlined, PayCircleOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';
import { getDashBoard, totalBook } from '../../services/api';
import { IoBookSharp } from "react-icons/io5";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DashBoard = () => {

    const [totalUser, setTotalUser] = useState([])
    const [totalOrder, setTotalOrder] = useState([])
    const [listBook, setListBook] = useState([])
    const [sold, setSold] = useState([])
    const formatter = (value) => <CountUp end={value} separator="," />;

    const fetchAllDashboard = async () => {
        const res = await getDashBoard();
        if (res && res.data) {
            setTotalUser(res.data.countUser)
            setTotalOrder(res.data.countOrder)
        }
    }

    const fetchAllTotalBook = async () => {
        const res = await totalBook();
        if (res && res.data) {
            setListBook(res.data)
        }
    }

    useEffect(() => {
        fetchAllDashboard()
        fetchAllTotalBook()
    }, [])

    const data = [
        { name: 'Người dùng', value: totalUser, color: 'rgba(0,0,255,0.25)' },
        { name: 'Sản phẩm', value: listBook.length, color: 'rgba(255,0,0,0.25)' },
        { name: 'Đơn hàng', value: totalOrder, color: 'rgba(0,255,0,0.25)' },
    ];

    const DashBoardCard = ({ title, value, icon }) => {
        return (
            <Card className="dashboard-card">
                <div className="dashboard-card-content">
                    <div className="dashboard-card-details">
                        <div className="dashboard-card-title">{title}</div>
                        <div className="dashboard-card-value">
                            <Statistic value={value} formatter={formatter} />
                        </div>
                    </div>
                    <div className="dashboard-card-icon">{icon}</div>
                </div>
            </Card>
        );
    }

    return (
        <div className='dashboard-container'>
            <Row gutter={[20, 20]}>
                <Col span={8}>
                    <DashBoardCard
                        title="Tổng người dùng"
                        value={totalUser}
                        icon={
                            < UserOutlined style={{
                                color: 'blue',
                                backgroundColor: "rgba(0,0,255,0.25)",
                                borderRadius: '20px',
                                fontSize: '24px',
                                padding: 10
                            }} />
                        }
                    />
                </Col>

                <Col span={8}>
                    <DashBoardCard
                        title="Tổng sản phẩm"
                        value={listBook.length}
                        icon={
                            < BookOutlined style={{
                                color: 'red',
                                backgroundColor: "rgba(255,0,0,0.25)",
                                borderRadius: '20px',
                                fontSize: '24px',
                                padding: 10
                            }} />
                        }
                    />
                </Col>

                <Col span={8}>
                    <DashBoardCard
                        title="Tổng đơn hàng"
                        value={totalOrder}
                        icon={
                            <ShoppingCartOutlined style={{
                                color: 'green',
                                backgroundColor: "rgba(0,255,0,0.25)",
                                borderRadius: '20px',
                                fontSize: '24px',
                                padding: 10
                            }} />
                        }
                    />
                </Col>

                <Col span={24}>
                    <Card bordered={false}>
                        <h3>BIỂU ĐỒ THỐNG KÊ</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8884d8" barSize={50}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

        </div>
    );
}

export default DashBoard;
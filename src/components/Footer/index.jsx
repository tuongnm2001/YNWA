import React from 'react';
import { Layout } from 'antd';
import './footer.scss'
import { HeartTwoTone, } from '@ant-design/icons';
const { Footer } = Layout;

const FooterPage = () => {
    return (
        <Layout>
            <Footer style={{ position: 'relative', bottom: 0 }}>
                Ant Design ©{new Date().getFullYear()} Created by NMT <HeartTwoTone twoToneColor="#eb2f96" />
            </Footer>
        </Layout>
    );
}

export default FooterPage;
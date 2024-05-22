import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotPermitted = () => {

    const nagivate = useNavigate()

    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={() => nagivate('/')}>Back Home</Button>}
        />
    );
}

export default NotPermitted;
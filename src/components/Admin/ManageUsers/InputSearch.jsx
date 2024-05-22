import './InputSearch.scss'
import { Button, Divider, Form, Input, message, notification, Col, Row } from 'antd';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

const InputSearch = (props) => {

    const { handleSearch } = props;

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        let query = "";
        if (values.fullName) {
            query += `&fullName=/${values.fullName}/i`
        }

        if (values.email) {
            query += `&email=/${values.email}/i`
        }

        if (values.phone) {
            query += `&phone=/${values.phone}/i`
        }

        if (query) {
            handleSearch(query)
        }
    }

    return (
        <>
            <div className="input-container">
                <div className='form'>
                    <Form
                        name="form-search"
                        onFinish={onFinish}
                        autoComplete="off"
                        form={form}
                    >
                        <Row gutter={24}>
                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Tên hiển thị"
                                    name="fullName"
                                >
                                    <Input width={400} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Email"
                                    name="email"
                                >
                                    <Input width={400} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Số điện thoại"
                                    name="phone"
                                >
                                    <Input width={400} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className='btn-inputSearch'>
                            <Button type="primary" htmlType="submit">
                                <SearchOutlined />Tìm kiếm
                            </Button>

                            <Button onClick={() => { form.resetFields() }}>
                                <ClearOutlined />Làm mới
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default InputSearch;
import './InputSearchBooks.scss'
import { Button, Divider, Form, Input, message, notification, Col, Row } from 'antd';
import { ClearOutlined, SearchOutlined } from '@ant-design/icons';

const InputSearchBooks = (props) => {

    const { handleSearchBooks } = props;

    const [form] = Form.useForm();

    const onFinish = async (values) => {
        let query = ""

        if (values.mainText) {
            query += `&mainText=/${values.mainText}/i`
        }

        if (values.author) {
            query += `&author=/${values.author}/i`
        }

        if (values.category) {
            query += `&category=/${values.category}/i`
        }

        if (query) {
            handleSearchBooks(query);
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
                                    label="Tên sách"
                                    name="mainText"
                                >
                                    <Input width={400} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Tác giả"
                                    name="author"
                                >
                                    <Input width={400} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    labelCol={{ span: 24 }} //whole column
                                    label="Thể loại"
                                    name="category"
                                >
                                    <Input width={400} />
                                </Form.Item>
                            </Col>
                        </Row>

                        <div className='btn-InputSearchBooks'>
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

export default InputSearchBooks;
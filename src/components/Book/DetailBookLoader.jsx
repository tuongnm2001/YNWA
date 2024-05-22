import { Col, Row, Skeleton } from "antd";

const DetailBookLoader = () => {

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col md={10} >
                    {/* <Skeleton.Input active={active} size={size} /> */}
                    <Skeleton.Input
                        active={true}
                        block={true}
                        style={{ width: '100%', height: 300 }}
                    />

                    <div style={{ display: 'flex', gap: '20px', marginTop: '20px', overflow: 'hidden', justifyContent: 'center' }}>
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                        <Skeleton.Image active={true} />
                    </div>
                </Col>

                <Col md={14}>
                    <Skeleton
                        paragraph={{ rows: 3 }}
                        active={true}
                    />
                    <br />
                    <Skeleton
                        paragraph={{ rows: 2 }}
                        active={true}
                    />
                    <div style={{ marginTop: 20, display: 'flex', gap: 20 }}>
                        <Skeleton.Button style={{ width: 100 }} />
                        <Skeleton.Button style={{ width: 100 }} />
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default DetailBookLoader;
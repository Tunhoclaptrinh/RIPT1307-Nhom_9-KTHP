import React, { useState } from 'react';
import { Card, Row, Col, Typography, Select, Button, Divider } from 'antd';
import { RightOutlined, FileSearchOutlined, ReadOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useModel, history } from 'umi';
import styles from './index.less';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const { Option } = Select;

const Dashboard: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { dangXuat } = useModel('users');
  const currentUser = initialState?.currentUser;
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMajor, setSelectedMajor] = useState('Chính quy');

  const handleLogout = async () => {
    try {
      await dangXuat();
      history.push('/user/signin');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Các dịch vụ chính hiển thị trên dashboard
  const services = [
    {
      title: 'Xét tuyển trực tuyến',
      icon: <FileSearchOutlined style={{ fontSize: 24 }} />,
      description: 'Bạn đang tham gia hệ thống xét tuyển trực tuyến đại học của PTIT',
      image: '/images/admission.svg',
    },
    {
      title: 'Nhập học trực tuyến',
      icon: <ReadOutlined style={{ fontSize: 24 }} />,
      description: 'Bạn đang tham gia hệ thống xét tuyển trực tuyến đại học của PTIT',
      image: '/images/enroll.svg',
    },
    {
      title: 'Thanh toán trực tuyến',
      icon: <CreditCardOutlined style={{ fontSize: 24 }} />,
      description: 'Bạn đang tham gia hệ thống xét tuyển trực tuyến đại học của PTIT',
      image: '/images/payment.svg',
    },
  ];

  return (
    <>
      <Header
        button={
          currentUser
            ? [
                <Button type="primary" onClick={handleLogout} key="logout">
                  Đăng xuất
                </Button>,
              ]
            : [
                <Button type="primary" href="/user/signin" style={{ marginRight: 8 }} key="signin">
                  Đăng nhập
                </Button>,
                <Button type="default" href="/user/signup" key="signup">
                  Đăng ký
                </Button>,
              ]
        }
      />
      <div className={styles.dashboardContainer}>
        <Row>
          <Col xs={24} lg={20} style={{ margin: 'auto', paddingTop: 30, paddingBottom: 30 }}>
            {/* Welcome section */}
            <div className={styles.welcomeSection}>
              <Row justify="center" align="middle">
                <Col span={24} style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Typography.Title level={3} style={{ color: '#8b1d1d' }}>
                    Xin chào {currentUser?.fullName || 'Linh'},{' '}
                    <span role="img" aria-label="wave">
                      👋
                    </span>
                  </Typography.Title>
                  <Typography.Paragraph style={{ fontSize: 16 }}>
                    Bạn đang tham gia hệ thống xét tuyển trực tuyến của PTIT
                    <br />
                    Vui lòng chọn mục đích để tiếp tục
                  </Typography.Paragraph>
                </Col>
              </Row>

              {/* Filter section */}
              <Row justify="center" gutter={16} style={{ marginBottom: 30 }}>
                <Col xs={12} md={8} lg={6}>
                  <Select
                    defaultValue="Chính quy"
                    style={{ width: '100%' }}
                    onChange={(value) => setSelectedMajor(value)}
                    size="large"
                  >
                    <Option value="Chính quy">Chính quy</Option>
                    <Option value="Liên thông">Liên thông</Option>
                    <Option value="Vừa làm vừa học">Vừa làm vừa học</Option>
                  </Select>
                </Col>
                <Col xs={12} md={8} lg={6}>
                  <Select
                    defaultValue="2024"
                    style={{ width: '100%' }}
                    onChange={(value) => setSelectedYear(value)}
                    size="large"
                  >
                    <Option value="2024">Năm tuyển sinh 2024</Option>
                    <Option value="2023">Năm tuyển sinh 2023</Option>
                    <Option value="2022">Năm tuyển sinh 2022</Option>
                  </Select>
                </Col>
              </Row>
            </div>

            {/* Services section */}
            <Row gutter={[24, 24]} justify="center">
              {services.map((service, index) => (
                <Col xs={24} sm={24} md={8} key={index}>
                  <Card className={styles.serviceCard} bordered={false} bodyStyle={{ padding: '24px' }} hoverable>
                    <div className={styles.serviceIconContainer}>
                      {service.icon}
                      <Typography.Title level={4} style={{ marginTop: 12, marginBottom: 8 }}>
                        {service.title}
                      </Typography.Title>
                    </div>
                    <Typography.Paragraph style={{ marginBottom: 16 }}>{service.description}</Typography.Paragraph>

                    <div className={styles.serviceImageContainer}>
                      <img
                        src={service.image}
                        alt={service.title}
                        style={{ width: '100%', height: 'auto', maxHeight: 180 }}
                      />
                    </div>

                    <div style={{ textAlign: 'right', marginTop: 16 }}>
                      <Button type="link" style={{ padding: 0 }}>
                        Xem chi tiết <RightOutlined />
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Popular majors section */}
            <Divider style={{ margin: '40px 0 20px' }} />

            <Row gutter={[24, 24]}>
              <Col span={12} style={{ margin: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: '#f5222d',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      marginRight: 12,
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>HOT</span>
                  </div>
                  <Typography.Title level={4} style={{ margin: 0, justifyContent: 'center' }}>
                    Top ngành HOT nhất
                  </Typography.Title>
                </div>
                <Typography.Paragraph style={{ marginTop: 8, justifyContent: 'center', textAlign: 'center' }}>
                  Hiện nay có 16 ngành đang có thông tin để bạn xem
                </Typography.Paragraph>
              </Col>

              <Col span={12} style={{ margin: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: '#52c41a',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%',
                      marginRight: 12,
                    }}
                  >
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>MỚI</span>
                  </div>
                  <Typography.Title level={4} style={{ margin: 0, justifyContent: 'center' }}>
                    Top ngành MỚI nhất
                  </Typography.Title>
                </div>
                <Typography.Paragraph style={{ marginTop: 8, justifyContent: 'center', textAlign: 'center' }}>
                  Hiện nay có 8 ngành mới để bạn xem
                </Typography.Paragraph>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
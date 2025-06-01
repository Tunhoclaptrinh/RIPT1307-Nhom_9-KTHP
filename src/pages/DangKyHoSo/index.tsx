import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Steps, message, Space, Typography } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import axios from 'axios';
import moment from 'moment';
import StepContent from './components/StepContent';
import Sidebar from './components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useAuth from '../../hooks/useAuth';
import { ipLocal } from '@/utils/ip';
import { HoSo } from '@/services/HoSo/typing';

const { Title, Text } = Typography;

const UniversityRegistrationForm: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { getModel } = useModel('hoso');
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      message.warning('Vui lòng đăng nhập để nộp hồ sơ tuyển sinh.');
      history.push('/user/login');
    }
  }, [isAuthenticated, isLoading]);

  // Tự động điền thông tin người dùng từ useAuth
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ho: user.ho,
        ten: user.ten,
        hoTen: user.fullName || `${user.ho} ${user.ten}`,
        soCCCD: user.soCCCD,
        email: user.email,
        soDienThoai: user.soDT,
        gioiTinh: user.gioiTinh,
        ngaySinh: user.ngaySinh ? moment(user.ngaySinh) : undefined,
        hoKhauThuongTru: user.hoKhauThuongTru
          ? {
              tinh_ThanhPho: user.hoKhauThuongTru.tinh_ThanhPho,
              quanHuyen: user.hoKhauThuongTru.quanHuyen,
              xaPhuong: user.hoKhauThuongTru.xaPhuong,
              diaChi: user.hoKhauThuongTru.diaChi,
            }
          : undefined,
        ngayCap: user.ngayCap ? moment(user.ngayCap) : undefined,
        noiCap: user.noiCap,
      });
    }
  }, [user, form]);

  const onFinish = async (values: any) => {
    try {
      const submitData: HoSo.IRecord = {
        id: `HOSO${Date.now()}`, // Generate unique ID
        thongTinCaNhanId: user?.id || `user_${Date.now()}`,
        thongTinBoSung: {
          danToc: values.danToc || 'kinh',
          quocTich: values.quocTich || 'Việt Nam',
          tonGiao: values.tonGiao || 'không',
          noiSinh: {
            trongNuoc: values.noiSinh?.trongNuoc !== undefined ? values.noiSinh.trongNuoc : true,
            tinh_ThanhPho: values.noiSinh?.tinh_ThanhPho || values.hoKhauThuongTru?.tinh_ThanhPho,
          },
        },
        thongTinLienHe: {
          ten: values.hoTen || `${values.ho} ${values.ten}`.trim(),
          diaChi: {
            tinh_ThanhPho: values.hoKhauThuongTru?.tinh_ThanhPho,
            quanHuyen: values.hoKhauThuongTru?.quanHuyen,
            xaPhuong: values.hoKhauThuongTru?.xaPhuong,
            diaChiCuThe: values.hoKhauThuongTru?.diaChi,
          },
        },
        nguyenVong: values.nguyenVong || [], // Populated from later steps
        tinhTrang: 'chờ duyệt',
        ketQua: {
          succes: false,
          nguyenVongDo: '',
          phuongThucId: '',
          diem: 0,
        },
      };

      const response = await axios.post(`${ipLocal}/hoSo`, submitData);

      if (response.status !== 201) {
        throw new Error('Không thể gửi hồ sơ. Vui lòng thử lại.');
      }

      message.success('Nộp hồ sơ thành công! Cảm ơn bạn đã đăng ký.');
      // Trigger refresh of HoSoPage data
      getModel();
      history.push('/public/dash-board');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Đã có lỗi xảy ra khi nộp hồ sơ.';
      message.error(errorMessage);
    }
  };

  const steps = [
    { title: 'Thông tin cá nhân', icon: <FileTextOutlined /> },
    { title: 'Thông tin học tập', icon: <FileTextOutlined /> },
    { title: 'Nguyện vọng', icon: <FileTextOutlined /> },
    { title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
  ];

  const nextStep = () => {
    form
      .validateFields()
      .then(() => {
        setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
      })
      .catch(() => {
        message.error('Vui lòng hoàn thành tất cả các trường bắt buộc trước khi tiếp tục.');
      });
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <Header />
      <Row
        justify='center'
        style={{
          minHeight: '100vh',
          background: '#f5f5f5',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Col xs={24} lg={20}>
          <Row gutter={24} style={{ margin: '90px auto' }}>
            {/* Sidebar */}
            <Col xs={24} lg={6}>
              <Sidebar currentStep={currentStep} />
            </Col>

            {/* Main Content */}
            <Col xs={24} lg={18}>
              <Card
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FileTextOutlined style={{ marginRight: '8px', color: '#ff4d4f' }} />
                    <Title level={4} style={{ margin: 0 }}>
                      {steps[currentStep]?.title || 'Đăng ký tuyển sinh'}
                    </Title>
                  </div>
                }
                extra={
                  <Text type='secondary'>
                    Bước {currentStep + 1} / {steps.length}
                  </Text>
                }
              >
                <Form form={form} layout='vertical' onFinish={onFinish}>
                  <StepContent currentStep={currentStep} />

                  <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <Space size='large'>
                      {currentStep > 0 && (
                        <Button size='large' onClick={prevStep}>
                          Quay lại
                        </Button>
                      )}
                      {currentStep < steps.length - 1 ? (
                        <Button
                          type='primary'
                          size='large'
                          onClick={nextStep}
                          style={{
                            minWidth: '150px',
                            background: '#ff4d4f',
                            borderColor: '#ff4d4f',
                          }}
                        >
                          {currentStep === steps.length - 2 ? 'Hoàn tất' : 'Tiếp tục'}
                        </Button>
                      ) : (
                        <Button
                          type='primary'
                          htmlType='submit'
                          size='large'
                          style={{
                            minWidth: '150px',
                            background: '#52c41a',
                            borderColor: '#52c41a',
                          }}
                        >
                          Nộp hồ sơ
                        </Button>
                      )}
                    </Space>
                  </div>
                </Form>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Footer />
    </>
  );
};

export default UniversityRegistrationForm;
import React, { useState } from 'react';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Checkbox, Row, Col, Select } from 'antd';
import { Link, history } from 'umi';
import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import styles from './index.less';
import { register } from '@/services/user';

const SignUp: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      if (values.password !== values.confirmPassword) {
        message.error('Mật khẩu không khớp');
        return;
      }

      setSubmitting(true);

      const userData = {
        username: values.username,
        password: values.password,
        email: values.email,
        soCCCD: values.idNumber,
        ho: values.ho,
        ten: values.ten,
        gioiTinh: values.gioiTinh,
        ngaySinh: values.dateOfBirth,
        soDT: values.phone,
      };

      await register(userData);
      message.success('Đăng ký thành công! Vui lòng đăng nhập');
      form.resetFields();
      history.push('/user');
    } catch (error: any) {
      message.error(error.message || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <div className={styles.headerIcon}>
          <UserOutlined style={{ color: 'white', fontSize: 24 }} />
        </div>
        <h1 className={styles.headerTitle}>Đăng ký tài khoản</h1>
        <p className={styles.headerDesc}>Tạo tài khoản mới để bắt đầu hành trình của bạn</p>

        <Form form={form} onFinish={handleSubmit} layout='vertical'>
          <Row gutter={16}>
            <Col md={12} span={24}>
              <Form.Item name='ho' label='Họ và tên đệm' rules={rules.required}>
                <Input prefix={<UserOutlined />} placeholder='Nhập họ và tên đệm' size='large' />
              </Form.Item>
            </Col>
            <Col md={12} span={24}>
              <Form.Item name='ten' label='Tên' rules={rules.required}>
                <Input prefix={<UserOutlined />} placeholder='Nhập tên của bạn' size='large' />
              </Form.Item>
            </Col>

            <Col md={12} span={24}>
              <Form.Item name='username' label='Tên đăng nhập' rules={rules.required}>
                <Input prefix={<UserOutlined />} placeholder='Nhập tên đăng nhập' size='large' />
              </Form.Item>
            </Col>
            <Col md={12} span={24}>
              <Form.Item name='email' label='Email' rules={[...rules.required, ...rules.email]}>
                <Input prefix={<MailOutlined />} placeholder='Nhập địa chỉ email' size='large' />
              </Form.Item>
            </Col>
            <Col md={12} span={24}>
              <Form.Item name='gioiTinh' label='Giới tính' rules={rules.required}>
                <Select placeholder='Chọn giới tính' size='large'>
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col md={12} span={24}>
              <Form.Item name='phone' label='Số điện thoại' rules={rules.required}>
                <Input prefix={<PhoneOutlined />} placeholder='Nhập số điện thoại' size='large' />
              </Form.Item>
            </Col>

            <Col md={12} span={24}>
              <Form.Item name='dateOfBirth' label='Ngày sinh'>
                <MyDatePicker placeholder='Chọn ngày sinh' format='DD/MM/YYYY' style={{ width: '100%' }} size='large' />
              </Form.Item>
            </Col>
            <Col md={12} span={24}>
              <Form.Item name='idNumber' label='Số CMND/CCCD' rules={rules.required}>
                <Input prefix={<IdcardOutlined />} placeholder='Nhập số CMND/CCCD' size='large' />
              </Form.Item>
            </Col>

            <Col md={12} span={24}>
              <Form.Item name='password' label='Mật khẩu' rules={[...rules.required, ...rules.password]}>
                <Input.Password prefix={<LockOutlined />} placeholder='Nhập mật khẩu' size='large' />
              </Form.Item>
            </Col>
            <Col md={12} span={24}>
              <Form.Item
                name='confirmPassword'
                label='Xác nhận mật khẩu'
                dependencies={['password']}
                rules={[
                  ...rules.required,
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu không khớp'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder='Nhập lại mật khẩu' size='large' />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='terms'
                valuePropName='checked'
                rules={[{
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản sử dụng')),
                }]}
              >
                <Checkbox>
                  Tôi đã đọc và đồng ý với{' '}
                  <a href='#' className='text-blue-600 hover:underline'>điều khoản sử dụng</a>
                </Checkbox>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button
                  type='primary'
                  htmlType='submit'
                  block
                  size='large'
                  loading={submitting}
                  className={styles.submitButton}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Col>

            <Col span={24} className={styles.loginLink}>
              Đã có tài khoản?{' '}
              <Link to='/user/login'>Đăng nhập ngay</Link>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;

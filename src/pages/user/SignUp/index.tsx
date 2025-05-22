import { LockOutlined, UserOutlined, MailOutlined, IdcardOutlined, PhoneOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Checkbox, DatePicker, Select, Col, Row } from 'antd';
import { register } from '@/services/user';
import { history } from 'umi';
import React, { useState } from 'react';
import { Link } from 'umi';
import styles from './index.less';

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
        soCCCD: values.soCCCD,
        ngayCap: values.ngayCap,
        noiCap: values.noiCap,
        ho: values.ho,
        ten: values.ten,
        hoKhauThuongTru: {
          tinh_ThanhPho: values.tinhThanhPho,
          quanHuyen: values.quanHuyen,
          xaPhuong: values.xaPhuong,
          diaChi: values.diaChi
        },
        ngaySinh: values.ngaySinh,
        gioiTinh: values.gioiTinh,
        soDT: values.soDT
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
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <img alt='logo' className={styles.logo} src='/logo-full.svg' />
          </div>
        </div>

        <div className={styles.main}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Đăng ký tuyển sinh</h2>
          
          <Form form={form} onFinish={handleSubmit} layout='vertical'>
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item name='username' label='Tên đăng nhập' rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
        <Input prefix={<UserOutlined />} placeholder='Tên đăng nhập' size='large' />
      </Form.Item>
    </Col>

    <Col span={6}>
      <Form.Item name='ho' label='Họ' rules={[{ required: true, message: 'Vui lòng nhập họ' }]}>
        <Input placeholder='Họ' size='large' />
      </Form.Item>
    </Col>

    <Col span={6}>
      <Form.Item name='ten' label='Tên' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
        <Input placeholder='Tên' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='gioiTinh' label='Giới tính' rules={[{ required: true, message: 'Chọn giới tính' }]}>
        <Select placeholder="Giới tính" size="large">
          <Select.Option value="nam">Nam</Select.Option>
          <Select.Option value="nu">Nữ</Select.Option>
          <Select.Option value="khac">Khác</Select.Option>
        </Select>
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='ngaySinh' label='Ngày sinh' rules={[{ required: true, message: 'Chọn ngày sinh' }]}>
        <DatePicker style={{ width: '100%' }} size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='soCCCD' label='Số CCCD' rules={[
        { required: true, message: 'Vui lòng nhập số CCCD' },
        { pattern: /^[0-9]{12}$/, message: 'Số CCCD phải có 12 chữ số' }
      ]}>
        <Input prefix={<IdcardOutlined />} placeholder='Số CCCD' size='large' />
      </Form.Item>
    </Col>

    <Col span={6}>
      <Form.Item name='ngayCap' label='Ngày cấp' rules={[{ required: true, message: 'Chọn ngày cấp' }]}>
        <DatePicker style={{ width: '100%' }} size='large' />
      </Form.Item>
    </Col>

    <Col span={6}>
      <Form.Item name='noiCap' label='Nơi cấp' rules={[{ required: true, message: 'Nhập nơi cấp' }]}>
        <Input placeholder='Nơi cấp' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='tinhThanhPho' label='Tỉnh/Thành phố' rules={[{ required: true, message: 'Nhập tỉnh/thành phố' }]}>
        <Input prefix={<HomeOutlined />} placeholder='Tỉnh/TP' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='quanHuyen' label='Quận/Huyện' rules={[{ required: true, message: 'Nhập quận/huyện' }]}>
        <Input placeholder='Quận/Huyện' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='xaPhuong' label='Xã/Phường' rules={[{ required: true, message: 'Nhập xã/phường' }]}>
        <Input placeholder='Xã/Phường' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='diaChi' label='Địa chỉ' rules={[{ required: true, message: 'Nhập địa chỉ' }]}>
        <Input placeholder='Số nhà, đường...' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='soDT' label='Số điện thoại' rules={[{ required: true, message: 'Nhập số điện thoại' }]}>
        <Input prefix={<PhoneOutlined />} placeholder='Số điện thoại' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='email' label='Email' rules={[
        { required: true, message: 'Nhập email' },
        { type: 'email', message: 'Email không hợp lệ' }
      ]}>
        <Input prefix={<MailOutlined />} placeholder='Email' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='password' label='Mật khẩu' rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
        <Input.Password prefix={<LockOutlined />} placeholder='Mật khẩu' size='large' />
      </Form.Item>
    </Col>

    <Col span={12}>
      <Form.Item name='confirmPassword' label='Xác nhận mật khẩu' dependencies={['password']} rules={[
        { required: true, message: 'Xác nhận mật khẩu' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject('Mật khẩu không khớp');
          },
        }),
      ]}>
        <Input.Password prefix={<LockOutlined />} placeholder='Nhập lại mật khẩu' size='large' />
      </Form.Item>
    </Col>

    <Col span={24}>
      <Form.Item
        name='terms'
        valuePropName='checked'
        rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Bạn phải đồng ý điều khoản') }]}
      >
        <Checkbox>
          Tôi đồng ý với <a href='#'>điều khoản sử dụng</a>
        </Checkbox>
      </Form.Item>
    </Col>

    <Col span={24}>
      <Button type='primary' htmlType='submit' block size='large' loading={submitting}>
        Đăng ký
      </Button>
    </Col>
  </Row>
</Form>


          <div style={{ textAlign: 'center', marginTop: 16 }}>
            Đã có tài khoản? <Link to='/user'>Đăng nhập</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

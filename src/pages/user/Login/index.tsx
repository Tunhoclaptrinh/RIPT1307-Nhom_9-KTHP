import React, { useState } from 'react';
import { Button, Form, Input, message, Row, Col } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useModel, useIntl, history } from 'umi';
import styles from './index.less';

// Giả lập dữ liệu từ db.json
const users = [
  {
    id: 'user_001',
    password: 'hashedpassword123',
    username: 'nguyenvana',
    soCCCD: '001234567890',
    email: 'nguyenvana@email.com',
    ho: 'Nguyễn Văn',
    ten: 'An',
  },
  {
    id: 'user_002',
    password: 'hashedpassword456',
    username: 'tranthib',
    soCCCD: '001234567891',
    email: 'tranthib@email.com',
    ho: 'Trần Thị',
    ten: 'Bình',
  },
  {
    id: 'a46a',
    email: 'lehaianhp280620051@gmail.com',
    ho: 'Lê Hải',
    ten: 'An',
    password: 'http://localhost:8000/user/signup',
    soCCCD: '123',
  },
  {
    id: '94fb',
    email: 'lehaianhp280620051@gmail.com',
    ho: 'Lê Hải',
    ten: 'An',
    password: '1234',
    soCCCD: '123',
  },
  {
    id: 'ae4d',
    email: 'lehaianhp280620051@gmail.com',
    ho: 'Lê Hải',
    ten: 'An',
    password: '1234',
    soCCCD: '123',
  },
];

const Login: React.FC = () => {
  const { setInitialState } = useModel('@@initialState');
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const intl = useIntl();

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      const { login, password } = values;

      // Tìm user với email hoặc soCCCD khớp
      const user = users.find(
        (u) => (u.email === login || u.soCCCD === login) && u.password === password
      );

      if (user) {
        // Lưu thông tin user vào initialState
        await setInitialState({
          currentUser: {
            id: user.id,
            fullName: `${user.ho} ${user.ten}`,
            email: user.email,
            soCCCD: user.soCCCD,
          },
        });
        message.success('Đăng nhập thành công');
        history.push('/public/dash-board'); // Chuyển hướng đến trang Dashboard của thí sinh
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img alt="logo" className={styles.logo} src="/logo-full.svg" />
            </div>
          </div>
        </div>

        <div className={styles.main}>
          <span
            style={{ fontWeight: 600, color: '#000', marginBottom: 30, textAlign: 'center' }}
            className={styles.desc}
          >
            Đăng nhập vào hệ thống
          </span>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 10 }}>
            <Row gutter={[16, 0]}>
              <Col span={24}>
                <Form.Item
                  name="login"
                  label="Email hoặc Số CMND/CCCD"
                  rules={[{ required: true, message: 'Vui lòng nhập email hoặc số CMND/CCCD' }]}
                >
                  <Input
                    placeholder="Nhập email hoặc số CMND/CCCD"
                    prefix={<MailOutlined className={styles.prefixIcon} />}
                    size="large"
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
                >
                  <Input.Password
                    placeholder="Nhập mật khẩu"
                    prefix={<LockOutlined className={styles.prefixIcon} />}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            Chưa có tài khoản? <a href="/user/signup">Đăng ký ngay</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Checkbox } from 'antd';
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
        fullName: values.fullName || '',
        phone: values.phone || ''
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
            <Form.Item
              name='username'
              label='Tên đăng nhập'
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input
                placeholder='Nhập tên đăng nhập'
                prefix={<UserOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>

            <Form.Item 
              name='email'
              label='Email'
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input
                placeholder='Nhập email'
                prefix={<MailOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>

            <Form.Item
              name='password'
              label='Mật khẩu'
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                placeholder='Nhập mật khẩu'
                prefix={<LockOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>

            <Form.Item
              name='confirmPassword'
              label='Xác nhận mật khẩu'
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject('Mật khẩu không khớp');
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder='Nhập lại mật khẩu'
                prefix={<LockOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>

            <Form.Item
              name='terms'
              valuePropName='checked'
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject('Bạn phải đồng ý điều khoản'),
                },
              ]}
            >
              <Checkbox>
                Tôi đồng ý với <a href='#'>điều khoản sử dụng</a>
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button 
                type='primary' 
                htmlType='submit' 
                block 
                size='large' 
                loading={submitting}
              >
                Đăng ký
              </Button>
            </Form.Item>
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

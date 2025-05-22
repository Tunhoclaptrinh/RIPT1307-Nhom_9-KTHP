import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { login } from '@/services/user';
import React, { useState } from 'react';
import { history } from 'umi';
import styles from './index.less';

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      setSubmitting(true);
      const user = await login(values.username, values.password);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userInfo', JSON.stringify(user));
      message.success('Đăng nhập thành công');
      history.push('/dashboard');
    } catch (error: any) {
      message.error(error.message || 'Đăng nhập thất bại');
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
          <Form
            form={form}
            onFinish={handleSubmit}
            layout='vertical'
          >
            <Form.Item 
              name='username' 
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input
                placeholder='Nhập tên đăng nhập'
                prefix={<UserOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>
            <Form.Item 
              name='password' 
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password
                placeholder='Nhập mật khẩu'
                prefix={<LockOutlined className={styles.prefixIcon} />}
                size='large'
              />
            </Form.Item>

            <Button 
              type='primary' 
              htmlType='submit' 
              block 
              size='large' 
              loading={submitting}
            >
              Đăng nhập
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

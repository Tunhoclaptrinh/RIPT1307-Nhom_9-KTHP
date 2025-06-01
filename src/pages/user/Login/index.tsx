import React from 'react';
import { Button, Form, Input, Row, Col } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import styles from './index.less';
import useAuth from '../../../hooks/useAuth';

const Login: React.FC = () => {
	const { login, isLoading } = useAuth();
	const [form] = Form.useForm();
	const intl = useIntl();

	const handleSubmit = async (values: any) => {
		try {
			await login(values.login, values.password);
		} catch (error) {
			// Lỗi đã được xử lý trong useAuth, không cần xử lý thêm
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.top}>
					<div className={styles.header}>
						<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
							<img alt='logo' className={styles.logo} src='/logo-full.svg' />
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
					<Form form={form} onFinish={handleSubmit} layout='vertical' style={{ marginTop: 10 }}>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item
									name='login'
									label='Email hoặc Số CMND/CCCD'
									rules={[{ required: true, message: 'Vui lòng nhập email hoặc số CMND/CCCD' }]}
								>
									<Input
										placeholder='Nhập email hoặc số CMND/CCCD'
										prefix={<MailOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
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
							</Col>
						</Row>

						<Form.Item>
							<Button type='primary' htmlType='submit' block size='large' loading={isLoading}>
								Đăng nhập
							</Button>
						</Form.Item>
					</Form>

					<div style={{ textAlign: 'center', marginTop: 16 }}>
						Chưa có tài khoản? <a href='/user/signup'>Đăng ký ngay</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;

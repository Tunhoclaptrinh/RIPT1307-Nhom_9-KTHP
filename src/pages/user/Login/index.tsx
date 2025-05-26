import React, { useState } from 'react';
import { Button, Form, Input, message, Row, Col } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useModel, useIntl, history } from 'umi';
import styles from './index.less';
import { dangNhap, getUserById } from '@/utils/loginsignup'; // Import API functions

const Login: React.FC = () => {
	const { setInitialState } = useModel('@@initialState');
	const [submitting, setSubmitting] = useState(false);
	const [form] = Form.useForm();
	const intl = useIntl();

	const handleSubmit = async (values: any) => {
		try {
			setSubmitting(true);
			const { login, password } = values;

			// Call the login API
			const loginResponse = await dangNhap(login, password);
			const { userId } = loginResponse.data; // Assuming API returns userId

			if (userId) {
				// Store userId in local storage
				localStorage.setItem('userId', userId);

				// Fetch user details using getUserById
				const userResponse = await getUserById(userId);
				const user = userResponse.data;

				// Save user info to initialState
				await setInitialState({
					currentUser: {
						id: user.id,
						fullName: `${user.ho} ${user.ten}`,
						email: user.email,
						soCCCD: user.soCCCD,
					},
				});

				message.success('Đăng nhập thành công');
				history.push('/public/dash-board'); // Redirect to dashboard
			} else {
				throw new Error('Invalid credentials');
			}
		} catch (error) {
			message.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
		} finally {
			setSubmitting(false);
		}
	};

	// Check if user is already logged in
	React.useEffect(() => {
		const userId = localStorage.getItem('userId');
		if (userId) {
			// Fetch user details and set initial state
			getUserById(userId)
				.then((response) => {
					const user = response.data;
					setInitialState({
						currentUser: {
							id: user.id,
							fullName: `${user.ho} ${user.ten}`,
							email: user.email,
							soCCCD: user.soCCCD,
						},
					});
					// Optionally redirect to dashboard if already logged in
					history.push('/public/dash-board');
				})
				.catch(() => {
					localStorage.removeItem('userId'); // Clear invalid userId
				});
		}
	}, [setInitialState]);

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
							<Button type='primary' htmlType='submit' block size='large' loading={submitting}>
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

import MyDatePicker from '@/components/MyDatePicker';
import { keycloakAuthority } from '@/utils/ip';
import rules from '@/utils/rules';
import { LockOutlined, UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tabs, message, Checkbox, Row, Col } from 'antd';
import React, { useState } from 'react';
import { useIntl, Link, useModel } from 'umi';
import styles from './index.less';

const SignUp: React.FC = () => {
	const { dangKy } = useModel('users');
	const [submitting, setSubmitting] = useState(false);
	const [form] = Form.useForm();
	const intl = useIntl();

	const handleSubmit = async (values: any) => {
		try {
			// Kiểm tra xác nhận mật khẩu
			if (values.password !== values.confirmPassword) {
				message.error('Mật khẩu và xác nhận mật khẩu không khớp');
				return;
			}
			setSubmitting(true);
			await dangKy(values);
		} catch (error) {
			message.error('Đăng ký tài khoản thất bại');
		}
		setSubmitting(false);
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
						Đăng ký tài khoản mới
					</span>
					<Form form={form} onFinish={handleSubmit} layout='vertical' style={{ marginTop: 10 }}>
						<Row gutter={[16, 0]}>
							<Col span={24}>
								<Form.Item name='email' label='Email' rules={[...rules.required, ...rules.email]}>
									<Input
										placeholder='Nhập địa chỉ email'
										prefix={<MailOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24} md={12}>
								<Form.Item name='ho' label='Họ và tên đệm' rules={[...rules.required]}>
									<Input
										placeholder='Nhập họ và tên riêng'
										prefix={<UserOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24} md={12}>
								<Form.Item name='ten' label='Tên' rules={[...rules.required]}>
									<Input
										placeholder='Nhập tên của bạn'
										prefix={<UserOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item name='password' label='Mật khẩu' rules={[...rules.required, ...rules.password]}>
									<Input.Password
										placeholder='Nhập mật khẩu'
										prefix={<LockOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item
									name='confirmPassword'
									label='Xác nhận mật khẩu'
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
									<Input.Password
										placeholder='Nhập lại mật khẩu'
										prefix={<LockOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24} md={12}>
								<Form.Item name='soDT' label='Số điện thoại' rules={[...rules.required]}>
									<Input
										placeholder='Nhập số điện thoại'
										prefix={<PhoneOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24} md={12}>
								<Form.Item name='ngaySinh' label='Ngày sinh'>
									<MyDatePicker
										placeholder='Chọn ngày sinh'
										format='DD/MM/YYYY'
										style={{ width: '100%' }}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item name='soCCCD' label='Số CMND/CCCD' rules={[...rules.required]}>
									<Input
										placeholder='Nhập số CMND/CCCD'
										prefix={<IdcardOutlined className={styles.prefixIcon} />}
										size='large'
									/>
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item
									name='terms'
									valuePropName='checked'
									rules={[
										{
											validator: (_, value) =>
												value ? Promise.resolve() : Promise.reject(new Error('Bạn phải đồng ý với điều khoản sử dụng')),
										},
									]}
								>
									<Checkbox>
										Tôi đã đọc và đồng ý với{' '}
										<a href='#' target='_blank'>
											điều khoản sử dụng
										</a>
									</Checkbox>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item>
							<Button type='primary' htmlType='submit' block size='large' loading={submitting}>
								Đăng ký
							</Button>
						</Form.Item>
					</Form>

					<div style={{ textAlign: 'center', marginTop: 16 }}>
						Đã có tài khoản? <Link to='/user/login'>Đăng nhập ngay</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;

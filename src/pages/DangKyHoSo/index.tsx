import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Steps, message, Space, Typography, Progress, Modal } from 'antd';
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { logout } from '@/services/user';
import StepContent from './components/StepContent';
import Sidebar from './components/Sidebar';
import moment from 'moment';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const { Title, Text } = Typography;

const UniversityRegistrationForm = () => {
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);

	const onFinish = (values: any) => {
		console.log('Form values:', values);
		message.success('Đăng ký thành công!');
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
				setCurrentStep(Math.min(currentStep + 1, 3));
			})
			.catch((error) => {
				message.error('Vui lòng hoàn thành thông tin trước khi tiếp tục');
			});
	};

	const prevStep = () => {
		setCurrentStep(Math.max(currentStep - 1, 0));
	};

	return (
		<>
			{' '}
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
					<Row gutter={24} style={{ margin: '0 auto' }}>
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
										{steps[currentStep]?.title || 'Đăng ký tuyển sinh'}
									</div>
								}
								extra={
									<Text type='secondary'>
										Bước {currentStep + 1} / {steps.length}
									</Text>
								}
							>
								<Form
									form={form}
									layout='vertical'
									onFinish={onFinish}
									initialValues={{
										hoTen: 'Nguyễn Thị Thảo Linh',
										soCCCD: '036019018233',
										email: 'thaolinh@gmail.com',
										soDienThoai: '0918876333',
										gioiTinh: 'Nữ',
										danToc: 'Kinh',
										tonGiao: 'Không',
										noiSinh: 'Thành phố Cần Thơ',
										hoKhauThuongTru: 'Thành phố Cần Thơ, Huyện Cư Dú, Thị trấn Cù Dú, Số 1, đường Nguyễn Văn Cừ',
										ngayCap: moment('2024-03-01'),
										ngaySinh: moment('2006-03-01'),
									}}
								>
									<StepContent currentStep={currentStep} />

									<div style={{ textAlign: 'center', marginTop: '32px' }}>
										<Space size='large'>
											{currentStep > 0 && (
												<Button size='large' onClick={prevStep}>
													Quay lại
												</Button>
											)}
											{currentStep < 3 ? (
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
													{currentStep === 2 ? 'Hoàn tất' : 'Tiếp tục'}
												</Button>
											) : (
												<Button
													type='primary'
													size='large'
													onClick={() => message.success('Cảm ơn bạn đã đăng ký!')}
													style={{
														minWidth: '150px',
														background: '#52c41a',
														borderColor: '#52c41a',
													}}
												>
													Hoàn tất
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

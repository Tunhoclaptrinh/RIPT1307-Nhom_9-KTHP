import React, { useState } from 'react';
import {
	Form,
	Input,
	Button,
	Card,
	Row,
	Col,
	DatePicker,
	Select,
	Typography,
	Steps,
	message,
	Avatar,
	Timeline,
	Divider,
} from 'antd';
import {
	UserOutlined,
	IdcardOutlined,
	BookOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	EditOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const UniversityRegistrationForm = () => {
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({});

	// Timeline data cho quy trình đăng ký
	const timelineItems = [
		{
			color: 'red',
			dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
			children: (
				<div>
					<Text strong>00:00 01/03/2024</Text>
					<br />
					<Text type='secondary'>Mở đăng ký hồ sơ tuyển</Text>
				</div>
			),
		},
		{
			color: 'blue',
			children: (
				<div>
					<Text strong>23:59 26/05/2024</Text>
					<br />
					<Text type='secondary'>Kết thúc nộp hồ sơ tuyển sinh</Text>
				</div>
			),
		},
		{
			color: 'green',
			children: (
				<div>
					<Text strong>17:00 30/06/2024</Text>
					<br />
					<Text type='secondary'>Công bố kết quả tuyển sinh</Text>
				</div>
			),
		},
	];

	const onFinish = (values: any) => {
		console.log('Form values:', values);
		message.success('Đăng ký thành công!');
	};

	const steps = [
		{
			title: 'Thông tin cá nhân',
			icon: <UserOutlined />,
		},
		{
			title: 'Thông tin liên hệ',
			icon: <IdcardOutlined />,
		},
		{
			title: 'Thông tin học tập',
			icon: <BookOutlined />,
		},
	];

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				padding: '20px 0',
			}}
		>
			<Row gutter={24} style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
				{/* Sidebar */}
				<Col xs={24} lg={6}>
					<Card style={{ marginBottom: '20px' }}>
						<div style={{ textAlign: 'center', marginBottom: '16px' }}>
							<Avatar size={64} style={{ backgroundColor: '#ff4d4f' }}>
								NL
							</Avatar>
							<Title level={5} style={{ marginTop: '8px', marginBottom: '4px' }}>
								Nguyễn Thị Thảo Linh
							</Title>
							<Text type='secondary'>Mã hồ sơ: PTT2400009</Text>
							<br />
							<Text type='secondary'>CCCD: 036019018233</Text>
							<br />
							<Text type='secondary' style={{ color: '#52c41a' }}>
								Trạng thái: Chưa hoàn
							</Text>
						</div>

						<Timeline items={timelineItems} />

						<Button type='primary' danger block size='large' style={{ marginTop: '16px' }} icon={<EditOutlined />}>
							Bổ sung hồ sơ trực tuyến
						</Button>
					</Card>
				</Col>

				{/* Main Content */}
				<Col xs={24} lg={18}>
					<Card title='Quy trình đăng ký' style={{ marginBottom: '20px' }}>
						<Steps current={currentStep} items={steps} />
					</Card>

					<Card title='Thông tin cá nhân'>
						<Form
							form={form}
							layout='vertical'
							onFinish={onFinish}
							initialValues={{
								hoTen: 'Nguyễn Thị Thảo Linh',
								soCCCD: '036019018233',
								ngayCap: moment('01/03/2024', 'DD/MM/YYYY'),
								email: 'thaolinh@gmail.com',
								soDienThoai: '0918876333',
								ngaySinh: moment('01/03/2006', 'DD/MM/YYYY'),
								gioiTinh: 'Nữ',
								danToc: 'Kinh',
								tonGiao: 'Không',
								noiSinh: 'Thành phố Cần Thơ',
								queQuan: 'Việt Nam',
								hoKhauThuongTru: 'Thành phố Cần Thơ, Huyện Cư Dú, Thị trấn Cù Dú, Số 1, đường Nguyễn Văn Cừ',
							}}
						>
							<Row gutter={16}>
								<Col span={8}>
									<Form.Item label='Họ tên' name='hoTen' rules={[{ required: true }]}>
										<Input placeholder='Nhập họ tên' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Tên' name='ten'>
										<Input placeholder='Linh' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Số CMND/CCCD (hoặc hộ chiếu)' name='soCCCD' rules={[{ required: true }]}>
										<Input placeholder='036019018233' />
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={8}>
									<Form.Item label='Ngày cấp' name='ngayCap' rules={[{ required: true }]}>
										<DatePicker style={{ width: '100%' }} placeholder='01/03/2024' format='DD/MM/YYYY' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Email' name='email' rules={[{ required: true, type: 'email' }]}>
										<Input placeholder='thaolinh@gmail.com' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Số điện thoại' name='soDienThoai' rules={[{ required: true }]}>
										<Input placeholder='0918876333' />
									</Form.Item>
								</Col>
							</Row>

							<Divider plain>Thông tin bổ sung</Divider>

							<Row gutter={16}>
								<Col span={8}>
									<Form.Item label='Ngày sinh' name='ngaySinh' rules={[{ required: true }]}>
										<DatePicker style={{ width: '100%' }} placeholder='09/03/2006' format='DD/MM/YYYY' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Giới tính' name='gioiTinh' rules={[{ required: true }]}>
										<Select placeholder='Nữ'>
											<Option value='Nam'>Nam</Option>
											<Option value='Nữ'>Nữ</Option>
											<Option value='Khác'>Khác</Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Dân tộc' name='danToc'>
										<Input placeholder='Kinh' />
									</Form.Item>
								</Col>
							</Row>

							<Row gutter={16}>
								<Col span={8}>
									<Form.Item label='Quốc tịch' name='quocTich'>
										<Input placeholder='Việt Nam' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Tôn giáo' name='tonGiao'>
										<Input placeholder='Không' />
									</Form.Item>
								</Col>
								<Col span={8}>
									<Form.Item label='Nơi sinh' name='noiSinh'>
										<Input placeholder='Thành phố Cần Thơ' />
									</Form.Item>
								</Col>
							</Row>

							<Form.Item label='Hộ khẩu thường trú' name='hoKhauThuongTru' rules={[{ required: true }]}>
								<Input placeholder='Thành phố Cần Thơ' />
							</Form.Item>

							<Divider plain>Thông tin liên hệ</Divider>

							<Row gutter={16}>
								<Col span={12}>
									<Form.Item label='Tên người liên hệ' name='tenNguoiLienHe'>
										<Input placeholder='Nguyễn Thanh Long' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label='SĐT người liên hệ' name='sdtNguoiLienHe'>
										<Input placeholder='0987552194' />
									</Form.Item>
								</Col>
							</Row>

							<Form.Item label='Địa chỉ liên hệ' name='diaChiLienHe' rules={[{ required: true }]}>
								<TextArea rows={3} placeholder='Thành phố Cần Thơ, Huyện Cư Dú, Thị trấn Cù Dú' />
							</Form.Item>

							<div style={{ textAlign: 'center', marginTop: '32px' }}>
								<Button
									type='primary'
									htmlType='submit'
									size='large'
									style={{
										minWidth: '200px',
										background: '#ff4d4f',
										borderColor: '#ff4d4f',
									}}
								>
									Bước 2/4
								</Button>
							</div>
						</Form>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default UniversityRegistrationForm;

import React from 'react';
import { Form, Input, Button, Row, Col, Select, DatePicker, Divider } from 'antd';

const { Option } = Select;

const PersonalInfoForm = ({ userId, initialData, onNext }) => {
	const [form] = Form.useForm();

	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			console.log('Personal info for user:', userId);
			onNext(values);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Form form={form} layout='vertical' initialValues={initialData}>
			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label='Họ và tên đệm' name='ho' rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
						<Input placeholder='Nhập họ và tên đệm' />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item label='Tên' name='ten' rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
						<Input placeholder='Nhập tên' />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label='Ngày sinh'
						name='ngaySinh'
						rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
					>
						<DatePicker style={{ width: '100%' }} placeholder='Chọn ngày sinh' />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label='Giới tính'
						name='gioiTinh'
						rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
					>
						<Select placeholder='Chọn giới tính'>
							<Option value='nam'>Nam</Option>
							<Option value='nữ'>Nữ</Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item
						label='Email'
						name='email'
						rules={[
							{ required: true, message: 'Vui lòng nhập email!' },
							{ type: 'email', message: 'Email không hợp lệ!' },
						]}
					>
						<Input placeholder='Nhập email' />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label='Số điện thoại'
						name='soDT'
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
					>
						<Input placeholder='Nhập số điện thoại' />
					</Form.Item>
				</Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label='Số CCCD' name='soCCCD' rules={[{ required: true, message: 'Vui lòng nhập số CCCD!' }]}>
						<Input placeholder='Nhập số CCCD' />
					</Form.Item>
				</Col>
				<Col span={12}>
					<Form.Item
						label='Ngày cấp CCCD'
						name='ngayCap'
						rules={[{ required: true, message: 'Vui lòng chọn ngày cấp!' }]}
					>
						<DatePicker style={{ width: '100%' }} placeholder='Chọn ngày cấp' />
					</Form.Item>
				</Col>
			</Row>

			<Form.Item label='Nơi cấp CCCD' name='noiCap' rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}>
				<Input placeholder='Nhập nơi cấp CCCD' />
			</Form.Item>

			<Divider>Thông tin bổ sung</Divider>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item label='Dân tộc' name={['thongTinBoSung', 'danToc']}>
						<Input placeholder='Nhập dân tộc' />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label='Quốc tịch' name={['thongTinBoSung', 'quocTich']}>
						<Input placeholder='Nhập quốc tịch' />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label='Tôn giáo' name={['thongTinBoSung', 'tonGiao']}>
						<Input placeholder='Nhập tôn giáo' />
					</Form.Item>
				</Col>
			</Row>

			<div style={{ textAlign: 'right', marginTop: 16 }}>
				<Button type='primary' onClick={handleNext}>
					Tiếp tục
				</Button>
			</div>
		</Form>
	);
};

export default PersonalInfoForm;

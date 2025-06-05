import React from 'react';
import { Form, Button, Card, Select, InputNumber, Row, Col, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import PhuongThucXTSelect from '@/pages/PhuongThucXT/components/Select';
import NganhDaoTaoSelect from '@/pages/NganhDaoTao/components/Select';

const { Option } = Select;

const WishesForm = ({ userId, initialData, onNext }) => {
	const [form] = Form.useForm();

	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			console.log('Wishes data for user:', userId);
			onNext(values);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Form form={form} layout='vertical' initialValues={initialData}>
			<Card title='Nguyện vọng xét tuyển'>
				<Form.List name='nguyenVong'>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Card
									key={key}
									type='inner'
									title={`Nguyện vọng ${name + 1}`}
									style={{ marginBottom: 16 }}
									extra={<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />}
								>
									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'ten']}
												label='Ngành đào tạo'
												rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}
											>
												<NganhDaoTaoSelect placeholder='Chọn ngành đào tạo' />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'phuongThucId']}
												label='Phương thức xét tuyển'
												rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
											>
												<PhuongThucXTSelect placeholder='Chọn phương thức xét tuyển' />
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'diemChuaUT']}
												label='Điểm chưa ưu tiên'
												rules={[
													{ required: true, message: 'Vui lòng nhập điểm!' },
													{ type: 'number', min: 0, message: 'Điểm phải lớn hơn 0!' },
												]}
											>
												<InputNumber min={0} step={0.1} precision={2} placeholder='0.0' style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'diemCoUT']}
												label='Điểm có ưu tiên'
												rules={[
													{ required: true, message: 'Vui lòng nhập điểm!' },
													{ type: 'number', min: 0, message: 'Điểm phải lớn hơn 0!' },
												]}
											>
												<InputNumber min={0} step={0.1} precision={2} placeholder='0.0' style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'tongDiem']}
												label='Tổng điểm'
												rules={[
													{ required: true, message: 'Vui lòng nhập tổng điểm!' },
													{ type: 'number', min: 0, message: 'Điểm phải lớn hơn 0!' },
												]}
											>
												<InputNumber min={0} step={0.1} precision={2} placeholder='0.0' style={{ width: '100%' }} />
											</Form.Item>
										</Col>
									</Row>

									<Form.Item
										{...restField}
										name={[name, 'coSoDaoTao']}
										label='Cơ sở đào tạo'
										rules={[{ required: true, message: 'Vui lòng chọn cơ sở đào tạo!' }]}
									>
										<Select placeholder='Chọn cơ sở đào tạo'>
											<Option value='Cơ sở chính'>Cơ sở chính</Option>
											<Option value='Cơ sở 2'>Cơ sở 2</Option>
											<Option value='Cơ sở 3'>Cơ sở 3</Option>
										</Select>
									</Form.Item>

									<Form.Item {...restField} name={[name, 'ghiChu']} label='Ghi chú (không bắt buộc)'>
										<Input.TextArea placeholder='Nhập ghi chú cho nguyện vọng này...' rows={2} />
									</Form.Item>
								</Card>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm nguyện vọng
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Card>

			<div style={{ textAlign: 'right', marginTop: 16 }}>
				<Button type='primary' onClick={handleNext}>
					Tiếp tục
				</Button>
			</div>
		</Form>
	);
};

export default WishesForm;

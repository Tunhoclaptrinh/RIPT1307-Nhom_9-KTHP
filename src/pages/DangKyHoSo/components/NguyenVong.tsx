import React, { useEffect } from 'react';
import { Form, Card, Button, Select, InputNumber, Row, Col, Divider, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';

const { Option } = Select;

interface WishListProps {
	userId: string;
	initialData: any;
	onNext: (values: any) => void;
	onPrev: () => void;
	phuongThucXetTuyenData: any[];
	nganhDaoTaoData: any[];
	toHopData: any[];
	existingNguyenVong: any[];
}

const WishList: React.FC<WishListProps> = ({
	userId,
	initialData,
	onNext,
	onPrev,
	phuongThucXetTuyenData,
	nganhDaoTaoData,
	toHopData,
	existingNguyenVong,
}) => {
	const [form] = Form.useForm();

	useEffect(() => {
		form.setFieldsValue({
			wishes: initialData.wishes || existingNguyenVong || [],
		});
	}, [initialData, existingNguyenVong, form]);

	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			const submissionData = {
				wishes: values.wishes.map((wish: any, index: number) => ({
					...wish,
					userId,
					id: existingNguyenVong[index]?.id || `wish_${Date.now()}_${index}`,
					thuTuNguyenVong: index + 1,
				})),
			};
			onNext(submissionData);
		} catch (error) {
			console.error('Validation failed:', error);
			message.error('Vui lòng hoàn thành tất cả các trường bắt buộc!');
		}
	};

	return (
		<Card title='Nguyện vọng'>
			<Form form={form} layout='vertical'>
				<Form.List name='wishes'>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<div key={key} style={{ marginBottom: 24 }}>
									<Divider>Nguyện vọng {name + 1}</Divider>
									<Row gutter={16}>
										<Col span={8}>
											<Form.Item
												{...restField}
												label='Phương thức xét tuyển'
												name={[name, 'phuongThucXetTuyenId']}
												rules={[...rules.required]}
											>
												<Select placeholder='Chọn phương thức xét tuyển'>
													{phuongThucXetTuyenData.map((item) => (
														<Option key={item.id} value={item.id}>
															{item.name}
														</Option>
													))}
												</Select>
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...restField}
												label='Ngành đào tạo'
												name={[name, 'nganhDaoTaoId']}
												rules={[...rules.required]}
											>
												<Select placeholder='Chọn ngành đào tạo'>
													{nganhDaoTaoData.map((item) => (
														<Option key={item.id} value={item.id}>
															{item.tenNganh}
														</Option>
													))}
												</Select>
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item {...restField} label='Tổ hợp môn' name={[name, 'toHopId']} rules={[...rules.required]}>
												<Select placeholder='Chọn tổ hợp'>
													{toHopData.map((item) => (
														<Option key={item.id} value={item.id}>
															{item.tenToHop}
														</Option>
													))}
												</Select>
											</Form.Item>
										</Col>
									</Row>
									<Button
										type='link'
										icon={<MinusCircleOutlined />}
										onClick={() => remove(name)}
										style={{ color: 'red' }}
									>
										Xóa nguyện vọng
									</Button>
								</div>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm nguyện vọng
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<div style={{ textAlign: 'center', marginTop: '24px' }}>
					<Space size='middle'>
						<Button size='large' onClick={onPrev} style={{ minWidth: '100px' }}>
							Quay lại
						</Button>
						<Button type='primary' size='large' onClick={handleNext} style={{ minWidth: '100px' }}>
							Tiếp tục
						</Button>
					</Space>
				</div>
			</Form>
		</Card>
	);
};

export default WishList;

import React from 'react';
import { Form, Input, Row, Col, Card, DatePicker, Select, Switch, Button, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import ThongTinHocTapForm from '@/pages/ThongTinHocTap/components/Form';
const { Option } = Select;

const EducationInfo = () => (
	// <>
	// 	{/* Thông tin THPT */}
	// 	<Card type='inner' title='Thông tin trường THPT' style={{ marginBottom: 16 }}>
	// 		<Row gutter={16}>
	// 			<Col xs={24} sm={12} md={8}>
	// 				<Form.Item label='Mã trường' name={['thongTinTHPT', 'maTruong']} rules={[{ required: true }]}>
	// 					<Input placeholder='Nhập mã trường' />
	// 				</Form.Item>
	// 			</Col>
	// 			<Col xs={24} sm={12} md={8}>
	// 				<Form.Item label='Tỉnh/Thành phố' name={['thongTinTHPT', 'tinh']} rules={[{ required: true }]}>
	// 					<Select placeholder='Chọn tỉnh/thành phố'>
	// 						<Option value='cantho'>Cần Thơ</Option>
	// 						<Option value='hcm'>TP. Hồ Chí Minh</Option>
	// 						<Option value='hanoi'>Hà Nội</Option>
	// 					</Select>
	// 				</Form.Item>
	// 			</Col>
	// 			<Col xs={24} sm={12} md={8}>
	// 				<Form.Item label='Khu vực ưu tiên' name={['thongTinTHPT', 'khuVucUT']} rules={[{ required: true }]}>
	// 					<Select placeholder='Chọn khu vực'>
	// 						<Option value='kv1'>KV1</Option>
	// 						<Option value='kv2'>KV2</Option>
	// 						<Option value='kv2NT'>KV2NT</Option>
	// 						<Option value='kv3'>KV3</Option>
	// 					</Select>
	// 				</Form.Item>
	// 			</Col>
	// 		</Row>

	// 		<Row gutter={16}>
	// 			<Col xs={24} sm={12}>
	// 				<Form.Item label='Đã tốt nghiệp' name={['thongTinTHPT', 'daTotNghiep']} valuePropName='checked'>
	// 					<Switch />
	// 				</Form.Item>
	// 			</Col>
	// 			<Col xs={24} sm={12}>
	// 				<Form.Item label='Năm tốt nghiệp' name={['thongTinTHPT', 'namTotNghiep']} rules={[{ required: true }]}>
	// 					<DatePicker picker='year' placeholder='Chọn năm' style={{ width: '100%' }} />
	// 				</Form.Item>
	// 			</Col>
	// 		</Row>
	// 	</Card>

	// 	{/* Điểm THPT */}
	// 	<Card type='inner' title='Điểm THPT' style={{ marginBottom: 16 }}>
	// 		<Form.List name='diemTHPT'>
	// 			{(fields, { add, remove }) => (
	// 				<>
	// 					{fields.map(({ key, name, ...restField }) => (
	// 						<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
	// 							<Col xs={24} sm={10}>
	// 								<Form.Item {...restField} name={[name, 'mon']} rules={[{ required: true, message: 'Chọn môn thi' }]}>
	// 									<Select placeholder='Chọn môn thi'>
	// 										<Option value='toán'>Toán</Option>
	// 										<Option value='văn'>Văn</Option>
	// 										<Option value='anh'>Tiếng Anh</Option>
	// 										<Option value='lý'>Vật Lý</Option>
	// 										<Option value='hóa'>Hóa Học</Option>
	// 										<Option value='sinh'>Sinh Học</Option>
	// 									</Select>
	// 								</Form.Item>
	// 							</Col>
	// 							<Col xs={20} sm={10}>
	// 								<Form.Item {...restField} name={[name, 'diem']} rules={[{ required: true, message: 'Nhập điểm' }]}>
	// 									<InputNumber placeholder='Điểm' step={0.1} min={0} max={10} style={{ width: '100%' }} />
	// 								</Form.Item>
	// 							</Col>
	// 							<Col xs={4} sm={4}>
	// 								<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
	// 							</Col>
	// 						</Row>
	// 					))}
	// 					<Form.Item>
	// 						<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
	// 							Thêm điểm môn
	// 						</Button>
	// 					</Form.Item>
	// 				</>
	// 			)}
	// 		</Form.List>
	// 	</Card>
	// </>
	<ThongTinHocTapForm />
);

export default EducationInfo;

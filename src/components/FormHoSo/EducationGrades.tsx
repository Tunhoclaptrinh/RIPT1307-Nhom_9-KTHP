import React from 'react';
import {
	Form,
	Input,
	Button,
	Card,
	Select,
	DatePicker,
	InputNumber,
	Switch,
	Row,
	Col,
	Divider,
	Checkbox,
	Space,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProvincesSelect } from '@/components/Address';

const { Option } = Select;

const EducationGradesForm = ({ userId, initialData, showHocBa, setShowHocBa, onNext }) => {
	const [form] = Form.useForm();

	const monHocOptions = [
		'Toán',
		'Ngữ văn',
		'Tiếng Anh',
		'Vật lý',
		'Hóa học',
		'Sinh học',
		'Lịch sử',
		'Địa lý',
		'GDCD',
		'Tin học',
		'Thể dục',
		'Âm nhạc',
		'Mỹ thuật',
	];

	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			console.log('Education grades for user:', userId);
			onNext(values);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Form form={form} layout='vertical' initialValues={initialData}>
			<Card title='Thông tin trường THPT' style={{ marginBottom: 16 }}>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							label='Mã trường'
							name={['thongTinTHPT', 'maTruong']}
							rules={[{ required: true, message: 'Vui lòng nhập mã trường!' }]}
						>
							<Input placeholder='Nhập mã trường' />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label='Mã tỉnh'
							name={['thongTinTHPT', 'maTinh']}
							rules={[{ required: true, message: 'Vui lòng nhập mã tỉnh!' }]}
						>
							<Input placeholder='Nhập mã tỉnh' />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label='Tỉnh/Thành phố'
							name={['thongTinTHPT', 'tinh_ThanhPho']}
							rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
						>
							<ProvincesSelect />
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Khu vực ưu tiên'
							name={['thongTinTHPT', 'khuVucUT']}
							rules={[{ required: true, message: 'Vui lòng chọn khu vực ưu tiên!' }]}
						>
							<Select placeholder='Chọn khu vực ưu tiên'>
								<Option value='kv1'>KV1</Option>
								<Option value='kv2'>KV2</Option>
								<Option value='kv2NT'>KV2NT</Option>
								<Option value='kv3'>KV3</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Đối tượng ưu tiên' name={['thongTinTHPT', 'doiTuongUT']}>
							<Select placeholder='Chọn đối tượng ưu tiên' allowClear>
								<Option value='hộ nghèo'>Hộ nghèo</Option>
								<Option value='cận nghèo'>Cận nghèo</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label='Đã tốt nghiệp' name={['thongTinTHPT', 'daTotNghiep']} valuePropName='checked'>
							<Switch />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Năm tốt nghiệp' name={['thongTinTHPT', 'namTotNghiep']}>
							<DatePicker picker='year' style={{ width: '100%' }} placeholder='Chọn năm tốt nghiệp' />
						</Form.Item>
					</Col>
				</Row>
			</Card>

			<Card title='Điểm THPT' style={{ marginBottom: 16 }}>
				<Form.List name='diemTHPT'>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
									<Col span={10}>
										<Form.Item {...restField} name={[name, 'mon']} rules={[{ required: true, message: 'Chọn môn!' }]}>
											<Select placeholder='Chọn môn thi'>
												<Option value='toán'>Toán</Option>
												<Option value='văn'>Văn</Option>
												<Option value='anh'>Anh</Option>
												<Option value='lý'>Lý</Option>
												<Option value='hóa'>Hóa</Option>
												<Option value='sinh'>Sinh</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={10}>
										<Form.Item
											{...restField}
											name={[name, 'diem']}
											rules={[
												{ required: true, message: 'Nhập điểm!' },
												{ type: 'number', min: 0, max: 10, message: 'Điểm từ 0-10!' },
											]}
										>
											<InputNumber placeholder='Điểm' step={0.1} style={{ width: '100%' }} min={0} max={10} />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm điểm môn
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Card>

			{/* Thông tin học bạ */}
			<Card title='Thông tin học bạ' style={{ marginBottom: 16 }}>
				<Form.Item>
					<Checkbox checked={showHocBa} onChange={(e) => setShowHocBa(e.target.checked)}>
						Tôi muốn cung cấp thông tin học bạ THPT (dành cho xét tuyển học bạ)
					</Checkbox>
				</Form.Item>

				{showHocBa && (
					<>
						<Divider />
						<Card title='Điểm các môn học' type='inner'>
							<Form.List name='diemMonHoc'>
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<div
												key={key}
												style={{
													marginBottom: 16,
													padding: 16,
													border: '1px solid #f0f0f0',
													borderRadius: 6,
													backgroundColor: '#fafafa',
												}}
											>
												<Space style={{ display: 'flex', marginBottom: 8 }} align='baseline'>
													<Form.Item
														{...restField}
														name={[name, 'mon']}
														label='Môn học'
														rules={[{ required: true, message: 'Chọn môn học!' }]}
														style={{ minWidth: 180 }}
													>
														<Select placeholder='Chọn môn học'>
															{monHocOptions.map((mon) => (
																<Option key={mon} value={mon}>
																	{mon}
																</Option>
															))}
														</Select>
													</Form.Item>

													<Form.Item
														{...restField}
														name={[name, 'hocKy']}
														label='Học kỳ/Lớp'
														rules={[{ required: true, message: 'Chọn học kỳ!' }]}
														style={{ minWidth: 160 }}
													>
														<Select placeholder='Chọn học kỳ'>
															<Option value='HK1_Lop10'>HK1 - Lớp 10</Option>
															<Option value='HK2_Lop10'>HK2 - Lớp 10</Option>
															<Option value='HK1_Lop11'>HK1 - Lớp 11</Option>
															<Option value='HK2_Lop11'>HK2 - Lớp 11</Option>
															<Option value='HK1_Lop12'>HK1 - Lớp 12</Option>
															<Option value='HK2_Lop12'>HK2 - Lớp 12</Option>
														</Select>
													</Form.Item>

													<Form.Item
														{...restField}
														name={[name, 'diemTongKet']}
														label='Điểm tổng kết'
														rules={[
															{ required: true, message: 'Nhập điểm!' },
															{ type: 'number', min: 0, max: 10, message: 'Điểm từ 0-10!' },
														]}
														style={{ minWidth: 140 }}
													>
														<InputNumber
															min={0}
															max={10}
															step={0.1}
															precision={1}
															placeholder='0.0'
															style={{ width: '100%' }}
														/>
													</Form.Item>

													<MinusCircleOutlined
														onClick={() => remove(name)}
														style={{ color: '#ff4d4f', fontSize: 18, cursor: 'pointer' }}
													/>
												</Space>
											</div>
										))}
										<Form.Item>
											<Button
												type='dashed'
												onClick={() => add({ mon: '', hocKy: 'HK1_Lop10', diemTongKet: 0 })}
												block
												icon={<PlusOutlined />}
											>
												Thêm môn học
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>
						</Card>

						<Card title='Thông tin bổ sung về học bạ' type='inner' style={{ marginTop: 16 }}>
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item
										label='Loại hạnh kiểm'
										name='loaiHanhKiem'
										rules={showHocBa ? [{ required: true, message: 'Chọn loại hạnh kiểm!' }] : []}
									>
										<Select placeholder='Chọn loại hạnh kiểm'>
											<Option value='tốt'>Tốt</Option>
											<Option value='khá'>Khá</Option>
											<Option value='trung bình'>Trung bình</Option>
											<Option value='yếu'>Yếu</Option>
											<Option value='kém'>Kém</Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item
										label='Minh chứng học bạ'
										name='minhChungHocBa'
										rules={showHocBa ? [{ required: true, message: 'Nhập minh chứng!' }] : []}
									>
										<Input placeholder='Đường dẫn file học bạ hoặc mô tả minh chứng' />
									</Form.Item>
								</Col>
							</Row>
						</Card>
					</>
				)}
			</Card>

			{/* Chứng chỉ */}
			<Card title='Thông tin bổ sung' style={{ marginBottom: 16 }}>
				<Divider orientation='left'>Chứng chỉ ngoại ngữ/Tin học</Divider>
				<Form.List name='chungChi'>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row
									key={key}
									gutter={16}
									style={{ marginBottom: 8, padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}
								>
									<Col span={8}>
										<Form.Item {...restField} name={[name, 'loaiCC']} label='Loại chứng chỉ'>
											<Select placeholder='Chọn loại chứng chỉ'>
												<Option value='tiếng anh'>Tiếng Anh</Option>
												<Option value='tin học'>Tin học</Option>
												<Option value='khác'>Khác</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item {...restField} name={[name, 'ketQua']} label='Kết quả'>
											<Input placeholder='VD: 7.5 IELTS, Giỏi...' />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item {...restField} name={[name, 'minhChung']} label='Minh chứng'>
											<Input placeholder='Đường dẫn file' />
										</Form.Item>
									</Col>
									<Col span={2}>
										<Form.Item label=' '>
											<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
										</Form.Item>
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} icon={<PlusOutlined />}>
									Thêm chứng chỉ
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

export default EducationGradesForm;

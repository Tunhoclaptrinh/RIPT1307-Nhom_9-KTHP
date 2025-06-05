import React, { useState, useEffect } from 'react';
import {
	Modal,
	Steps,
	Form,
	Input,
	Button,
	Space,
	Card,
	Select,
	DatePicker,
	InputNumber,
	Switch,
	Row,
	Col,
	Divider,
	message,
	Descriptions,
	Checkbox,
} from 'antd';
import {
	UserOutlined,
	BookOutlined,
	HeartOutlined,
	CheckCircleOutlined,
	PlusOutlined,
	MinusCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import PhuongThucXTSelect from '@/pages/PhuongThucXT/components/Select';
import NganhDaoTaoSelect from '@/pages/NganhDaoTao/components/Select';
import { ProvincesSelect } from '@/components/Address';

const { Option } = Select;
const { Step } = Steps;

const AdmissionStepModal = () => {
	const [visible, setVisible] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({});
	const [forms] = Form.useForm();
	const [showHocBa, setShowHocBa] = useState(false);

	// Mock current user ID
	const currentUserId = 'user_current';

	const steps = [
		{
			title: 'Thông tin cá nhân',
			icon: <UserOutlined />,
			description: 'Cập nhật thông tin cá nhân',
		},
		{
			title: 'Điểm, Chứng chỉ & Học bạ',
			icon: <BookOutlined />,
			description: 'Thông tin trường THPT, điểm thi và học bạ',
		},
		{
			title: 'Nguyện vọng',
			icon: <HeartOutlined />,
			description: 'Chọn ngành và phương thức xét tuyển',
		},
		{
			title: 'Hoàn tất',
			icon: <CheckCircleOutlined />,
			description: 'Xem lại và nộp hồ sơ',
		},
	];

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
			const values = await forms.validateFields();
			const updatedFormData = { ...formData, ...values };
			setFormData(updatedFormData);

			if (currentStep < steps.length - 1) {
				setCurrentStep(currentStep + 1);
				forms.resetFields();
			}
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handlePrev = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async () => {
		try {
			// Here you would submit all data to your API
			console.log('Final form data:', formData);
			message.success('Nộp hồ sơ thành công!');
			setVisible(false);
			setCurrentStep(0);
			setFormData({});
			setShowHocBa(false);
			forms.resetFields();
		} catch (error) {
			message.error('Có lỗi xảy ra khi nộp hồ sơ!');
		}
	};

	const renderPersonalInfoForm = () => (
		<Form form={forms} layout='vertical' initialValues={formData}>
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
		</Form>
	);

	const renderEducationAndGradesForm = () => (
		<Form form={forms} layout='vertical' initialValues={formData}>
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

			{/* Checkbox để hiển thị thông tin học bạ */}
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

			{/* Các phần khác như chứng chỉ, giải thưởng */}
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
		</Form>
	);

	const renderWishesForm = () => (
		<Form form={forms} layout='vertical' initialValues={formData}>
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
												rules={[{ required: true, message: 'Chọn ngành!' }]}
											>
												<NganhDaoTaoSelect />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'phuongThucId']}
												label='Phương thức xét tuyển'
												rules={[{ required: true, message: 'Chọn phương thức!' }]}
											>
												<PhuongThucXTSelect />
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'diemChuaUT']}
												label='Điểm chưa ưu tiên'
												rules={[{ required: true, message: 'Nhập điểm!' }]}
											>
												<InputNumber min={0} step={0.1} placeholder='0.0' style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'diemCoUT']}
												label='Điểm có ưu tiên'
												rules={[{ required: true, message: 'Nhập điểm!' }]}
											>
												<InputNumber min={0} step={0.1} placeholder='0.0' style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'tongDiem']}
												label='Tổng điểm'
												rules={[{ required: true, message: 'Nhập tổng điểm!' }]}
											>
												<InputNumber min={0} step={0.1} placeholder='0.0' style={{ width: '100%' }} />
											</Form.Item>
										</Col>
									</Row>

									<Form.Item {...restField} name={[name, 'coSoDaoTao']} label='Cơ sở đào tạo'>
										<Select placeholder='Chọn cơ sở đào tạo' defaultValue='Cơ sở chính'>
											<Option value='Cơ sở chính'>Cơ sở chính</Option>
											<Option value='Cơ sở 2'>Cơ sở 2</Option>
										</Select>
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
		</Form>
	);

	const renderSummary = () => (
		<div>
			<Card title='Xem lại thông tin hồ sơ' style={{ marginBottom: 16 }}>
				<Descriptions column={2} bordered>
					<Descriptions.Item label='Họ và tên'>
						{formData.ho} {formData.ten}
					</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh'>
						{formData.ngaySinh ? moment(formData.ngaySinh).format('DD/MM/YYYY') : ''}
					</Descriptions.Item>
					<Descriptions.Item label='Email'>{formData.email}</Descriptions.Item>
					<Descriptions.Item label='Số điện thoại'>{formData.soDT}</Descriptions.Item>
					<Descriptions.Item label='Số CCCD'>{formData.soCCCD}</Descriptions.Item>
					<Descriptions.Item label='Giới tính'>{formData.gioiTinh}</Descriptions.Item>
				</Descriptions>
			</Card>

			{formData.thongTinTHPT && (
				<Card title='Thông tin trường THPT' style={{ marginBottom: 16 }}>
					<Descriptions column={2}>
						<Descriptions.Item label='Mã trường'>{formData.thongTinTHPT.maTruong}</Descriptions.Item>
						<Descriptions.Item label='Tỉnh/Thành phố'>{formData.thongTinTHPT.tinh_ThanhPho}</Descriptions.Item>
						<Descriptions.Item label='Khu vực ưu tiên'>{formData.thongTinTHPT.khuVucUT}</Descriptions.Item>
						<Descriptions.Item label='Đối tượng ưu tiên'>
							{formData.thongTinTHPT.doiTuongUT || 'Không'}
						</Descriptions.Item>
					</Descriptions>
				</Card>
			)}

			{showHocBa && formData.diemMonHoc && formData.diemMonHoc.length > 0 && (
				<Card title='Điểm học bạ đã nhập' style={{ marginBottom: 16 }}>
					{formData.diemMonHoc.map((diem, index) => (
						<div key={index} style={{ marginBottom: 8 }}>
							<strong>{diem.mon}</strong> - {diem.hocKy}: {diem.diemTongKet} điểm
						</div>
					))}
				</Card>
			)}

			{formData.nguyenVong && formData.nguyenVong.length > 0 && (
				<Card title='Nguyện vọng đã chọn' style={{ marginBottom: 16 }}>
					{formData.nguyenVong.map((nv, index) => (
						<Card key={index} type='inner' title={`Nguyện vọng ${index + 1}`} style={{ marginBottom: 8 }}>
							<Descriptions column={1} size='small'>
								<Descriptions.Item label='Ngành đào tạo'>{nv.ten}</Descriptions.Item>
								<Descriptions.Item label='Phương thức xét tuyển'>
									<PhuongThucXTSelect />
								</Descriptions.Item>
								<Descriptions.Item label='Tổng điểm'>{nv.tongDiem}</Descriptions.Item>
								<Descriptions.Item label='Cơ sở đào tạo'>{nv.coSoDaoTao}</Descriptions.Item>
							</Descriptions>
						</Card>
					))}
				</Card>
			)}

			<Card title='Xác nhận nộp hồ sơ'>
				<p>
					Tôi xác nhận rằng tất cả thông tin đã cung cấp là chính xác và cam kết chịu trách nhiệm về tính xác thực của
					hồ sơ.
				</p>
			</Card>
		</div>
	);

	const getStepContent = () => {
		switch (currentStep) {
			case 0:
				return renderPersonalInfoForm();
			case 1:
				return renderEducationAndGradesForm();
			case 2:
				return renderWishesForm();
			case 3:
				return renderSummary();
			default:
				return null;
		}
	};

	return (
		<>
			<Button type='primary' onClick={() => setVisible(true)}>
				Mở form đăng ký xét tuyển
			</Button>

			<Modal
				title='Hồ sơ xét tuyển đại học'
				visible={visible}
				onCancel={() => {
					setVisible(false);
					setCurrentStep(0);
					setFormData({});
					setShowHocBa(false);
					forms.resetFields();
				}}
				width={1000}
				footer={null}
				destroyOnClose
			>
				<Steps current={currentStep} style={{ marginBottom: 24 }}>
					{steps.map((step, index) => (
						<Step key={index} title={step.title} description={step.description} icon={step.icon} />
					))}
				</Steps>

				<div style={{ marginBottom: 24 }}>{getStepContent()}</div>

				<div style={{ textAlign: 'right' }}>
					<Space>
						{currentStep > 0 && <Button onClick={handlePrev}>Quay lại</Button>}

						{currentStep < steps.length - 1 && (
							<Button type='primary' onClick={handleNext}>
								Tiếp tục
							</Button>
						)}

						{currentStep === steps.length - 1 && (
							<Button type='primary' onClick={handleSubmit}>
								Nộp hồ sơ
							</Button>
						)}
					</Space>
				</div>
			</Modal>
		</>
	);
};

export default AdmissionStepModal;

import React from 'react';
import moment from 'moment';
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
	message,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import rules from '@/utils/rules';

const { Option } = Select;

interface EducationInfoProps {
	userId: string;
	initialData: any;
	showHocBa: boolean;
	setShowHocBa: (value: boolean) => void;
	onNext: (values: any) => void;
	onPrev: () => void;
	heDaoTaoData: any[];
	toHopData: any[];
	existingThongTinHocTap: any | null;
	existingHocBa: any | null;
}

const EducationInfo: React.FC<EducationInfoProps> = ({
	userId,
	initialData,
	showHocBa,
	setShowHocBa,
	onNext,
	onPrev,
	heDaoTaoData,
	toHopData,
	existingThongTinHocTap,
	existingHocBa,
}) => {
	const [form] = Form.useForm();

	// Format initial data
	const formattedInitialData = {
		educationGrades: {
			thongTinTHPT: {
				ten: initialData.educationGrades?.thongTinTHPT?.ten || '',
				maTruong: initialData.educationGrades?.thongTinTHPT?.maTruong || '',
				tinh_ThanhPho: initialData.educationGrades?.thongTinTHPT?.tinh_ThanhPho || '',
				quanHuyen: initialData.educationGrades?.thongTinTHPT?.quanHuyen || '',
				xaPhuong: initialData.educationGrades?.thongTinTHPT?.xaPhuong || '',
				diaChi: initialData.educationGrades?.thongTinTHPT?.diaChi || '',
				daTotNghiep: initialData.educationGrades?.thongTinTHPT?.daTotNghiep || false,
				namTotNghiep: initialData.educationGrades?.thongTinTHPT?.namTotNghiep
					? moment(initialData.educationGrades.thongTinTHPT.namTotNghiep, 'YYYY')
					: undefined,
				doiTuongUT: initialData.educationGrades?.thongTinTHPT?.doiTuongUT || '',
				khuVucUT: initialData.educationGrades?.thongTinTHPT?.khuVucUT || '',
			},
			diemHocBa: initialData.educationGrades?.diemHocBa || [],
			diemDGNL_DGTD: initialData.educationGrades?.diemDGNL_DGTD || [],
			giaiHSG: initialData.educationGrades?.giaiHSG || [],
			chungChi: initialData.educationGrades?.chungChi || [],
		},
		hocBa: initialData.hocBa || {},
	};

	// Set initial form values
	React.useEffect(() => {
		form.setFieldsValue(formattedInitialData);
	}, [initialData, form]);

	// Watch address fields
	const provinceCode = Form.useWatch(['educationGrades', 'thongTinTHPT', 'tinh_ThanhPho'], form);
	const districtCode = Form.useWatch(['educationGrades', 'thongTinTHPT', 'quanHuyen'], form);

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
	];

	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			const submissionData = {
				educationGrades: {
					...values.educationGrades,
					userId,
					id: existingThongTinHocTap?.id || `ttht_${Date.now()}`,
					thongTinTHPT: {
						...values.educationGrades.thongTinTHPT,
						namTotNghiep: values.educationGrades.thongTinTHPT?.namTotNghiep
							? values.educationGrades.thongTinTHPT.namTotNghiep.format('YYYY')
							: undefined,
					},
					diemHocBa: values.educationGrades.diemHocBa || [],
					diemDGNL_DGTD: values.educationGrades.diemDGNL_DGTD || [],
					giaiHSG: values.educationGrades.giaiHSG || [],
					chungChi: values.educationGrades.chungChi || [],
				},
				hocBa: showHocBa
					? {
							...values.hocBa,
							userId,
							id: existingHocBa?.id || `hb_${Date.now()}`,
							thongTinHocTapId: existingThongTinHocTap?.id || `ttht_${Date.now()}`,
					  }
					: null,
			};
			onNext(submissionData);
		} catch (error) {
			console.error('Validation failed:', error);
			message.error('Vui lòng hoàn thành tất cả các trường bắt buộc!');
		}
	};

	return (
		<Card title='Thông tin học tập'>
			<Form form={form} layout='vertical' initialValues={formattedInitialData}>
				<Divider>Thông tin trường THPT</Divider>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label='Tên trường' name={['educationGrades', 'thongTinTHPT', 'ten']} rules={[...rules.required]}>
							<Input placeholder='Nhập tên trường THPT' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Mã trường'
							name={['educationGrades', 'thongTinTHPT', 'maTruong']}
							rules={[...rules.required]}
						>
							<Input placeholder='Nhập mã trường' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Tỉnh/Thành phố'
							name={['educationGrades', 'thongTinTHPT', 'tinh_ThanhPho']}
							rules={[...rules.required]}
						>
							<ProvincesSelect placeholder='Chọn tỉnh/thành phố' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Quận/Huyện'
							name={['educationGrades', 'thongTinTHPT', 'quanHuyen']}
							rules={[...rules.required]}
						>
							<DistrictsSelect provinceCode={provinceCode} placeholder='Chọn quận/huyện' disabled={!provinceCode} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Xã/Phường'
							name={['educationGrades', 'thongTinTHPT', 'xaPhuong']}
							rules={[...rules.required]}
						>
							<WardsSelect districtCode={districtCode} placeholder='Chọn xã/phường' disabled={!districtCode} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Địa chỉ cụ thể'
							name={['educationGrades', 'thongTinTHPT', 'diaChi']}
							rules={[...rules.required]}
						>
							<Input placeholder='Nhập số nhà, tên đường...' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Đã tốt nghiệp'
							name={['educationGrades', 'thongTinTHPT', 'daTotNghiep']}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Năm tốt nghiệp'
							name={['educationGrades', 'thongTinTHPT', 'namTotNghiep']}
							rules={[...rules.required]}
						>
							<DatePicker picker='year' placeholder='Chọn năm tốt nghiệp' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label='Đối tượng ưu tiên' name={['educationGrades', 'thongTinTHPT', 'doiTuongUT']}>
							<Input placeholder='Nhập đối tượng ưu tiên (nếu có)' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Khu vực ưu tiên' name={['educationGrades', 'thongTinTHPT', 'khuVucUT']}>
							<Input placeholder='Nhập khu vực ưu tiên (nếu có)' />
						</Form.Item>
					</Col>
				</Row>

				<Divider>Điểm học bạ</Divider>
				<Form.List name={['educationGrades', 'diemHocBa']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row gutter={16} key={key} align='middle'>
									<Col span={6}>
										<Form.Item {...restField} name={[name, 'monHoc']} rules={[...rules.required]}>
											<Select placeholder='Chọn môn học'>
												{monHocOptions.map((mon) => (
													<Option key={mon} value={mon}>
														{mon}
													</Option>
												))}
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item
											{...restField}
											name={[name, 'diem']}
											rules={[...rules.required, { type: 'number', min: 0, max: 10 }]}
										>
											<InputNumber placeholder='Nhập điểm' style={{ width: '100%' }} />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item {...restField} name={[name, 'hocKy']} rules={[...rules.required]}>
											<Select placeholder='Chọn học kỳ'>
												<Option value='HK1_10'>HK1 Lớp 10</Option>
												<Option value='HK2_10'>HK2 Lớp 10</Option>
												<Option value='HK1_11'>HK1 Lớp 11</Option>
												<Option value='HK2_11'>HK2 Lớp 11</Option>
												<Option value='HK1_12'>HK1 Lớp 12</Option>
												<Option value='HK2_12'>HK2 Lớp 12</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Button type='link' icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
											Xóa
										</Button>
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm điểm học bạ
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Divider>Điểm đánh giá năng lực/tư duy</Divider>
				<Form.List name={['educationGrades', 'diemDGNL_DGTD']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row gutter={16} key={key} align='middle'>
									<Col span={8}>
										<Form.Item {...restField} name={[name, 'loaiDiem']} rules={[...rules.required]}>
											<Select placeholder='Chọn loại điểm'>
												<Option value='DGNL'>Đánh giá năng lực</Option>
												<Option value='DGTD'>Đánh giá tư duy</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											{...restField}
											name={[name, 'diem']}
											rules={[...rules.required, { type: 'number', min: 0 }]}
										>
											<InputNumber placeholder='Nhập điểm' style={{ width: '100%' }} />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Button type='link' icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
											Xóa
										</Button>
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm điểm DGNL/DGTD
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Divider>Giải học sinh giỏi</Divider>
				<Form.List name={['educationGrades', 'giaiHSG']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row gutter={16} key={key} align='middle'>
									<Col span={6}>
										<Form.Item {...restField} name={[name, 'tenGiai']} rules={[...rules.required]}>
											<Input placeholder='Tên giải' />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item name={[name, 'capDo']} rules={[...rules.required]}>
											<Select placeholder='Chọn cấp độ'>
												<Option value='Quốc gia'>Quốc gia</Option>
												<Option value='Tỉnh/Thành phố'>Tỉnh/Thành phố</Option>
												<Option value='Quận/Huyện'>Quận/Huyện</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item {...restField} name={[name, 'nam']} rules={[...rules.required]}>
											<DatePicker picker='year' placeholder='Chọn năm' style={{ width: '100%' }} />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Button type='link' icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
											Xóa
										</Button>
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm giải HSG
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Divider>Chứng chỉ</Divider>
				<Form.List name={['educationGrades', 'chungChi']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row gutter={16} key={key} align='middle'>
									<Col span={8}>
										<Form.Item {...restField} name={[name, 'tenChungChi']} rules={[...rules.required]}>
											<Input placeholder='Tên chứng chỉ' />
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											{...restField}
											name={[name, 'diem']}
											rules={[...rules.required, { type: 'number', min: 0 }]}
										>
											<InputNumber placeholder='Nhập điểm' style={{ width: '100%' }} />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Button type='link' icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
											Xóa
										</Button>
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm chứng chỉ
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>

				<Divider>Học bạ</Divider>
				<Form.Item label='Bao gồm học bạ'>
					<Switch checked={showHocBa} onChange={setShowHocBa} />
				</Form.Item>
				{showHocBa && (
					<>
						<Form.List name={['hocBa', 'diemHocBa']}>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Row gutter={16} key={key} align='middle'>
											<Col span={6}>
												<Form.Item {...restField} name={[name, 'monHoc']} rules={[...rules.required]}>
													<Select placeholder='Chọn môn học'>
														{monHocOptions.map((mon) => (
															<Option key={mon} value={mon}>
																{mon}
															</Option>
														))}
													</Select>
												</Form.Item>
											</Col>
											<Col span={6}>
												<Form.Item
													{...restField}
													name={[name, 'diem']}
													rules={[...rules.required, { type: 'number', min: 0, max: 10 }]}
												>
													<InputNumber placeholder='Nhập điểm' style={{ width: '100%' }} />
												</Form.Item>
											</Col>
											<Col span={6}>
												<Form.Item {...restField} name={[name, 'hocKy']} rules={[...rules.required]}>
													<Select placeholder='Chọn học kỳ'>
														<Option value='HK1_10'>HK1 Lớp 10</Option>
														<Option value='HK2_10'>HK2 Lớp 10</Option>
														<Option value='HK1_11'>HK1 Lớp 11</Option>
														<Option value='HK2_11'>HK2 Lớp 11</Option>
														<Option value='HK1_12'>HK1 Lớp 12</Option>
														<Option value='HK2_12'>HK2 Lớp 12</Option>
													</Select>
												</Form.Item>
											</Col>
											<Col span={6}>
												<Button type='link' icon={<MinusCircleOutlined />} onClick={() => remove(name)}>
													Xóa
												</Button>
											</Col>
										</Row>
									))}
									<Form.Item>
										<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
											Thêm điểm học bạ
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</>
				)}

				<div style={{ textAlign: 'center', marginTop: '32px' }}>
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

export default EducationInfo;

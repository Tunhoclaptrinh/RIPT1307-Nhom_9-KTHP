import React, { useState } from 'react';
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
	Upload,
	message,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import axios from 'axios';
import { ipLocal } from '@/utils/ip';
import { DiemHocSinh } from '@/services/HocBa/typing';
import { ThongTinHocTap } from '@/services/ThongTinHocTap/typing';

const { Option } = Select;

interface TTHocTapFormProps {
	userId: string;
	initialData: any;
	showHocBa: boolean;
	setShowHocBa: (value: boolean) => void;
	onNext: (values: any) => void;
	onPrev: (data: any) => void;
	heDaoTaoData: HeDaoTao.IRecord[];
	toHopData: ToHop.IRecord[];
	existingThongTinHocTap: ThongTinHocTap.IRecord | null;
	existingHocBa: DiemHocSinh.IRecord | null;
	loading?: boolean;
}

const TTHocTapForm: React.FC<TTHocTapFormProps> = ({
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
	loading = false,
}) => {
	const [form] = Form.useForm();
	const [hocBaFileList, setHocBaFileList] = useState<any[]>([]);
	const [dgtdFileList, setDgtdFileList] = useState<any[]>([]);
	const [dgnlFileList, setDgnlFileList] = useState<any[]>([]);
	const [giaiHsgFileList, setGiaiHsgFileList] = useState<any[]>([]);
	const [chungChiFileLists, setChungChiFileLists] = useState<any[]>([]);

	// Convert string dates to Moment objects for initial values
	const formattedInitialData = {
		...initialData,
		educationGrades: {
			...initialData.educationGrades,
			thongTinTHPT: {
				...initialData.educationGrades?.thongTinTHPT,
				namTotNghiep: initialData.educationGrades?.thongTinTHPT?.namTotNghiep
					? moment(initialData.educationGrades.thongTinTHPT.namTotNghiep, 'YYYY')
					: undefined,
			},
			giaiHSG: {
				...initialData.educationGrades?.giaiHSG,
				nam: initialData.educationGrades?.giaiHSG?.nam
					? moment(initialData.educationGrades.giaiHSG.nam, 'YYYY')
					: undefined,
			},
		},
	};

	// Initialize file lists for existing data
	React.useEffect(() => {
		if (initialData.educationGrades?.diemDGTD?.minhChung) {
			setDgtdFileList([
				{
					uid: '-1',
					name: 'dgtd_minhchung',
					status: 'done',
					url: `${ipLocal}${initialData.educationGrades.diemDGTD.minhChung}`,
				},
			]);
		}
		if (initialData.educationGrades?.diemDGNL?.minhChung) {
			setDgnlFileList([
				{
					uid: '-1',
					name: 'dgnl_minhchung',
					status: 'done',
					url: `${ipLocal}${initialData.educationGrades.diemDGNL.minhChung}`,
				},
			]);
		}
		if (initialData.educationGrades?.giaiHSG?.minhChung) {
			setGiaiHsgFileList([
				{
					uid: '-1',
					name: 'giaiHsg_minhchung',
					status: 'done',
					url: `${ipLocal}${initialData.educationGrades.giaiHSG.minhChung}`,
				},
			]);
		}
		if (initialData.hocBa?.minhChung) {
			setHocBaFileList([
				{
					uid: '-1',
					name: 'hocBa_minhchung',
					status: 'done',
					url: `${ipLocal}${initialData.hocBa.minhChung}`,
				},
			]);
		}
		if (initialData.educationGrades?.chungChi) {
			setChungChiFileLists(
				initialData.educationGrades.chungChi.map((cc: any, index: number) => ({
					uid: `-${index + 1}`,
					name: `chungChi_minhchung_${index}`,
					status: 'done',
					url: `${ipLocal}${cc.minhChung}`,
				})),
			);
		}
	}, [initialData]);

	// Watch form fields for reactive updates
	const provinceCode = Form.useWatch(['educationGrades', 'thongTinTHPT', 'tinh_ThanhPho'], form);
	const districtCode = Form.useWatch(['educationGrades', 'thongTinTHPT', 'quanHuyen'], form);

	const monHocOptions = [
		'Toán',
		'Ngữ văn',
		'Tiếng Anh',
		'Lý',
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

	const handleUploadFile = async (file: File, userId: string, type: string) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('userId', userId || 'temp');
		formData.append('type', type);

		try {
			const response = await axios.post(`${ipLocal}/upload`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			return response.data.fileUrl;
		} catch (error) {
			console.error(`Upload ${type} error:`, error);
			message.error(`Tải file ${type} thất bại`);
			throw error;
		}
	};

	const beforeUpload = (file: File) => {
		const isValidType =
			file.type.startsWith('image/') ||
			file.type === 'application/pdf' ||
			file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
		if (!isValidType) {
			message.error('Chỉ được tải lên file ảnh, PDF hoặc DOCX!');
			return false;
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('File phải nhỏ hơn 2MB!');
			return false;
		}
		return true;
	};

	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			let hocBaFileUrl = initialData.hocBa?.minhChung;
			let dgtdFileUrl = initialData.educationGrades?.diemDGTD?.minhChung;
			let dgnlFileUrl = initialData.educationGrades?.diemDGNL?.minhChung;
			let giaiHsgFileUrl = initialData.educationGrades?.giaiHSG?.minhChung;
			let chungChiFileUrls = initialData.educationGrades?.chungChi
				? initialData.educationGrades.chungChi.map((cc: any) => cc.minhChung)
				: values.educationGrades.chungChi
				? values.educationGrades.chungChi.map(() => undefined)
				: [];

			// Handle hocBa file upload
			if (showHocBa && hocBaFileList.length > 0 && hocBaFileList[0].originFileObj) {
				hocBaFileUrl = await handleUploadFile(hocBaFileList[0].originFileObj, userId, 'hocBa');
			} else if (hocBaFileList.length === 0) {
				hocBaFileUrl = undefined;
			}

			// Handle DGTD file upload
			if (dgtdFileList.length > 0 && dgtdFileList[0].originFileObj) {
				dgtdFileUrl = await handleUploadFile(dgtdFileList[0].originFileObj, userId, 'dgtd');
			} else if (dgtdFileList.length === 0) {
				dgtdFileUrl = undefined;
			}

			// Handle DGNL file upload
			if (dgnlFileList.length > 0 && dgnlFileList[0].originFileObj) {
				dgnlFileUrl = await handleUploadFile(dgnlFileList[0].originFileObj, userId, 'dgnl');
			} else if (dgnlFileList.length === 0) {
				dgnlFileUrl = undefined;
			}

			// Handle giaiHSG file upload
			if (giaiHsgFileList.length > 0 && giaiHsgFileList[0].originFileObj) {
				giaiHsgFileUrl = await handleUploadFile(giaiHsgFileList[0].originFileObj, userId, 'giaiHsg');
			} else if (giaiHsgFileList.length === 0) {
				giaiHsgFileUrl = undefined;
			}

			// Handle chungChi file uploads
			if (values.educationGrades.chungChi) {
				for (let i = 0; i < values.educationGrades.chungChi.length; i++) {
					if (chungChiFileLists[i]?.originFileObj) {
						chungChiFileUrls[i] = await handleUploadFile(chungChiFileLists[i].originFileObj, userId, `chungChi_${i}`);
					} else if (!chungChiFileLists[i]) {
						chungChiFileUrls[i] = undefined;
					}
				}
			}

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
					giaiHSG: values.educationGrades.giaiHSG
						? {
								...values.educationGrades.giaiHSG,
								nam: values.educationGrades.giaiHSG.nam ? values.educationGrades.giaiHSG.nam.format('YYYY') : undefined,
								minhChung: giaiHsgFileUrl,
						  }
						: undefined,
					diemDGTD: values.educationGrades.diemDGTD
						? {
								...values.educationGrades.diemDGTD,
								minhChung: dgtdFileUrl,
						  }
						: undefined,
					diemDGNL: values.educationGrades.diemDGNL
						? {
								...values.educationGrades.diemDGNL,
								minhChung: dgnlFileUrl,
						  }
						: undefined,
					chungChi: values.educationGrades.chungChi
						? values.educationGrades.chungChi.map((cc: any, index: number) => ({
								...cc,
								minhChung: chungChiFileUrls[index],
						  }))
						: undefined,
				},
				hocBa: showHocBa
					? {
							...values.hocBa,
							userId,
							id: existingHocBa?.id || `hb_${Date.now()}`,
							thongTinHocTapId: existingThongTinHocTap?.id || `ttht_${Date.now()}`,
							minhChung: hocBaFileUrl,
					  }
					: null,
			};
			console.log('Education grades submission for user:', userId, submissionData);
			onNext(submissionData);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	const handleUploadChange =
		(setFileList: React.Dispatch<React.SetStateAction<any[]>>) =>
		({ fileList }: { fileList: any[] }) => {
			setFileList(fileList);
		};

	return (
		<Form form={form} layout='vertical' initialValues={formattedInitialData}>
			{/* Thông tin trường THPT */}
			<Card title='Thông tin trường THPT' style={{ marginBottom: 16 }}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Tên trường'
							name={['educationGrades', 'thongTinTHPT', 'ten']}
							rules={[{ required: true, message: 'Vui lòng nhập tên trường!' }]}
						>
							<Input placeholder='Nhập tên trường' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Mã trường'
							name={['educationGrades', 'thongTinTHPT', 'maTruong']}
							rules={[{ required: true, message: 'Vui lòng nhập mã trường!' }]}
						>
							<Input placeholder='Nhập mã trường' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							label='Tỉnh/Thành phố'
							name={['educationGrades', 'thongTinTHPT', 'tinh_ThanhPho']}
							rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
						>
							<ProvincesSelect />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label='Quận/Huyện'
							name={['educationGrades', 'thongTinTHPT', 'quanHuyen']}
							rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
						>
							<DistrictsSelect provinceCode={provinceCode} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label='Xã/Phường'
							name={['educationGrades', 'thongTinTHPT', 'xaPhuong']}
							rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}
						>
							<WardsSelect districtCode={districtCode} />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label='Địa chỉ'
							name={['educationGrades', 'thongTinTHPT', 'diaChi']}
							rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
						>
							<Input placeholder='Nhập địa chỉ' />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							label='Khu vực ưu tiên'
							name={['educationGrades', 'thongTinTHPT', 'khuVucUT']}
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
					<Col span={8}>
						<Form.Item label='Đối tượng ưu tiên' name={['educationGrades', 'thongTinTHPT', 'doiTuongUT']}>
							<Select placeholder='Chọn đối tượng ưu tiên' allowClear>
								<Option value='hộ nghèo'>Hộ nghèo</Option>
								<Option value='cận nghèo'>Cận nghèo</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item
							label='Đã tốt nghiệp'
							name={['educationGrades', 'thongTinTHPT', 'daTotNghiep']}
							valuePropName='checked'
						>
							<Switch />
						</Form.Item>
					</Col>
					<Col span={16}>
						<Form.Item
							label='Năm tốt nghiệp / dự kiến tốt nghiệp'
							name={['educationGrades', 'thongTinTHPT', 'namTotNghiep']}
							rules={[{ required: true, message: 'Vui lòng chọn năm tốt nghiệp!' }]}
						>
							<DatePicker picker='year' style={{ width: '100%' }} placeholder='Chọn năm tốt nghiệp' />
						</Form.Item>
					</Col>
				</Row>
			</Card>

			{/* Điểm THPT */}
			<Card title='Điểm THPT' style={{ marginBottom: 16 }}>
				<Form.List name={['educationGrades', 'diemTHPT']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
									<Col span={10}>
										<Form.Item {...restField} name={[name, 'mon']} rules={[{ required: true, message: 'Chọn môn!' }]}>
											<Select placeholder='Chọn môn thi'>
												{monHocOptions.map((mon) => (
													<Option key={mon} value={mon.toLowerCase()}>
														{mon}
													</Option>
												))}
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
							<Form.List name={['hocBa', 'diemMonHoc']}>
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
										name={['hocBa', 'loaiHanhKiem']}
										rules={[{ required: true, message: 'Chọn loại hạnh kiểm!' }]}
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
										name={['hocBa', 'minhChung']}
										rules={[{ required: true, message: 'Vui lòng tải lên minh chứng!' }]}
									>
										<Upload
											fileList={hocBaFileList}
											onChange={handleUploadChange(setHocBaFileList)}
											beforeUpload={beforeUpload}
											accept='image/*,.pdf,.docx'
											listType='picture'
											maxCount={1}
										>
											<Button icon={<UploadOutlined />}>Tải lên minh chứng học bạ</Button>
										</Upload>
									</Form.Item>
								</Col>
							</Row>
						</Card>
					</>
				)}
			</Card>

			{/* Điểm đánh giá tư duy (DGTD) */}
			<Card title='Điểm đánh giá tư duy (DGTD)' style={{ marginBottom: 16 }}>
				<Form.List name={['educationGrades', 'diemDGTD', 'mon']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
									<Col span={10}>
										<Form.Item
											{...restField}
											name={[name, 'ten']}
											label='Tên môn'
											rules={[{ required: true, message: 'Nhập tên môn!' }]}
										>
											<Input placeholder='VD: Tư duy logic' />
										</Form.Item>
									</Col>
									<Col span={10}>
										<Form.Item
											{...restField}
											name={[name, 'diem']}
											label='Điểm'
											rules={[
												{ required: true, message: 'Nhập điểm!' },
												{ type: 'number', min: 0, max: 100, message: 'Điểm từ 0-100!' },
											]}
										>
											<InputNumber placeholder='Điểm' step={1} style={{ width: '100%' }} min={0} max={100} />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm môn đánh giá
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Tổng điểm DGTD'
							name={['educationGrades', 'diemDGTD', 'tongDiem']}
							rules={[{ type: 'number', min: 0, message: 'Tổng điểm không hợp lệ!' }]}
						>
							<InputNumber placeholder='Tổng điểm' step={1} style={{ width: '100%' }} min={0} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Minh chứng DGTD' name={['educationGrades', 'diemDGTD', 'minhChung']}>
							<Upload
								fileList={dgtdFileList}
								onChange={handleUploadChange(setDgtdFileList)}
								beforeUpload={beforeUpload}
								accept='image/*,.pdf,.docx'
								listType='picture'
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Tải lên minh chứng DGTD</Button>
							</Upload>
						</Form.Item>
					</Col>
				</Row>
			</Card>

			{/* Điểm đánh giá năng lực (DGNL) */}
			<Card title='Điểm đánh giá năng lực (DGNL)' style={{ marginBottom: 16 }}>
				<Form.List name={['educationGrades', 'diemDGNL', 'mon']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
									<Col span={10}>
										<Form.Item
											{...restField}
											name={[name, 'ten']}
											label='Tên môn'
											rules={[{ required: true, message: 'Nhập tên môn!' }]}
										>
											<Input placeholder='VD: Toán học' />
										</Form.Item>
									</Col>
									<Col span={10}>
										<Form.Item
											{...restField}
											name={[name, 'diem']}
											label='Điểm'
											rules={[
												{ required: true, message: 'Nhập điểm!' },
												{ type: 'number', min: 0, max: 100, message: 'Điểm từ 0-100!' },
											]}
										>
											<InputNumber placeholder='Điểm' step={1} style={{ width: '100%' }} min={0} max={100} />
										</Form.Item>
									</Col>
									<Col span={4}>
										<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
									</Col>
								</Row>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm môn đánh giá
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Tổng điểm DGNL'
							name={['educationGrades', 'diemDGNL', 'tongDiem']}
							rules={[{ type: 'number', min: 0, message: 'Tổng điểm không hợp lệ!' }]}
						>
							<InputNumber placeholder='Tổng điểm' step={1} style={{ width: '100%' }} min={0} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Minh chứng DGNL' name={['educationGrades', 'diemDGNL', 'minhChung']}>
							<Upload
								fileList={dgnlFileList}
								onChange={handleUploadChange(setDgnlFileList)}
								beforeUpload={beforeUpload}
								accept='image/*,.pdf,.docx'
								listType='picture'
								maxCount={1}
							>
								<Button icon={<UploadOutlined />}>Tải lên minh chứng DGNL</Button>
							</Upload>
						</Form.Item>
					</Col>
				</Row>
			</Card>

			{/* Giải học sinh giỏi */}
			<Card title='Giải học sinh giỏi' style={{ marginBottom: 16 }}>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item label='Cấp giải' name={['educationGrades', 'giaiHSG', 'giaiHsgCap']}>
							<Select placeholder='Chọn cấp giải' allowClear>
								<Option value='tỉnh'>Tỉnh</Option>
								<Option value='quốc gia'>Quốc gia</Option>
								<Option value='quốc tế'>Quốc tế</Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Môn' name={['educationGrades', 'giaiHSG', 'mon']}>
							<Select placeholder='Chọn môn'>
								{monHocOptions.map((mon) => (
									<Option key={mon} value={mon.toLowerCase()}>
										{mon}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Loại giải' name={['educationGrades', 'giaiHSG', 'loaiGiai']}>
							<Select placeholder='Chọn loại giải' allowClear>
								<Option value='nhất'>Nhất</Option>
								<Option value='nhì'>Nhì</Option>
								<Option value='ba'>Ba</Option>
								<Option value='khuyến khích'>Khuyến khích</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label='Năm' name={['educationGrades', 'giaiHSG', 'nam']}>
							<DatePicker picker='year' style={{ width: '100%' }} placeholder='Chọn năm' />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Nơi cấp' name={['educationGrades', 'giaiHSG', 'noiCap']}>
							<Input placeholder='VD: Sở GD&ĐT Hà Nội' />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item label='Minh chứng' name={['educationGrades', 'giaiHSG', 'minhChung']}>
					<Upload
						fileList={giaiHsgFileList}
						onChange={handleUploadChange(setGiaiHsgFileList)}
						beforeUpload={beforeUpload}
						accept='image/*,.pdf,.docx'
						listType='picture'
						maxCount={1}
					>
						<Button icon={<UploadOutlined />}>Tải lên minh chứng giải HSG</Button>
					</Upload>
				</Form.Item>
			</Card>

			{/* Chứng chỉ */}
			<Card title='Chứng chỉ ngoại ngữ/tin học' style={{ marginBottom: 16 }}>
				<Form.List name={['educationGrades', 'chungChi']}>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Row
									key={key}
									gutter={16}
									style={{ marginBottom: 8, padding: '8px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}
								>
									<Col span={8}>
										<Form.Item
											{...restField}
											name={[name, 'loaiCC']}
											label='Loại chứng chỉ'
											rules={[{ required: true, message: 'Chọn loại chứng chỉ!' }]}
										>
											<Select placeholder='Chọn loại chứng chỉ'>
												<Option value='tiếng anh'>Tiếng Anh</Option>
												<Option value='tin học'>Tin học</Option>
												<Option value='khác'>Khác</Option>
											</Select>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item
											{...restField}
											name={[name, 'ketQua']}
											label='Kết quả'
											rules={[{ required: true, message: 'Nhập kết quả!' }]}
										>
											<Input placeholder='VD: 7.5 IELTS, Giỏi...' />
										</Form.Item>
									</Col>
									<Col span={6}>
										<Form.Item
											{...restField}
											name={[name, 'minhChung']}
											label='Minh chứng'
											rules={[{ required: true, message: 'Vui lòng tải lên minh chứng!' }]}
										>
											<Upload
												fileList={chungChiFileLists[name] ? [chungChiFileLists[name]] : []}
												onChange={({ fileList }) => {
													const newFileLists = [...chungChiFileLists];
													newFileLists[name] = fileList[0];
													setChungChiFileLists(newFileLists);
												}}
												beforeUpload={beforeUpload}
												accept='image/*,.pdf,.docx'
												listType='picture'
												maxCount={1}
											>
												<Button icon={<UploadOutlined />}>Tải lên minh chứng</Button>
											</Upload>
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

			<div style={{ textAlign: 'center' }}>
				<Space style={{ textAlign: 'center', marginTop: 16, gap: 16 }}>
					<Button onClick={onPrev} disabled={loading}>
						Quay lại
					</Button>
					<Button type='primary' onClick={handleNext} loading={loading}>
						Tiếp tục
					</Button>
				</Space>
			</div>
		</Form>
	);
};

export default TTHocTapForm;

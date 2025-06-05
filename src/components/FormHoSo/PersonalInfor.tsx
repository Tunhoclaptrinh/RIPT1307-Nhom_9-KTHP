import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, DatePicker, Divider, Card, Radio, RadioChangeEvent } from 'antd';
import moment from 'moment';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';

const { Option } = Select;

// Define TypeScript interfaces for better type safety
interface AddressInfo {
	tinh_ThanhPho?: string;
	quanHuyen?: string;
	xaPhuong?: string;
	diaChi?: string;
}

interface BirthPlaceInfo {
	trongNuoc?: boolean;
	tinh_ThanhPho?: string;
	quanHuyen?: string;
	xaPhuong?: string;
	quocGia?: string;
}

interface AdditionalInfo {
	danToc?: string;
	quocTich?: string;
	tonGiao?: string;
	noiSinh?: BirthPlaceInfo;
}

interface UserData {
	ho?: string;
	ten?: string;
	username?: string;
	ngaySinh?: string;
	gioiTinh?: string;
	email?: string;
	soDT?: string;
	soCCCD?: string;
	ngayCap?: string;
	noiCap?: string;
	hoKhauThuongTru?: AddressInfo;
	thongTinBoSung?: AdditionalInfo;
}

interface PersonalInfo {
	ho?: string;
	ten?: string;
	username?: string;
	ngaySinh?: string;
	gioiTinh?: string;
	email?: string;
	soDT?: string;
	soCCCD?: string;
	ngayCap?: string;
	noiCap?: string;
	hoKhauThuongTru?: AddressInfo;
	thongTinBoSung?: AdditionalInfo;
}

interface InitialData {
	personalInfo?: PersonalInfo;
}

interface ExistingHoSo {
	thongTinBoSung?: AdditionalInfo;
	thongTinLienHe?: AddressInfo;
}

interface PersonalInfoFormProps {
	userId: string | number;
	initialData?: InitialData;
	onNext: (data: any) => void;
	userData?: UserData;
	existingHoSo?: ExistingHoSo;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ userId, initialData, onNext, userData, existingHoSo }) => {
	const [form] = Form.useForm();

	// State để lưu giá trị địa chỉ đã chọn
	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();

	// State để lưu giá trị nơi sinh
	const [selectedBirthProvince, setSelectedBirthProvince] = useState<string | undefined>();
	const [selectedBirthDistrict, setSelectedBirthDistrict] = useState<string | undefined>();
	const [selectedBirthWard, setSelectedBirthWard] = useState<string | undefined>();
	const [birthInCountry, setBirthInCountry] = useState<boolean>(true);

	// Effect to set form values when data is loaded
	useEffect(() => {
		if (userData) {
			// Prepare form values from userData
			const formValues = {
				ho: userData.ho,
				ten: userData.ten,
				username: userData.username,
				ngaySinh: userData.ngaySinh ? moment(userData.ngaySinh) : null,
				gioiTinh: userData.gioiTinh,
				email: userData.email,
				soDT: userData.soDT,
				soCCCD: userData.soCCCD,
				ngayCap: userData.ngayCap ? moment(userData.ngayCap) : null,
				noiCap: userData.noiCap,
				hoKhauThuongTru: {
					tinh_ThanhPho: userData.hoKhauThuongTru?.tinh_ThanhPho || '',
					quanHuyen: userData.hoKhauThuongTru?.quanHuyen || '',
					xaPhuong: userData.hoKhauThuongTru?.xaPhuong || '',
					diaChi: userData.hoKhauThuongTru?.diaChi || '',
				},
				thongTinBoSung: {
					danToc: userData.thongTinBoSung?.danToc || '',
					quocTich: userData.thongTinBoSung?.quocTich || 'Việt Nam',
					tonGiao: userData.thongTinBoSung?.tonGiao || '',
					noiSinh: {
						trongNuoc: userData.thongTinBoSung?.noiSinh?.trongNuoc ?? true,
						tinh_ThanhPho: userData.thongTinBoSung?.noiSinh?.tinh_ThanhPho || '',
						quanHuyen: userData.thongTinBoSung?.noiSinh?.quanHuyen || '',
						xaPhuong: userData.thongTinBoSung?.noiSinh?.xaPhuong || '',
						quocGia: userData.thongTinBoSung?.noiSinh?.quocGia || '',
					},
				},
			};

			// If there's existing hoSo data, merge it
			if (existingHoSo?.thongTinBoSung) {
				formValues.thongTinBoSung = {
					...formValues.thongTinBoSung,
					...existingHoSo.thongTinBoSung,
					noiSinh: {
						...formValues.thongTinBoSung.noiSinh,
						...existingHoSo.thongTinBoSung.noiSinh,
					},
				};
			}

			if (existingHoSo?.thongTinLienHe) {
				formValues.hoKhauThuongTru = {
					...formValues.hoKhauThuongTru,
					...existingHoSo.thongTinLienHe,
				};
			}

			// Set address states
			const province = userData.hoKhauThuongTru?.tinh_ThanhPho || existingHoSo?.thongTinLienHe?.tinh_ThanhPho;
			const district = userData.hoKhauThuongTru?.quanHuyen || existingHoSo?.thongTinLienHe?.quanHuyen;
			const ward = userData.hoKhauThuongTru?.xaPhuong || existingHoSo?.thongTinLienHe?.xaPhuong;

			setSelectedProvince(province);
			if (province && district) {
				setTimeout(() => {
					setSelectedDistrict(district);
					if (ward) {
						setTimeout(() => {
							setSelectedWard(ward);
						}, 100);
					}
				}, 100);
			}

			// Set birth place states
			const birthProvince = formValues.thongTinBoSung.noiSinh.tinh_ThanhPho;
			const birthDistrict = formValues.thongTinBoSung.noiSinh.quanHuyen;
			const birthWard = formValues.thongTinBoSung.noiSinh.xaPhuong;
			const inCountry = formValues.thongTinBoSung.noiSinh.trongNuoc;

			setBirthInCountry(inCountry);
			if (inCountry && birthProvince) {
				setSelectedBirthProvince(birthProvince);
				if (birthDistrict) {
					setTimeout(() => {
						setSelectedBirthDistrict(birthDistrict);
						if (birthWard) {
							setTimeout(() => {
								setSelectedBirthWard(birthWard);
							}, 100);
						}
					}, 100);
				}
			}

			// Set form values
			form.setFieldsValue(formValues);
		}
	}, [userData, existingHoSo, form]);

	// Also set initial values from initialData if available
	useEffect(() => {
		if (initialData?.personalInfo) {
			const personalInfo = initialData.personalInfo;
			const formValues = {
				ho: personalInfo.ho,
				ten: personalInfo.ten,
				username: personalInfo.username,
				ngaySinh: personalInfo.ngaySinh ? moment(personalInfo.ngaySinh) : null,
				gioiTinh: personalInfo.gioiTinh,
				email: personalInfo.email,
				soDT: personalInfo.soDT,
				soCCCD: personalInfo.soCCCD,
				ngayCap: personalInfo.ngayCap ? moment(personalInfo.ngayCap) : null,
				noiCap: personalInfo.noiCap,
				hoKhauThuongTru: personalInfo.hoKhauThuongTru || {},
				thongTinBoSung: personalInfo.thongTinBoSung || {
					noiSinh: {
						trongNuoc: true,
						tinh_ThanhPho: '',
						quanHuyen: '',
						xaPhuong: '',
						quocGia: '',
					},
				},
			};

			// Set address states from initialData
			const province = personalInfo.hoKhauThuongTru?.tinh_ThanhPho;
			const district = personalInfo.hoKhauThuongTru?.quanHuyen;
			const ward = personalInfo.hoKhauThuongTru?.xaPhuong;

			if (province) {
				setSelectedProvince(province);
				if (district) {
					setTimeout(() => {
						setSelectedDistrict(district);
						if (ward) {
							setTimeout(() => {
								setSelectedWard(ward);
							}, 100);
						}
					}, 100);
				}
			}

			// Set birth place states from initialData
			const birthInfo = personalInfo.thongTinBoSung?.noiSinh;
			if (birthInfo) {
				setBirthInCountry(birthInfo.trongNuoc ?? true);
				if (birthInfo.trongNuoc && birthInfo.tinh_ThanhPho) {
					setSelectedBirthProvince(birthInfo.tinh_ThanhPho);
					if (birthInfo.quanHuyen) {
						setTimeout(() => {
							setSelectedBirthDistrict(birthInfo.quanHuyen);
							if (birthInfo.xaPhuong) {
								setTimeout(() => {
									setSelectedBirthWard(birthInfo.xaPhuong);
								}, 100);
							}
						}, 100);
					}
				}
			}

			form.setFieldsValue(formValues);
		}
	}, [initialData, form]);

	const handleProvinceChange = (value: string) => {
		setSelectedProvince(value);
		setSelectedDistrict(undefined);
		setSelectedWard(undefined);

		form.setFieldsValue({
			hoKhauThuongTru: {
				tinh_ThanhPho: value,
				quanHuyen: undefined,
				xaPhuong: undefined,
				diaChi: form.getFieldValue(['hoKhauThuongTru', 'diaChi']),
			},
		});
	};

	const handleDistrictChange = (value: string) => {
		setSelectedDistrict(value);
		setSelectedWard(undefined);

		form.setFieldsValue({
			hoKhauThuongTru: {
				tinh_ThanhPho: selectedProvince,
				quanHuyen: value,
				xaPhuong: undefined,
				diaChi: form.getFieldValue(['hoKhauThuongTru', 'diaChi']),
			},
		});
	};

	const handleWardChange = (value: string) => {
		setSelectedWard(value);

		form.setFieldsValue({
			hoKhauThuongTru: {
				tinh_ThanhPho: selectedProvince,
				quanHuyen: selectedDistrict,
				xaPhuong: value,
				diaChi: form.getFieldValue(['hoKhauThuongTru', 'diaChi']),
			},
		});
	};

	// Handlers for birth place - FIXED: Using RadioChangeEvent instead of React.ChangeEvent
	const handleBirthInCountryChange = (e: RadioChangeEvent) => {
		const inCountry = e.target.value as boolean; // Cast to boolean since radio values are boolean
		setBirthInCountry(inCountry);

		// Reset birth place fields when changing country status
		setSelectedBirthProvince(undefined);
		setSelectedBirthDistrict(undefined);
		setSelectedBirthWard(undefined);

		form.setFieldsValue({
			thongTinBoSung: {
				...form.getFieldValue('thongTinBoSung'),
				noiSinh: {
					trongNuoc: inCountry,
					tinh_ThanhPho: '',
					quanHuyen: '',
					xaPhuong: '',
					quocGia: inCountry ? '' : form.getFieldValue(['thongTinBoSung', 'noiSinh', 'quocGia']),
				},
			},
		});
	};

	const handleBirthProvinceChange = (value: string) => {
		setSelectedBirthProvince(value);
		setSelectedBirthDistrict(undefined);
		setSelectedBirthWard(undefined);

		form.setFieldsValue({
			thongTinBoSung: {
				...form.getFieldValue('thongTinBoSung'),
				noiSinh: {
					...form.getFieldValue(['thongTinBoSung', 'noiSinh']),
					tinh_ThanhPho: value,
					quanHuyen: '',
					xaPhuong: '',
				},
			},
		});
	};

	const handleBirthDistrictChange = (value: string) => {
		setSelectedBirthDistrict(value);
		setSelectedBirthWard(undefined);

		form.setFieldsValue({
			thongTinBoSung: {
				...form.getFieldValue('thongTinBoSung'),
				noiSinh: {
					...form.getFieldValue(['thongTinBoSung', 'noiSinh']),
					quanHuyen: value,
					xaPhuong: '',
				},
			},
		});
	};

	const handleBirthWardChange = (value: string) => {
		setSelectedBirthWard(value);

		form.setFieldsValue({
			thongTinBoSung: {
				...form.getFieldValue('thongTinBoSung'),
				noiSinh: {
					...form.getFieldValue(['thongTinBoSung', 'noiSinh']),
					xaPhuong: value,
				},
			},
		});
	};

	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			console.log('Personal info for user:', userId);

			// Convert moment objects back to string format for API
			const formattedValues = {
				personalInfo: {
					...values,
					ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
					ngayCap: values.ngayCap ? values.ngayCap.format('YYYY-MM-DD') : null,
					// Separate hoKhauThuongTru as thongTinLienHe for consistency with existing structure
					thongTinLienHe: values.hoKhauThuongTru,
				},
			};

			onNext(formattedValues);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Form form={form} layout='vertical'>
			{/* Thông tin cơ bản */}
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
					<Form.Item label='Username' name='username'>
						<Input placeholder='Nhập username' />
					</Form.Item>
				</Col>
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
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Form.Item label='Số CCCD' name='soCCCD' rules={[{ required: true, message: 'Vui lòng nhập số CCCD!' }]}>
						<Input placeholder='Nhập số CCCD' />
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
				<Col span={8}>
					<Form.Item label='Ngày cấp' name='ngayCap' rules={[{ required: true, message: 'Vui lòng chọn ngày cấp!' }]}>
						<DatePicker style={{ width: '100%' }} placeholder='Chọn ngày cấp' />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label='Ngày sinh'
						name='ngaySinh'
						rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
					>
						<DatePicker style={{ width: '100%' }} placeholder='Chọn ngày sinh' />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item
						label='Giới tính'
						name='gioiTinh'
						rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
					>
						<Select placeholder='Chọn giới tính'>
							<Option value='nam'>Nam</Option>
							<Option value='nữ'>Nữ</Option>
							<Option value='khác'>Khác</Option>
						</Select>
					</Form.Item>
				</Col>
			</Row>

			<Form.Item label='Nơi cấp CCCD' name='noiCap' rules={[{ required: true, message: 'Vui lòng nhập nơi cấp!' }]}>
				<Input placeholder='Nhập nơi cấp CCCD' />
			</Form.Item>

			{/* Hộ khẩu thường trú */}
			<Card title='Hộ khẩu thường trú' style={{ marginTop: 16, marginBottom: 16 }}>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Tỉnh/Thành phố'
							name={['hoKhauThuongTru', 'tinh_ThanhPho']}
							rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
						>
							<ProvincesSelect
								placeholder='Chọn tỉnh/thành phố'
								onChange={handleProvinceChange}
								value={selectedProvince}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Quận/Huyện'
							name={['hoKhauThuongTru', 'quanHuyen']}
							rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
						>
							<DistrictsSelect
								provinceCode={selectedProvince}
								placeholder='Chọn quận/huyện'
								onChange={handleDistrictChange}
								value={selectedDistrict}
								disabled={!selectedProvince}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Xã/Phường'
							name={['hoKhauThuongTru', 'xaPhuong']}
							rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}
						>
							<WardsSelect
								districtCode={selectedDistrict}
								placeholder='Chọn xã/phường'
								onChange={handleWardChange}
								value={selectedWard}
								disabled={!selectedDistrict}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Địa chỉ cụ thể'
							name={['hoKhauThuongTru', 'diaChi']}
							rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể!' }]}
						>
							<Input placeholder='Nhập số nhà, tên đường...' />
						</Form.Item>
					</Col>
				</Row>
			</Card>

			{/* Thông tin bổ sung */}
			<Divider>Thông tin bổ sung</Divider>
			<Row gutter={16}>
				<Col span={8}>
					<Form.Item label='Dân tộc' name={['thongTinBoSung', 'danToc']}>
						<Input placeholder='Nhập dân tộc' />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label='Quốc tịch' name={['thongTinBoSung', 'quocTich']}>
						<Input placeholder='Nhập quốc tịch' defaultValue='Việt Nam' />
					</Form.Item>
				</Col>
				<Col span={8}>
					<Form.Item label='Tôn giáo' name={['thongTinBoSung', 'tonGiao']}>
						<Input placeholder='Nhập tôn giáo' />
					</Form.Item>
				</Col>
			</Row>

			{/* Nơi sinh */}
			<Card title='Nơi sinh' style={{ marginTop: 16, marginBottom: 16 }}>
				<Form.Item
					label='Sinh tại'
					name={['thongTinBoSung', 'noiSinh', 'trongNuoc']}
					rules={[{ required: true, message: 'Vui lòng chọn nơi sinh!' }]}
				>
					<Radio.Group onChange={handleBirthInCountryChange} value={birthInCountry}>
						<Radio value={true}>Trong nước</Radio>
						<Radio value={false}>Nước ngoài</Radio>
					</Radio.Group>
				</Form.Item>

				{birthInCountry ? (
					<>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item
									label='Tỉnh/Thành phố sinh'
									name={['thongTinBoSung', 'noiSinh', 'tinh_ThanhPho']}
									rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố sinh!' }]}
								>
									<ProvincesSelect
										placeholder='Chọn tỉnh/thành phố sinh'
										onChange={handleBirthProvinceChange}
										value={selectedBirthProvince}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									label='Quận/Huyện sinh'
									name={['thongTinBoSung', 'noiSinh', 'quanHuyen']}
									rules={[{ required: true, message: 'Vui lòng chọn quận/huyện sinh!' }]}
								>
									<DistrictsSelect
										provinceCode={selectedBirthProvince}
										placeholder='Chọn quận/huyện sinh'
										onChange={handleBirthDistrictChange}
										value={selectedBirthDistrict}
										disabled={!selectedBirthProvince}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									label='Xã/Phường sinh'
									name={['thongTinBoSung', 'noiSinh', 'xaPhuong']}
									rules={[{ required: true, message: 'Vui lòng chọn xã/phường sinh!' }]}
								>
									<WardsSelect
										districtCode={selectedBirthDistrict}
										placeholder='Chọn xã/phường sinh'
										onChange={handleBirthWardChange}
										value={selectedBirthWard}
										disabled={!selectedBirthDistrict}
									/>
								</Form.Item>
							</Col>
						</Row>
					</>
				) : (
					<Form.Item
						label='Quốc gia sinh'
						name={['thongTinBoSung', 'noiSinh', 'quocGia']}
						rules={[{ required: true, message: 'Vui lòng nhập quốc gia sinh!' }]}
					>
						<Input placeholder='Nhập tên quốc gia' />
					</Form.Item>
				)}
			</Card>

			<div style={{ textAlign: 'center', marginTop: 16 }}>
				<Button type='primary' onClick={handleNext}>
					Tiếp tục
				</Button>
			</div>
		</Form>
	);
};

export default PersonalInfoForm;

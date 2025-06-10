import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Select, DatePicker, Divider, Card, Radio, RadioChangeEvent, Space } from 'antd';
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

// Thông tin liên hệ theo cấu trúc hồ sơ
interface ContactInfo {
	ten?: string;
	diaChi?: {
		tinh_ThanhPho?: string;
		quanHuyen?: string;
		xaPhuong?: string;
		diaChiCuThe?: string;
	};
}

// Thông tin cá nhân (user data)
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
	avatar?: string;
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
	avatar?: string;
}

interface InitialData {
	personalInfo?: PersonalInfo;
}

// Cấu trúc hồ sơ hiện tại
interface ExistingHoSo {
	thongTinBoSung?: AdditionalInfo;
	thongTinLienHe?: ContactInfo;
}

interface ThongTinCaNhanFormProps {
	userId: string | number;
	initialData?: InitialData;
	onNext: (data: any) => void;
	onPrev: (data: any) => void;
	userData?: UserData;
	existingHoSo?: ExistingHoSo;
	loading?: boolean;
}

const ThongTinCaNhanForm: React.FC<ThongTinCaNhanFormProps> = ({
	userId,
	initialData,
	onNext,
	userData,
	existingHoSo,
	onPrev,
	loading = false,
}) => {
	const [form] = Form.useForm();

	// State để lưu giá trị địa chỉ hộ khẩu thường trú (từ userData)
	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();

	// State để lưu giá trị địa chỉ liên hệ (từ hồ sơ)
	const [selectedContactProvince, setSelectedContactProvince] = useState<string | undefined>();
	const [selectedContactDistrict, setSelectedContactDistrict] = useState<string | undefined>();
	const [selectedContactWard, setSelectedContactWard] = useState<string | undefined>();

	// State để lưu giá trị nơi sinh
	const [selectedBirthProvince, setSelectedBirthProvince] = useState<string | undefined>();
	const [birthInCountry, setBirthInCountry] = useState<boolean>(true);

	// Effect to set form values when data is loaded
	useEffect(() => {
		if (userData) {
			// Prepare form values from userData (thông tin cá nhân)
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
				thongTinBoSung: {},
				thongTinLienHe: {},
				avatar: userData.avatar,
			};

			// Thêm thông tin bổ sung và liên hệ từ hồ sơ (nếu có)
			if (existingHoSo) {
				// Thông tin bổ sung
				formValues.thongTinBoSung = {
					danToc: existingHoSo.thongTinBoSung?.danToc || '',
					quocTich: existingHoSo.thongTinBoSung?.quocTich || 'Việt Nam',
					tonGiao: existingHoSo.thongTinBoSung?.tonGiao || '',
					noiSinh: {
						trongNuoc: existingHoSo.thongTinBoSung?.noiSinh?.trongNuoc ?? true,
						tinh_ThanhPho: existingHoSo.thongTinBoSung?.noiSinh?.tinh_ThanhPho || '',
						quocGia: existingHoSo.thongTinBoSung?.noiSinh?.quocGia || '',
					},
				};

				// Thông tin liên hệ
				formValues.thongTinLienHe = {
					ten: existingHoSo.thongTinLienHe?.ten || '',
					diaChi: {
						tinh_ThanhPho: existingHoSo.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
						quanHuyen: existingHoSo.thongTinLienHe?.diaChi?.quanHuyen || '',
						xaPhuong: existingHoSo.thongTinLienHe?.diaChi?.xaPhuong || '',
						diaChiCuThe: existingHoSo.thongTinLienHe?.diaChi?.diaChiCuThe || '',
					},
				};
			} else {
				// Nếu không có hồ sơ, khởi tạo giá trị mặc định
				formValues.thongTinBoSung = {
					danToc: '',
					quocTich: 'Việt Nam',
					tonGiao: '',
					noiSinh: {
						trongNuoc: true,
						tinh_ThanhPho: '',
						quocGia: '',
					},
				};

				formValues.thongTinLienHe = {
					ten: '',
					diaChi: {
						tinh_ThanhPho: '',
						quanHuyen: '',
						xaPhuong: '',
						diaChiCuThe: '',
					},
				};
			}

			// Set address states for hộ khẩu thường trú
			const province = userData.hoKhauThuongTru?.tinh_ThanhPho;
			const district = userData.hoKhauThuongTru?.quanHuyen;
			const ward = userData.hoKhauThuongTru?.xaPhuong;

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

			// Set address states for thông tin liên hệ
			const contactProvince = existingHoSo?.thongTinLienHe?.diaChi?.tinh_ThanhPho;
			const contactDistrict = existingHoSo?.thongTinLienHe?.diaChi?.quanHuyen;
			const contactWard = existingHoSo?.thongTinLienHe?.diaChi?.xaPhuong;

			setSelectedContactProvince(contactProvince);
			if (contactProvince && contactDistrict) {
				setTimeout(() => {
					setSelectedContactDistrict(contactDistrict);
					if (contactWard) {
						setTimeout(() => {
							setSelectedContactWard(contactWard);
						}, 100);
					}
				}, 100);
			}

			// Set birth place states
			const birthProvince = existingHoSo?.thongTinBoSung?.noiSinh?.tinh_ThanhPho;
			const inCountry = existingHoSo?.thongTinBoSung?.noiSinh?.trongNuoc ?? true;

			setBirthInCountry(inCountry);
			if (inCountry && birthProvince) {
				setSelectedBirthProvince(birthProvince);
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

			form.setFieldsValue(formValues);
		}
	}, [initialData, form]);

	// Handlers cho hộ khẩu thường trú
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

	// Handlers cho thông tin liên hệ
	const handleContactProvinceChange = (value: string) => {
		setSelectedContactProvince(value);
		setSelectedContactDistrict(undefined);
		setSelectedContactWard(undefined);

		form.setFieldsValue({
			thongTinLienHe: {
				...form.getFieldValue('thongTinLienHe'),
				diaChi: {
					tinh_ThanhPho: value,
					quanHuyen: undefined,
					xaPhuong: undefined,
					diaChiCuThe: form.getFieldValue(['thongTinLienHe', 'diaChi', 'diaChiCuThe']),
				},
			},
		});
	};

	const handleContactDistrictChange = (value: string) => {
		setSelectedContactDistrict(value);
		setSelectedContactWard(undefined);

		form.setFieldsValue({
			thongTinLienHe: {
				...form.getFieldValue('thongTinLienHe'),
				diaChi: {
					tinh_ThanhPho: selectedContactProvince,
					quanHuyen: value,
					xaPhuong: undefined,
					diaChiCuThe: form.getFieldValue(['thongTinLienHe', 'diaChi', 'diaChiCuThe']),
				},
			},
		});
	};

	const handleContactWardChange = (value: string) => {
		setSelectedContactWard(value);

		form.setFieldsValue({
			thongTinLienHe: {
				...form.getFieldValue('thongTinLienHe'),
				diaChi: {
					tinh_ThanhPho: selectedContactProvince,
					quanHuyen: selectedContactDistrict,
					xaPhuong: value,
					diaChiCuThe: form.getFieldValue(['thongTinLienHe', 'diaChi', 'diaChiCuThe']),
				},
			},
		});
	};

	// Handlers for birth place
	const handleBirthInCountryChange = (e: RadioChangeEvent) => {
		const inCountry = e.target.value as boolean;
		setBirthInCountry(inCountry);

		setSelectedBirthProvince(undefined);

		form.setFieldsValue({
			thongTinBoSung: {
				...form.getFieldValue('thongTinBoSung'),
				noiSinh: {
					trongNuoc: inCountry,
					tinh_ThanhPho: '',
					quocGia: inCountry ? '' : form.getFieldValue(['thongTinBoSung', 'noiSinh', 'quocGia']),
				},
			},
		});
	};

	const handleBirthProvinceChange = (value: string) => {
		setSelectedBirthProvince(value);

		form.setFieldsValue({
			thongTinBoSung: {
				...form.getFieldValue('thongTinBoSung'),
				noiSinh: {
					...form.getFieldValue(['thongTinBoSung', 'noiSinh']),
					tinh_ThanhPho: value,
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
				// Thông tin cá nhân (cập nhật vào userData)
				personalInfo: {
					ho: values.ho,
					ten: values.ten,
					username: values.username,
					ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
					gioiTinh: values.gioiTinh,
					email: values.email,
					soDT: values.soDT,
					soCCCD: values.soCCCD,
					ngayCap: values.ngayCap ? values.ngayCap.format('YYYY-MM-DD') : null,
					noiCap: values.noiCap,
					hoKhauThuongTru: values.hoKhauThuongTru,
				},
				// Thông tin hồ sơ (thongTinBoSung và thongTinLienHe)
				hoSoInfo: {
					thongTinBoSung: values.thongTinBoSung,
					thongTinLienHe: values.thongTinLienHe,
				},
			};

			onNext(formattedValues);
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Form form={form} layout='vertical' style={{ height: '100%', background: '#fff' }}>
			{/* Thông tin cá nhân */}
			<Card title='Thông tin cá nhân' style={{ marginBottom: 16 }}>
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
				<Divider>Hộ khẩu thường trú</Divider>
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

			{/* Thông tin bổ sung cho hồ sơ */}
			<div style={{ marginBottom: 16, background: '#fff' }}>
				<Card title='Thông tin bổ sung'>
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
					<Divider>Nơi sinh</Divider>
					<Row gutter={16}>
						<Col span={12}>
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
						</Col>

						{birthInCountry ? (
							<Col span={12}>
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
						) : (
							<Col span={12}>
								<Form.Item
									label='Quốc gia sinh'
									name={['thongTinBoSung', 'noiSinh', 'quocGia']}
									rules={[{ required: true, message: 'Vui lòng nhập quốc gia sinh!' }]}
								>
									<Input placeholder='Nhập tên quốc gia' />
								</Form.Item>
							</Col>
						)}
					</Row>
				</Card>
			</div>

			{/* Thông tin liên hệ cho hồ sơ */}
			<Card title='Thông tin liên hệ' style={{ marginBottom: 16 }}>
				<Form.Item
					label='Tên người liên hệ'
					name={['thongTinLienHe', 'ten']}
					rules={[{ required: true, message: 'Vui lòng nhập tên người liên hệ!' }]}
				>
					<Input placeholder='Nhập tên người liên hệ' />
				</Form.Item>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Tỉnh/Thành phố'
							name={['thongTinLienHe', 'diaChi', 'tinh_ThanhPho']}
							rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
						>
							<ProvincesSelect
								placeholder='Chọn tỉnh/thành phố'
								onChange={handleContactProvinceChange}
								value={selectedContactProvince}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Quận/Huyện'
							name={['thongTinLienHe', 'diaChi', 'quanHuyen']}
							rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
						>
							<DistrictsSelect
								provinceCode={selectedContactProvince}
								placeholder='Chọn quận/huyện'
								onChange={handleContactDistrictChange}
								value={selectedContactDistrict}
								disabled={!selectedContactProvince}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							label='Xã/Phường'
							name={['thongTinLienHe', 'diaChi', 'xaPhuong']}
							rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}
						>
							<WardsSelect
								districtCode={selectedContactDistrict}
								placeholder='Chọn xã/phường'
								onChange={handleContactWardChange}
								value={selectedContactWard}
								disabled={!selectedContactDistrict}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Địa chỉ cụ thể'
							name={['thongTinLienHe', 'diaChi', 'diaChiCuThe']}
							rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể!' }]}
						>
							<Input placeholder='Nhập số nhà, tên đường...' />
						</Form.Item>
					</Col>
				</Row>
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

export default ThongTinCaNhanForm;

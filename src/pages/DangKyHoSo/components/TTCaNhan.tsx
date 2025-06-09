import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Row, Col, Select, DatePicker, Divider, Card, Radio, Space } from 'antd';
import moment from 'moment';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import useAuth from '../../../hooks/useAuth';
import rules from '@/utils/rules';
import UploadFile from '@/components/Upload/UploadFile';

const { Option } = Select;

interface PersonalInfoProps {
	userId: string;
	initialData: any;
	onNext: (data: any) => void;
	onPrev: (data: any) => void;
	userData: any;
	existingHoSo: any;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ userId, initialData, onNext, onPrev, userData, existingHoSo }) => {
	const { user } = useAuth();
	const [form] = Form.useForm();
	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();
	const [selectedContactProvince, setSelectedContactProvince] = useState<string | undefined>();
	const [selectedContactDistrict, setSelectedContactDistrict] = useState<string | undefined>();
	const [selectedContactWard, setSelectedContactWard] = useState<string | undefined>();
	const [selectedBirthProvince, setSelectedBirthProvince] = useState<string | undefined>();
	const [birthInCountry, setBirthInCountry] = useState<boolean>(true);

	useEffect(() => {
		if (userData) {
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
					danToc: existingHoSo?.thongTinBoSung?.danToc || '',
					quocTich: existingHoSo?.thongTinBoSung?.quocTich || 'Việt Nam',
					tonGiao: existingHoSo?.thongTinBoSung?.tonGiao || '',
					noiSinh: {
						trongNuoc: existingHoSo?.thongTinBoSung?.noiSinh?.trongNuoc ?? true,
						tinh_ThanhPho: existingHoSo?.thongTinBoSung?.noiSinh?.tinh_ThanhPho || '',
						quocGia: existingHoSo?.thongTinBoSung?.noiSinh?.quocGia || '',
					},
				},
				thongTinLienHe: {
					ten: existingHoSo?.thongTinLienHe?.ten || '',
					diaChi: {
						tinh_ThanhPho: existingHoSo?.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
						quanHuyen: existingHoSo?.thongTinLienHe?.diaChi?.quanHuyen || '',
						xaPhuong: existingHoSo?.thongTinLienHe?.diaChi?.xaPhuong || '',
						diaChiCuThe: existingHoSo?.thongTinLienHe?.diaChi?.diaChiCuThe || '',
					},
				},
			};

			form.setFieldsValue(formValues);

			// Set address states
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

			const birthProvince = existingHoSo?.thongTinBoSung?.noiSinh?.tinh_ThanhPho;
			const inCountry = existingHoSo?.thongTinBoSung?.noiSinh?.trongNuoc ?? true;
			setBirthInCountry(inCountry);
			if (inCountry && birthProvince) {
				setSelectedBirthProvince(birthProvince);
			}
		}
	}, [userData, existingHoSo, form]);

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

	const handleBirthInCountryChange = (e: any) => {
		const inCountry = e.target.value;
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
			const formattedValues = {
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
				hoSoInfo: {
					thongTinBoSung: values.thongTinBoSung,
					thongTinLienHe: values.thongTinLienHe,
				},
			};
			onNext(formattedValues);
		} catch (error) {
			console.error('Validation failed:', error);
			message.error('Vui lòng hoàn thành tất cả các trường bắt buộc!');
		}
	};

	return (
		<div>
			<Card title='Thông tin cá nhân'>
				<Form form={form} layout='vertical' autoComplete='off'>
					<Row gutter={[16, 0]} style={{ marginBottom: 16 }}>
						<Col span={24} md={12}>
							<Form.Item label='Họ và tên đệm' name='ho' rules={[...rules.required]}>
								<Input placeholder='Nhập họ và tên đệm' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item label='Tên' name='ten' rules={[...rules.required]}>
								<Input placeholder='Nhập tên' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16} style={{ marginBottom: 16 }}>
						<Col span={24}>
							<Form.Item label='Ảnh đại diện' name='avatar'>
								<UploadFile isAvatar maxFileSize={5} buttonDescription='Tải lên ảnh đại diện' />
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
							<Form.Item label='Email' name='email' rules={[...rules.required, ...rules.email]}>
								<Input placeholder='Nhập email' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Số CCCD' name='soCCCD' rules={[...rules.required]}>
								<Input placeholder='Nhập số CCCD' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Số điện thoại' name='soDT' rules={[...rules.required]}>
								<Input placeholder='Nhập số điện thoại' />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={8}>
							<Form.Item label='Ngày cấp' name='ngayCap' rules={[...rules.required]}>
								<DatePicker style={{ width: '100%' }} placeholder='Chọn ngày cấp' />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label='Ngày sinh' name='ngaySinh' rules={[...rules.required]}>
								<DatePicker style={{ width: '100%' }} placeholder='Chọn ngày sinh' />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item label='Giới tính' name='gioiTinh' rules={[...rules.required]}>
								<Select placeholder='Chọn giới tính'>
									<Option value='nam'>Nam</Option>
									<Option value='nữ'>Nữ</Option>
									<Option value='khác'>Khác</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label='Nơi cấp' name='noiCap' rules={[...rules.required]}>
						<Input placeholder='Nhập nơi cấp CCCD' />
					</Form.Item>
					<Divider>Hộ khẩu thường trú</Divider>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Tỉnh/Thành phố' name={['hoKhauThuongTru', 'tinh_ThanhPho']} rules={[...rules.required]}>
								<ProvincesSelect
									placeholder='Chọn tỉnh/thành phố'
									onChange={handleProvinceChange}
									value={selectedProvince}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Quận/Huyện' name={['hoKhauThuongTru', 'quanHuyen']} rules={[...rules.required]}>
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
							<Form.Item label='Xã/Phường' name={['hoKhauThuongTru', 'xaPhuong']} rules={[...rules.required]}>
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
							<Form.Item label='Địa chỉ cụ thể' name={['hoKhauThuongTru', 'diaChi']} rules={[...rules.required]}>
								<Input placeholder='Nhập số nhà, tên đường...' />
							</Form.Item>
						</Col>
					</Row>
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
					<Divider>Thông tin liên hệ</Divider>
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
					<div style={{ textAlign: 'center', marginTop: '32px' }}>
						<Space size='large'>
							<Button type='primary' size='large' onClick={handleNext} style={{ minWidth: '150px' }}>
								Tiếp tục
							</Button>
						</Space>
					</div>
				</Form>
			</Card>
		</div>
	);
};

export default PersonalInfo;

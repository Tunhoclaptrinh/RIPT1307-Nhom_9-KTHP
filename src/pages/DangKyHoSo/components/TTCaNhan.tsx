import React, { useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Modal, message, Space } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import useAuth from '../../../hooks/useAuth';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

const { Option } = Select;
const { TextArea } = Input;

interface PersonalInfoProps {
	record?: any;
	edit?: boolean;
	setVisibleForm?: (visible: boolean) => void;
	postModel?: (data: any) => Promise<void>;
	putModel?: (id: string, data: any) => Promise<void>;
	visibleForm?: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
	record = {},
	edit = false,
	setVisibleForm,
	postModel,
	putModel,
	visibleForm,
}) => {
	const { user } = useAuth(); // Lấy thông tin user từ useAuth
	const [form] = Form.useForm();
	const intl = useIntl();
	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (user) {
			const formData = {
				ho: user.ho || '',
				ten: user.ten || '',
				username: user.preferred_username || '',
				email: user.email || '',
				soCCCD: user.soCCCD || '',
				soDT: user.soDT || '',
				ngayCap: user.ngayCap ? moment(user.ngayCap) : undefined,
				ngaySinh: user.ngaySinh ? moment(user.ngaySinh) : undefined,
				gioiTinh: user.gioiTinh || undefined,
				noiCap: user.noiCap || '',
				hoKhauThuongTru: {
					tinh_ThanhPho: user.hoKhauThuongTru?.tinh_ThanhPho || undefined,
					quanHuyen: user.hoKhauThuongTru?.quanHuyen || undefined,
					xaPhuong: user.hoKhauThuongTru?.xaPhuong || undefined,
					diaChi: user.hoKhauThuongTru?.diaChi || '',
				},
			};

			form.setFieldsValue(formData);

			// Set selected address values
			const province = user.hoKhauThuongTru?.tinh_ThanhPho;
			const district = user.hoKhauThuongTru?.quanHuyen;
			const ward = user.hoKhauThuongTru?.xaPhuong;

			setSelectedProvince(province);
			if (province && district) {
				setTimeout(() => {
					setSelectedDistrict(district);
					if (ward) {
						setTimeout(() => {
							setSelectedWard(ward);
						}, 500);
					}
				}, 500);
			}
		}
	}, [user, form]);

	const handleProvinceChange = (value: string) => {
		console.log('Province changed:', value);
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
		console.log('District changed:', value);
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
		console.log('Ward changed:', value);
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

	const onFinish = async (values: any) => {
		try {
			setSubmitting(true);
			const submitData = {
				...values,
				ngayCap: values.ngayCap?.format('YYYY-MM-DD'),
				ngaySinh: values.ngaySinh?.format('YYYY-MM-DD'),
				hoKhauThuongTru: {
					tinh_ThanhPho: values.hoKhauThuongTru?.tinh_ThanhPho,
					quanHuyen: values.hoKhauThuongTru?.quanHuyen,
					xaPhuong: values.hoKhauThuongTru?.xaPhuong,
					diaChi: values.hoKhauThuongTru?.diaChi,
				},
			};

			console.log('Form submitted with data:', submitData);
			message.success('Thông tin cá nhân đã được lưu!');
		} catch (error) {
			console.error('Form submission error:', error);
			message.error('Lỗi khi lưu thông tin cá nhân');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div>
			<Card title='Thông tin cá nhân'>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					<Row gutter={[16, 0]} style={{ marginBottom: 16 }}>
						<Col span={24} md={12}>
							<Form.Item label='Họ' name='ho' rules={[...rules.required]}>
								<Input placeholder='Nhập họ' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item label='Tên' name='ten' rules={[...rules.required]}>
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

					<Card title='Hộ khẩu thường trú' style={{ marginTop: 16, border: 'none' }}>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label='Tỉnh/Thành phố'
									name={['hoKhauThuongTru', 'tinh_ThanhPho']}
									rules={[...rules.required]}
								>
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
					</Card>
				</Form>
			</Card>
		</div>
	);
};

export default PersonalInfo;
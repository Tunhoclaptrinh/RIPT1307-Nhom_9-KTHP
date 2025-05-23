import React, { useEffect, useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import dayjs from 'dayjs';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import HeDaoTaoSelect from '../../HeDaoTao/components/Select';

const { Option } = Select;

interface UserFormProps {
	title?: string;
	[key: string]: any;
}

const UserForm: React.FC<UserFormProps> = ({ title = 'người dùng' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('users');
	const [form] = Form.useForm();
	const intl = useIntl();

	// State để lưu giá trị địa chỉ đã chọn
	const [selectedProvince, setSelectedProvince] = useState<string>();
	const [selectedDistrict, setSelectedDistrict] = useState<string>();
	const [selectedWard, setSelectedWard] = useState<string>();

	// Thêm state loading
	const [submitting, setSubmitting] = useState(false);

	// Reset form và cập nhật giá trị khi record thay đổi
	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedProvince(undefined);
			setSelectedDistrict(undefined);
			setSelectedWard(undefined);
		} else if (record?.id) {
			const formData = {
				...record,
				ngayCap: record.ngayCap ? dayjs(record.ngayCap) : undefined,
				ngaySinh: record.ngaySinh ? dayjs(record.ngaySinh) : undefined,
			};
			form.setFieldsValue(formData);

			// Cập nhật state địa chỉ
			setSelectedProvince(record.hoKhauThuongTru?.tinh_ThanhPho);
			setSelectedDistrict(record.hoKhauThuongTru?.quanHuyen);
			setSelectedWard(record.hoKhauThuongTru?.xaPhuong);
		}
	}, [record?.id, visibleForm]);

	// Cập nhật hàm onFinish
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

			if (edit) {
				await putModel(record?.id ?? '', submitData);
			} else {
				await postModel(submitData);
			}
			setVisibleForm(false);
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			setSubmitting(false);
		}
	};

	const handleProvinceChange = (value: string) => {
		setSelectedProvince(value);
		setSelectedDistrict(undefined);
		setSelectedWard(undefined);
		form.setFieldsValue({
			hoKhauThuongTru: {
				...form.getFieldValue('hoKhauThuongTru'),
				tinh_ThanhPho: value,
				quanHuyen: undefined,
				xaPhuong: undefined,
			},
		});
	};

	const handleDistrictChange = (value: string) => {
		setSelectedDistrict(value);
		setSelectedWard(undefined);
		form.setFieldsValue({
			hoKhauThuongTru: {
				...form.getFieldValue('hoKhauThuongTru'),
				quanHuyen: value,
				xaPhuong: undefined,
			},
		});
	};

	const handleWardChange = (value: string) => {
		setSelectedWard(value);
		form.setFieldsValue({
			hoKhauThuongTru: {
				...form.getFieldValue('hoKhauThuongTru'),
				xaPhuong: value,
			},
		});
	};

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
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
							<Form.Item label='Username' name='username' rules={[...rules.required]}>
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

					{!edit && (
						<Form.Item label='Mật khẩu' name='password' rules={[...rules.required, ...rules.password]}>
							<Input.Password placeholder='Nhập mật khẩu' />
						</Form.Item>
					)}

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
									{/* <DistrictsSelect
										provinceCode={selectedProvince}
										placeholder='Chọn quận/huyện'
										onChange={handleDistrictChange}
										value={selectedDistrict}
									/> */}
									<Input placeholder='Nhập số nhà, tên đường...' />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label='Xã/Phường' name={['hoKhauThuongTru', 'xaPhuong']} rules={[...rules.required]}>
									{/* <WardsSelect
										districtCode={selectedDistrict}
										placeholder='Chọn xã/phường'
										onChange={handleWardChange}
										value={selectedWard}
									/> */}
									<Input placeholder='Nhập số nhà, tên đường...' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Địa chỉ cụ thể' name={['hoKhauThuongTru', 'diaChi']} rules={[...rules.required]}>
									<Input placeholder='Nhập số nhà, tên đường...' />
								</Form.Item>
							</Col>
						</Row>
					</Card>

					<div className='form-actions'>
						<Button loading={submitting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'global.button.themmoi' })
								: intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			</Card>
		</div>
	);
};

export default UserForm;

import React, { useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Modal, message, Image } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import UploadFile from '@/components/Upload/UploadFile';
const { Option } = Select;
import { Space } from 'antd';

interface UserFormProps {
	title?: string;
	hideFooter?: boolean;
	// [key: string]: any;
}

const UserForm: React.FC<UserFormProps> = ({ title = 'người dùng', hideFooter, ...props }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm, postAvatar } = useModel('users');
	const [form] = Form.useForm();
	const intl = useIntl();

	// State để lưu giá trị địa chỉ đã chọn
	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();
	const [submitting, setSubmitting] = useState(false);
	const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// Reset form khi đóng modal hoặc khi mở form mới
	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedProvince(undefined);
			setSelectedDistrict(undefined);
			setSelectedWard(undefined);
		} else if (record?.id) {
			const formData = {
				...record,
				ngayCap: record.ngayCap ? moment(record.ngayCap) : undefined,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh) : undefined,
				hoKhauThuongTru: {
					tinh_ThanhPho: record.hoKhauThuongTru?.tinh_ThanhPho,
					quanHuyen: record.hoKhauThuongTru?.quanHuyen,
					xaPhuong: record.hoKhauThuongTru?.xaPhuong,
					diaChi: record.hoKhauThuongTru?.diaChi,
				},
			};
			form.setFieldsValue(formData);

			const province = record.hoKhauThuongTru?.tinh_ThanhPho;
			const district = record.hoKhauThuongTru?.quanHuyen;
			const ward = record.hoKhauThuongTru?.xaPhuong;

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
	}, [record?.id, visibleForm, form]);

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
				avatar: undefined
			};

			if (!edit && (!values.password || values.password.trim() === '')) {
				submitData.password = values.soCCCD;
			}

			let userId: string;
			if (edit) {
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				userId = record.id;
				await putModel(userId, submitData);
			} else {
				const response = await postModel(submitData);
				userId = response.id;
			}


			if (values.avatar) {
				await postAvatar(userId, values.avatar);
			}

			setVisibleForm(false);
			resetFieldsForm(form);
		} catch (error) {
			console.error('Form submission error:', error);
		} finally {
			setSubmitting(false);
		}
	};

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

	const handleResetPassword = async () => {
		if (!record?.soCCCD) {
			message.error('Không tìm thấy số CCCD để reset mật khẩu');
			return;
		}

		if (!record?.id) {
			message.error('Không tìm thấy ID người dùng');
			return;
		}

		try {
			const currentData = {
				...record,
				password: record.soCCCD,
				ngayCap: record.ngayCap ? moment(record.ngayCap).format('YYYY-MM-DD') : undefined,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh).format('YYYY-MM-DD') : undefined,
				hoKhauThuongTru: {
					tinh_ThanhPho: record.hoKhauThuongTru?.tinh_ThanhPho,
					quanHuyen: record.hoKhauThuongTru?.quanHuyen,
					xaPhuong: record.hoKhauThuongTru?.xaPhuong,
					diaChi: record.hoKhauThuongTru?.diaChi,
				},
			};

			await putModel(record.id, currentData);
			message.success('Reset mật khẩu thành công! Mật khẩu mới là số CCCD');
			setResetPasswordModalVisible(false);
		} catch (error) {
			console.error('Reset password error:', error);
			message.error('Reset mật khẩu thất bại');
		}
	};

	const handleChangePassword = async () => {
		if (!newPassword || newPassword.trim() === '') {
			message.error('Vui lòng nhập mật khẩu mới');
			return;
		}

		if (!record?.id) {
			message.error('Không tìm thấy ID người dùng');
			return;
		}

		try {
			const currentData = {
				...record,
				password: newPassword.trim(),
				ngayCap: record.ngayCap ? moment(record.ngayCap).format('YYYY-MM-DD') : undefined,
				ngaySinh: record.ngaySinh ? moment(record.ngaySinh).format('YYYY-MM-DD') : undefined,
				hoKhauThuongTru: {
					tinh_ThanhPho: record.hoKhauThuongTru?.tinh_ThanhPho,
					quanHuyen: record.hoKhauThuongTru?.quanHuyen,
					xaPhuong: record.hoKhauThuongTru?.xaPhuong,
					diaChi: record.hoKhauThuongTru?.diaChi,
				},
			};

			await putModel(record.id, currentData);
			message.success('Đổi mật khẩu thành công!');
			setResetPasswordModalVisible(false);
			setNewPassword('');
		} catch (error) {
			console.error('Change password error:', error);
			message.error('Đổi mật khẩu thất bại');
		}
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

	const handleMouseDown = () => {
		setShowPassword(true);
	};

	const handleMouseUp = () => {
		setShowPassword(false);
	};

	const handleMouseLeave = () => {
		setShowPassword(false);
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

					<Row gutter={16} style={{ marginBottom: 16 }}>
						<Col span={24}>
							<Form.Item label='Ảnh đại diện' name='avatar'>
								<UploadFile 
									isAvatar 
									maxFileSize={5} 
									buttonDescription="Tải lên ảnh đại diện"
								/>
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

					{!edit && (
						<Form.Item label='Mật khẩu' name='password' extra='Nếu để trống, mật khẩu mặc định sẽ là số CCCD'>
							<Input.Password placeholder='Nhập mật khẩu (tùy chọn)' />
						</Form.Item>
					)}

					{edit && (
						<Row gutter={16} style={{ marginBottom: 16 }}>
							<Col
								span={18}
								onMouseDown={handleMouseDown}
								onMouseUp={handleMouseUp}
								onMouseLeave={handleMouseLeave}
								style={{
									cursor: 'pointer',
									userSelect: 'none',
									padding: '2px 8px',
									backgroundColor: showPassword ? 'transparent' : '#f0f0f0',
									borderRadius: '4px',
									border: '1px dashed #d9d9d9',
									display: 'inline-block',
									minWidth: '100px',
									textAlign: 'center',
								}}
								title='Nhấn và giữ để xem mật khẩu'
							>
								{showPassword ? record?.password || '••••••••' : '••••••••'}
							</Col>
							<Col span={6}>
								<Button
									type='primary'
									ghost
									size='small'
									onClick={() => setResetPasswordModalVisible(true)}
									style={{ width: '100%' }}
								>
									Quản lý mật khẩu
								</Button>
							</Col>
						</Row>
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

					{!hideFooter && (
						<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
							<Space>
								<Button loading={submitting} htmlType='submit' type='primary'>
									{!edit
										? intl.formatMessage({ id: 'global.button.themmoi' })
										: intl.formatMessage({ id: 'global.button.luulai' })}
								</Button>
								<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
							</Space>
						</div>
					)}
				</Form>
			</Card>

			<Modal
				title='Quản lý mật khẩu'
				visible={resetPasswordModalVisible}
				onCancel={() => {
					setResetPasswordModalVisible(false);
					setNewPassword('');
				}}
				footer={null}
				width={500}
			>
				<div style={{ padding: '16px 0' }}>
					<div style={{ marginBottom: 24 }}>
						<h4 style={{ marginBottom: 8 }}>Reset mật khẩu về CCCD</h4>
						<p style={{ color: '#666', marginBottom: 16 }}>
							Mật khẩu sẽ được reset về số CCCD: <strong>{record?.soCCCD}</strong>
						</p>
						<Button type='primary' danger onClick={handleResetPassword} style={{ width: '100%' }}>
							Reset về CCCD
						</Button>
					</div>

					<div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
						<h4 style={{ marginBottom: 8 }}>Đổi mật khẩu mới</h4>
						<div style={{ marginBottom: 16 }}>
							<Input.Password
								placeholder='Nhập mật khẩu mới'
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								onPressEnter={handleChangePassword}
							/>
						</div>
						<Button
							type='primary'
							onClick={handleChangePassword}
							style={{ width: '100%' }}
							disabled={!newPassword.trim()}
						>
							Đổi mật khẩu
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default UserForm;

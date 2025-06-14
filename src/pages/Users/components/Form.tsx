import React, { useState } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Modal, message, Upload, Space, Avatar } from 'antd';
import { useIntl, useModel } from 'umi';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import axios from 'axios';
import { ipLocal } from '@/utils/ip';

const { Option } = Select;

interface UserFormProps {
	title?: string;
	hideFooter?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ title = 'người dùng', hideFooter }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('users');
	const [form] = Form.useForm();
	const intl = useIntl();

	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();
	const [submitting, setSubmitting] = useState(false);
	const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [fileList, setFileList] = useState<any[]>([]);

	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedProvince(undefined);
			setSelectedDistrict(undefined);
			setSelectedWard(undefined);
			setFileList([]);
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
			setFileList(
				record.avatar ? [{ uid: '-1', name: 'avatar', status: 'done', url: `${ipLocal}${record.avatar}` }] : [],
			);

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

	const handleUploadFile = async (file: File, userId: string) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('userId', userId || 'temp');
		formData.append('type', 'avatar');

		try {
			const response = await axios.post(`${ipLocal}/upload`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			return response.data.fileUrl;
		} catch (error) {
			console.error('Upload avatar error:', error);
			message.error('Tải ảnh avatar thất bại');
			throw error;
		}
	};

	const onFinish = async (values: any) => {
		try {
			setSubmitting(true);
			let avatarUrl = record?.avatar;

			if (fileList.length > 0 && fileList[0].originFileObj) {
				const file = fileList[0].originFileObj;
				avatarUrl = await handleUploadFile(file, record?.id || values.soCCCD);
			} else if (fileList.length === 0) {
				avatarUrl = undefined;
			}

			const submitData = {
				...values,
				avatar: avatarUrl,
				ngayCap: values.ngayCap?.format('YYYY-MM-DD'),
				ngaySinh: values.ngaySinh?.format('YYYY-MM-DD'),
				hoKhauThuongTru: {
					tinh_ThanhPho: values.hoKhauThuongTru?.tinh_ThanhPho,
					quanHuyen: values.hoKhauThuongTru?.quanHuyen,
					xaPhuong: values.hoKhauThuongTru?.xaPhuong,
					diaChi: values.hoKhauThuongTru?.diaChi,
				},
			};

			if (!edit && (!values.password || values.password.trim() === '')) {
				submitData.password = values.soCCCD;
			}

			if (edit) {
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				await putModel(record.id, submitData);
			} else {
				await postModel(submitData);
			}
			setVisibleForm(false);
			resetFieldsForm(form);
		} catch (error) {
			console.error('Form submission error:', error);
			message.error('Lưu thông tin thất bại');
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
				avatar: record.avatar,
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
				avatar: record.avatar,
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

	const handleUploadChange = ({ fileList }: { fileList: any[] }) => {
		setFileList(fileList);
	};

	const beforeUpload = (file: File) => {
		const isImage = file.type.startsWith('image/');
		if (!isImage) {
			message.error('Chỉ được tải lên file ảnh!');
			return false;
		}
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Ảnh phải nhỏ hơn 2MB!');
			return false;
		}
		return true;
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
							<Form.Item label='Avatar' name='avatar'>
								<Upload
									fileList={fileList}
									onChange={handleUploadChange}
									beforeUpload={beforeUpload}
									accept='image/*'
									listType='picture'
									maxCount={1}
								>
									<Button icon={<UploadOutlined />}>Tải lên ảnh avatar</Button>
								</Upload>
							</Form.Item>
						</Col>
						<Col span={12}>
							{fileList.length > 0 && (
								<Avatar
									size={64}
									src={fileList[0].url || (fileList[0].originFileObj && URL.createObjectURL(fileList[0].originFileObj))}
									icon={<UserOutlined />}
									style={{ marginBottom: 16 }}
								/>
							)}
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
								onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => handleMouseDown()}
								onMouseUp={(e: React.MouseEvent<HTMLDivElement>) => handleMouseUp()}
								onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => handleMouseLeave()}
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
										placeholder='Chọn xã phường'
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
						<h4 style={{ marginBottom: 8 }}>Reset password về CCCD</h4>
						<p style={{ color: 'inherit', marginBottom: 16 }}>
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

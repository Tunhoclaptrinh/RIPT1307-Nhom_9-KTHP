import React, { useState, useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Modal, message, Space } from 'antd';
import { useIntl } from 'umi';
import moment from 'moment';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import UserForm from '@/pages/Users/components/Form';
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
	const [form] = Form.useForm();
	const intl = useIntl();
	const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
	const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
	const [selectedWard, setSelectedWard] = useState<string | undefined>();
	const [submitting, setSubmitting] = useState(false);
	const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	// Reset form and address states when form visibility changes
	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
			setSelectedProvince(undefined);
			setSelectedDistrict(undefined);
			setSelectedWard(undefined);
		} else if (record?.id) {
			const formData = {
				...record,
				ho: record.hoTen?.split(' ').slice(0, -1).join(' ') || '',
				ten: record.hoTen?.split(' ').slice(-1)[0] || '',
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
				hoTen: `${values.ho} ${values.ten}`.trim(),
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
				await putModel?.(record.id, submitData);
			} else {
				await postModel?.(submitData);
			}
			setVisibleForm?.(false);
			form.resetFields();
		} catch (error) {
			console.error('Form submission error:', error);
			message.error('Lỗi khi gửi biểu mẫu');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		// <>
		// 	<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
		// 		<Row gutter={[16, 0]}>
		// 			<Col xs={24} sm={12}>
		// 				<Form.Item label='Họ' name='ho' rules={[{ required: true, message: 'Vui lòng nhập họ' }]}>
		// 					<Input placeholder='Nguyễn Thị Thảo' />
		// 				</Form.Item>
		// 			</Col>
		// 			<Col xs={24} sm={12}>
		// 				<Form.Item label='Tên' name='ten' rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
		// 					<Input placeholder='Linh' />
		// 				</Form.Item>
		// 			</Col>
		// 		</Row>

		// 		<Row gutter={16}>
		// 			<Col xs={24} sm={12}>
		// 				<Form.Item label='Username' name='username' rules={[{ required: true, message: 'Vui lòng nhập username' }]}>
		// 					<Input placeholder='thaolinh2006' />
		// 				</Form.Item>
		// 			</Col>
		// 			<Col xs={24} sm={12}>
		// 				<Form.Item
		// 					label='Email'
		// 					name='email'
		// 					rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
		// 				>
		// 					<Input placeholder='thaolinh@gmail.com' />
		// 				</Form.Item>
		// 			</Col>
		// 		</Row>

		// 		<Row gutter={16}>
		// 			<Col xs={24} sm={12} md={8}>
		// 				<Form.Item label='Số CCCD' name='soCCCD' rules={[{ required: true, message: 'Vui lòng nhập số CCCD' }]}>
		// 					<Input placeholder='036019018233' />
		// 				</Form.Item>
		// 			</Col>
		// 			<Col xs={24} sm={12} md={8}>
		// 				<Form.Item label='Ngày cấp' name='ngayCap' rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}>
		// 					<DatePicker style={{ width: '100%' }} placeholder='01/03/2024' format='DD/MM/YYYY' />
		// 				</Form.Item>
		// 			</Col>
		// 			<Col xs={24} sm={12} md={8}>
		// 				<Form.Item
		// 					label='Nơi cấp'
		// 					name='noiCap'
		// 					rules={[{ required: true, message: 'Vui lòng nhập nơi cấp CCCD' }]}
		// 				>
		// 					<Input placeholder='Cần Thơ' />
		// 				</Form.Item>
		// 			</Col>
		// 		</Row>

		// 		<Row gutter={16}>
		// 			<Col xs={24} sm={12}>
		// 				<Form.Item
		// 					label='Số điện thoại'
		// 					name='soDienThoai'
		// 					rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
		// 				>
		// 					<Input placeholder='0918876333' />
		// 				</Form.Item>
		// 			</Col>
		// 			<Col xs={24} sm={12}>
		// 				<Form.Item
		// 					label='Ngày sinh'
		// 					name='ngaySinh'
		// 					rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
		// 				>
		// 					<DatePicker style={{ width: '100%' }} placeholder='01/03/2006' format='DD/MM/YYYY' />
		// 				</Form.Item>
		// 			</Col>
		// 		</Row>

		// 		<Row gutter={16}>
		// 			<Col xs={24} sm={12} md={8}>
		// 				<Form.Item
		// 					label='Giới tính'
		// 					name='gioiTinh'
		// 					rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
		// 				>
		// 					<Select placeholder='Chọn giới tính'>
		// 						<Option value='Nam'>Nam</Option>
		// 						<Option value='Nữ'>Nữ</Option>
		// 						<Option value='Khác'>Khác</Option>
		// 					</Select>
		// 				</Form.Item>
		// 			</Col>
		// 			<Col xs={24} sm={12} md={8}>
		// 				<Form.Item label='Dân tộc' name='danToc'>
		// 					<Input placeholder='Kinh' />
		// 				</Form.Item>
		// 			</Col>
		// 			<Col xs={24} sm={12} md={8}>
		// 				<Form.Item label='Tôn giáo' name='tonGiao'>
		// 					<Input placeholder='Không' />
		// 				</Form.Item>
		// 			</Col>
		// 		</Row>

		// 		<Form.Item label='Nơi sinh' name='noiSinh'>
		// 			<Input placeholder='Thành phố Cần Thơ' />
		// 		</Form.Item>

		// 		{!edit && (
		// 			<Form.Item label='Mật khẩu' name='password' extra='Nếu để trống, mật khẩu mặc định sẽ là số CCCD'>
		// 				<Input.Password placeholder='Nhập mật khẩu (tùy chọn)' />
		// 			</Form.Item>
		// 		)}

		// 		<Card title='Hộ khẩu thường trú' style={{ marginTop: 16, border: 'none' }}>
		// 			<Row gutter={16}>
		// 				<Col xs={24} sm={12}>
		// 					<Form.Item
		// 						label='Tỉnh/Thành phố'
		// 						name={['hoKhauThuongTru', 'tinh_ThanhPho']}
		// 						rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
		// 					>
		// 						<ProvincesSelect
		// 							placeholder='Chọn tỉnh/thành phố'
		// 							onChange={handleProvinceChange}
		// 							value={selectedProvince}
		// 						/>
		// 					</Form.Item>
		// 				</Col>
		// 				<Col xs={24} sm={12}>
		// 					<Form.Item
		// 						label='Quận/Huyện'
		// 						name={['hoKhauThuongTru', 'quanHuyen']}
		// 						rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
		// 					>
		// 						<DistrictsSelect
		// 							provinceCode={selectedProvince}
		// 							placeholder='Chọn quận/huyện'
		// 							onChange={handleDistrictChange}
		// 							value={selectedDistrict}
		// 							disabled={!selectedProvince}
		// 						/>
		// 					</Form.Item>
		// 				</Col>
		// 			</Row>
		// 			<Row gutter={16}>
		// 				<Col xs={24} sm={12}>
		// 					<Form.Item
		// 						label='Xã/Phường'
		// 						name={['hoKhauThuongTru', 'xaPhuong']}
		// 						rules={[{ required: true, message: 'Vui lòng chọn xã/phường' }]}
		// 					>
		// 						<WardsSelect
		// 							districtCode={selectedDistrict}
		// 							placeholder='Chọn xã/phường'
		// 							onChange={handleWardChange}
		// 							value={selectedWard}
		// 							disabled={!selectedDistrict}
		// 						/>
		// 					</Form.Item>
		// 				</Col>
		// 				<Col xs={24} sm={12}>
		// 					<Form.Item
		// 						label='Địa chỉ cụ thể'
		// 						name={['hoKhauThuongTru', 'diaChi']}
		// 						rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
		// 					>
		// 						<Input placeholder='Số 1, đường Nguyễn Văn Cừ' />
		// 					</Form.Item>
		// 				</Col>
		// 			</Row>
		// 		</Card>
		// 	</Form>

		// 	<Modal
		// 		title='Quản lý mật khẩu'
		// 		visible={resetPasswordModalVisible}
		// 		onCancel={() => {
		// 			setResetPasswordModalVisible(false);
		// 			setNewPassword('');
		// 		}}
		// 		footer={null}
		// 		width={500}
		// 	>
		// 		<div style={{ padding: '16px 0' }}>
		// 			<div style={{ marginBottom: 24 }}>
		// 				<h4 style={{ marginBottom: 8 }}>Reset mật khẩu về CCCD</h4>
		// 				<p style={{ color: '#666', marginBottom: 16 }}>
		// 					Mật khẩu sẽ được reset về số CCCD: <strong>{record?.soCCCD}</strong>
		// 				</p>
		// 				<Button type='primary' danger onClick={handleResetPassword} style={{ width: '100%' }}>
		// 					Reset về CCCD
		// 				</Button>
		// 			</div>
		// 			<div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
		// 				<h4 style={{ marginBottom: 8 }}>Đổi mật khẩu mới</h4>
		// 				<div style={{ marginBottom: 16 }}>
		// 					<Input.Password
		// 						placeholder='Nhập mật khẩu mới'
		// 						value={newPassword}
		// 						onChange={(e) => setNewPassword(e.target.value)}
		// 						onPressEnter={handleChangePassword}
		// 					/>
		// 				</div>
		// 				<Button
		// 					type='primary'
		// 					onClick={handleChangePassword}
		// 					style={{ width: '100%' }}
		// 					disabled={!newPassword.trim()}
		// 				>
		// 					Đổi mật khẩu
		// 				</Button>
		// 			</div>
		// 		</div>
		// 	</Modal>
		// </>
		<UserForm hideFooter={true}></UserForm>
	);
};

export default PersonalInfo;

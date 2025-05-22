import React, { useEffect } from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import dayjs from 'dayjs';

const { Option } = Select;

interface UserFormProps {
	title?: string;
	[key: string]: any;
}

const UserForm: React.FC<UserFormProps> = ({ title = 'người dùng' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('users');

	const [form] = Form.useForm();
	const intl = useIntl();

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?.id) {
			const formData = {
				...record,
				ngayCap: record.ngayCap ? dayjs(record.ngayCap) : undefined,
				ngaySinh: record.ngaySinh ? dayjs(record.ngaySinh) : undefined,
			};
			form.setFieldsValue(formData);
		}
	}, [record?.id, visibleForm]);

	const onFinish = async (values: any) => {
		const submitData = {
			...values,
			ngayCap: values.ngayCap?.format('YYYY-MM-DD'),
			ngaySinh: values.ngaySinh?.format('YYYY-MM-DD'),
		};

		try {
			if (edit) {
				await putModel(record?.id ?? '', submitData);
			} else {
				await postModel(submitData);
			}
		} catch (error) {
			console.log(error);
		}
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

					<Card title='Hộ khẩu thường trú' style={{ marginTop: 16 }}>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label='Tỉnh/Thành phố'
									name={['hoKhauThuongTru', 'tinh_ThanhPho']}
									rules={[...rules.required]}
								>
									<Input placeholder='Nhập tỉnh/thành phố' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Quận/Huyện' name={['hoKhauThuongTru', 'quanHuyen']} rules={[...rules.required]}>
									<Input placeholder='Nhập quận/huyện' />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label='Xã/Phường' name={['hoKhauThuongTru', 'xaPhuong']} rules={[...rules.required]}>
									<Input placeholder='Nhập xã/phường' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Địa chỉ cụ thể' name={['hoKhauThuongTru', 'diaChi']} rules={[...rules.required]}>
									<Input placeholder='Nhập địa chỉ cụ thể' />
								</Form.Item>
							</Col>
						</Row>
					</Card>

					<div className='form-actions'>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
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

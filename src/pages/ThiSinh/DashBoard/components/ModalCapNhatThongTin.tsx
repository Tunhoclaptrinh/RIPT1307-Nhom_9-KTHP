import { Modal, Form, Input, Button, DatePicker, message } from 'antd';
import { useState } from 'react';
import moment from 'moment';

const UpdateInfoModal = ({ visible, onCancel, onSave }) => {
	const [form] = Form.useForm();

	const handleSave = async () => {
		try {
			const values = await form.validateFields();
			const formattedValues = {
				...values,
				ngaySinh: values.ngaySinh.format('DD/MM/YYYY'),
			};
			onSave(formattedValues);
			onCancel();
			message.success('Thông tin đã được cập nhật thành công!');
		} catch (error) {
			message.error('Vui lòng điền đầy đủ thông tin!');
		}
	};

	return (
		<Modal
			title='Cập nhật thông tin cá nhân'
			visible={visible}
			onCancel={onCancel}
			footer={[
				<Button key='cancel' onClick={onCancel}>
					Hủy
				</Button>,
				<Button key='save' type='primary' onClick={handleSave}>
					Lưu
				</Button>,
			]}
		>
			<Form form={form} layout='vertical'>
				<Form.Item name='hoTen' label='Họ tên' rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
					<Input placeholder='Nhập họ tên' />
				</Form.Item>
				<Form.Item name='ngaySinh' label='Ngày sinh' rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
					<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
				</Form.Item>
				<Form.Item
					name='soCCCD'
					label='Số CMND/CCCD'
					rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD!' }]}
				>
					<Input placeholder='Nhập số CMND/CCCD' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default UpdateInfoModal;

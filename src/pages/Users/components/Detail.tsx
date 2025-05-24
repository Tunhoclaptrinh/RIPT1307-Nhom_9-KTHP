import React from 'react';
import { Modal, Descriptions, Button } from 'antd';
import moment from 'moment';

interface ViewModalProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit: () => void;
	record?: User.IRecord;
	title?: string;
}

const UserDetail: React.FC<ViewModalProps> = ({ isVisible, onClose, onEdit, record, title = 'người dùng' }) => {
	if (!record) return null;

	return (
		<Modal
			title={`Chi tiết ${title}`}
			visible={isVisible}
			onCancel={onClose}
			footer={[
				<Button key='back' onClick={onClose}>
					Đóng
				</Button>,
				<Button key='edit' type='primary' onClick={onEdit}>
					Chỉnh sửa
				</Button>,
			]}
			width={800}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Họ và tên'>{`${record.ho} ${record.ten}`}</Descriptions.Item>
				<Descriptions.Item label='Username'>{record.username}</Descriptions.Item>
				<Descriptions.Item label='Email'>{record.email}</Descriptions.Item>
				<Descriptions.Item label='Số CCCD'>{record.soCCCD}</Descriptions.Item>
				<Descriptions.Item label='Ngày cấp'>
					{record.ngayCap ? moment(record.ngayCap).format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
				<Descriptions.Item label='Nơi cấp'>{record.noiCap}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{record.ngaySinh ? moment(record.ngaySinh).format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
				<Descriptions.Item label='Giới tính'>{record.gioiTinh}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ' span={2}>
					{record.hoKhauThuongTru?.diaChi},{record.hoKhauThuongTru?.xaPhuong},{record.hoKhauThuongTru?.quanHuyen},
					{record.hoKhauThuongTru?.tinh_ThanhPho}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default UserDetail;

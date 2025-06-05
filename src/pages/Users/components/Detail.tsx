import React, { useState } from 'react';
import { Modal, Descriptions, Button } from 'antd';
import moment from 'moment';

interface ViewModalProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit?: () => void;
	record?: User.IRecord;
	title?: string;
}

const UserDetail: React.FC<ViewModalProps> = ({ isVisible, onClose, onEdit, record, title = 'người dùng' }) => {
	const [showPassword, setShowPassword] = useState(false);

	if (!record) return null;

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
				<Descriptions.Item label='Họ và tên' span={2}>
					<strong style={{ fontSize: 20 }}>{`${record.ho} ${record.ten}`}</strong>
				</Descriptions.Item>
				<Descriptions.Item label='Username'>{record.username}</Descriptions.Item>
				<Descriptions.Item label='Email'>{record.email}</Descriptions.Item>
				<Descriptions.Item label='Số CCCD'>{record.soCCCD}</Descriptions.Item>
				<Descriptions.Item label='Mật khẩu'>
					<span
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
						{showPassword ? record.password || '••••••••' : '••••••••'}
					</span>
				</Descriptions.Item>
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

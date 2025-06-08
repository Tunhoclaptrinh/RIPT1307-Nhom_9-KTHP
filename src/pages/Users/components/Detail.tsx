import React, { useState, useEffect } from 'react';
import { Modal, Descriptions, Button } from 'antd';
import moment from 'moment';
import { useAddress } from '@/hooks/useAddress';

interface ViewModalProps {
	isVisible: boolean;
	onClose: () => void;
	onEdit?: () => void;
	record?: User.IRecord;
	title?: string;
	hideFooter?: boolean;
}

const UserDetail: React.FC<ViewModalProps> = ({
	isVisible,
	onClose,
	onEdit,
	record,
	title = 'người dùng',
	hideFooter,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const [addressName, setAddressName] = useState('');
	const [loadingAddress, setLoadingAddress] = useState(false);
	const { getAddressName } = useAddress();

	// Load địa chỉ khi record thay đổi hoặc modal mở
	useEffect(() => {
		const loadAddress = async () => {
			if (record?.hoKhauThuongTru && isVisible) {
				setLoadingAddress(true);
				try {
					const name = await getAddressName(record.hoKhauThuongTru);
					setAddressName(name || 'Không có thông tin địa chỉ');
				} catch (error) {
					console.error('Error loading address:', error);
					setAddressName('Lỗi khi tải địa chỉ');
				} finally {
					setLoadingAddress(false);
				}
			} else {
				setAddressName('');
			}
		};

		loadAddress();
	}, [record, isVisible, getAddressName]);

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
			footer={
				hideFooter
					? null
					: [
							<div key='footer' style={{ textAlign: 'center' }}>
								<Button key='back' onClick={onClose}>
									Đóng
								</Button>
								<Button key='edit' type='primary' onClick={onEdit} style={{ marginLeft: 8 }}>
									Chỉnh sửa
								</Button>
							</div>,
					  ]
			}
			width={800}
		>
			<Descriptions column={2} bordered>
				<Descriptions.Item label='Họ và tên' span={2}>
					<strong style={{ fontSize: 20 }}>{`${record.ho || ''} ${record.ten || ''}`}</strong>
				</Descriptions.Item>
				<Descriptions.Item label='Username'>{record.username || 'Chưa có'}</Descriptions.Item>
				<Descriptions.Item label='Email'>{record.email || 'Chưa có'}</Descriptions.Item>
				<Descriptions.Item label='Số CCCD'>{record.soCCCD || 'Chưa có'}</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{record.soDT || 'Chưa có'}</Descriptions.Item>
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
				<Descriptions.Item label='Ngày sinh'>
					{record.ngaySinh ? moment(record.ngaySinh).format('DD/MM/YYYY') : 'Chưa có'}
				</Descriptions.Item>
				<Descriptions.Item label='Giới tính'>{record.gioiTinh || 'Chưa có'}</Descriptions.Item>
				<Descriptions.Item label='Ngày cấp CCCD'>
					{record.ngayCap ? moment(record.ngayCap).format('DD/MM/YYYY') : 'Chưa có'}
				</Descriptions.Item>
				<Descriptions.Item label='Nơi cấp'>{record.noiCap || 'Chưa có'}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ' span={2}>
					{loadingAddress ? 'Đang tải địa chỉ...' : addressName || 'Chưa có thông tin địa chỉ'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default UserDetail;

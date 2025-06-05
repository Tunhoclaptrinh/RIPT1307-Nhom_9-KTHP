import React from 'react';
import { Modal, Descriptions, Button, Tag, Card, Row, Col, Avatar, Typography, Space } from 'antd';
import { UserOutlined, FileTextOutlined } from '@ant-design/icons';
import useUsers from '@/hooks/useUsers';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: ThongTinNguyenVong.IRecord;
	onEdit: () => void;
}

const { Title, Text } = Typography;

const ThongTinNguyenVongDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	const { getUserFullName, getUserInfo, getUserById } = useUsers();

	if (!record) return null;

	// Lấy thông tin thí sinh
	const userInfo = getUserInfo(record.userId);
	const fullName = getUserFullName(record.userId);
	const userDetail = getUserById(record.userId);

	return (
		<Modal
			title={
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<FileTextOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
					<span style={{ fontSize: '18px', fontWeight: 600 }}>Chi tiết nguyện vọng</span>
				</div>
			}
			visible={isVisible}
			onCancel={onClose}
			width={800}
			footer={[
				<div style={{ textAlign: 'center' }} key='footer'>
					<Space>
						<Button key='edit' type='primary' onClick={onEdit} size='large'>
							Chỉnh sửa
						</Button>
						<Button key='back' onClick={onClose} size='large'>
							Đóng
						</Button>
					</Space>
				</div>,
			]}
		>
			{/* Thông tin thí sinh */}
			<Card
				style={{
					marginBottom: '16px',
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					border: 'none',
				}}
			>
				<Row align='middle' gutter={16}>
					<Col>
						<Avatar size={64} src={userInfo?.avatar} icon={<UserOutlined />} style={{ border: '3px solid white' }} />
					</Col>
					<Col flex={1}>
						<Title level={4} style={{ color: 'white', margin: 0 }}>
							{fullName}
						</Title>
						<div style={{ color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
							<div>Mã thí sinh: {record.userId}</div>
							{userInfo?.username && <div>@{userInfo.username}</div>}
							{userDetail?.soCCCD && <div>CCCD: {userDetail.soCCCD}</div>}
						</div>
					</Col>
				</Row>
			</Card>

			{/* Thông tin nguyện vọng */}
			<Descriptions
				title={
					<>
						<FileTextOutlined /> Thông tin nguyện vọng
					</>
				}
				column={2}
				bordered
				labelStyle={{ fontWeight: 600, width: 180, backgroundColor: '#fafafa' }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='ID Nguyện vọng' span={2}>
					<Text code style={{ fontSize: '14px' }}>
						{record.id}
					</Text>
				</Descriptions.Item>
				<Descriptions.Item label='Tên nguyện vọng'>
					<strong>{record.ten}</strong>
				</Descriptions.Item>
				<Descriptions.Item label='Thứ tự NV'>
					<strong>{record.thuTuNV}</strong>
				</Descriptions.Item>
				<Descriptions.Item label='Phương thức xét tuyển' span={2}>
					{record.phuongThucXT && record.phuongThucXT.length > 0 ? (
						record.phuongThucXT.map((pt, idx) => (
							<Tag color='blue' key={idx} style={{ fontSize: '14px', padding: '4px 8px' }}>
								{pt}
							</Tag>
						))
					) : (
						<Tag color='default'>Không xác định</Tag>
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm chưa ưu tiên'>{record.diemChuaUT?.toFixed(1)}</Descriptions.Item>
				<Descriptions.Item label='Điểm có ưu tiên'>{record.diemCoUT?.toFixed(1)}</Descriptions.Item>
				<Descriptions.Item label='Điểm đối tượng ưu tiên'>
					{record.diemDoiTuongUT?.toFixed(1) || '0.0'}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm khu vực ưu tiên'>{record.diemKhuVucUT?.toFixed(1) || '0.0'}</Descriptions.Item>
				<Descriptions.Item label='Tổng điểm' span={2}>
					<span style={{ fontWeight: 600, color: '#389e0d' }}>{record.tongDiem?.toFixed(1)}</span>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ThongTinNguyenVongDetail;

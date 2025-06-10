import React from 'react';
import { Modal, Descriptions, Button, Tag, Card, Row, Col, Avatar, Space, Typography, message } from 'antd';
import { UserOutlined, FileTextOutlined, CopyOutlined } from '@ant-design/icons';
import { HoSo } from '@/services/HoSo/typing';
import useUsers from '@/hooks/useUsers';
import { ipLocal } from '@/utils/ip';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: HoSo.IRecord;
	onEdit: () => void;
}

const { Title, Text } = Typography;

const HoSoDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	const { getUserFullName, getUserInfo, getUserById } = useUsers();

	if (!record) return null;

	const { thongTinBoSung, thongTinLienHe } = record;

	// Lấy thông tin người sở hữu hồ sơ
	const userInfo = getUserInfo(record.thongTinCaNhanId);
	const fullName = getUserFullName(record.thongTinCaNhanId);
	const userDetail = getUserById(record.thongTinCaNhanId);

	// Hàm xử lý copy ID hồ sơ
	const handleCopyId = () => {
		navigator.clipboard.writeText(record.id).then(
			() => {
				message.success('Đã sao chép ID hồ sơ!');
			},
			() => {
				message.error('Sao chép ID hồ sơ thất bại!');
			},
		);
	};

	return (
		<Modal
			title={
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<FileTextOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
					<span style={{ fontSize: '18px', fontWeight: 600 }}>Chi tiết hồ sơ</span>
				</div>
			}
			visible={isVisible}
			onCancel={onClose}
			width={700}
			footer={[
				<div style={{ textAlign: 'center' }} key='footer'>
					<Button key='edit' type='primary' onClick={onEdit}>
						Chỉnh sửa
					</Button>
					<Button key='back' onClick={onClose} style={{ marginRight: 8 }}>
						Đóng
					</Button>
				</div>,
			]}
			bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
		>
			<Card type='inner'>
				{/* Thông tin người sở hữu */}
				<Card
					style={{
						marginBottom: '16px',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						border: 'none',
					}}
				>
					<Row align='middle' gutter={16}>
						<Col>
							<Avatar
								size={64}
								src={`${ipLocal}${userInfo?.avatar}`}
								icon={<UserOutlined />}
								style={{ border: '3px solid white' }}
							/>
						</Col>
						<Col flex={1}>
							<Title level={4} style={{ color: 'white', margin: 0 }}>
								{fullName}
							</Title>
							<div style={{ color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
								<div>Mã người dùng: {record.thongTinCaNhanId}</div>
								{userInfo?.username && <div>@{userInfo.username}</div>}
								{userDetail?.soCCCD && <div>CCCD: {userDetail.soCCCD}</div>}
							</div>
						</Col>
					</Row>
				</Card>

				{/* Thông tin hồ sơ */}
				<Descriptions
					title={
						<>
							<FileTextOutlined /> Thông tin hồ sơ
						</>
					}
					column={2}
					bordered
					labelStyle={{ fontWeight: 600, width: 180, backgroundColor: '#fafafa' }}
					contentStyle={{ whiteSpace: 'pre-wrap' }}
				>
					<Descriptions.Item label='ID hồ sơ' span={2}>
						<Space>
							<Text code style={{ fontSize: '14px' }}>
								{record.id}
							</Text>
							<Button
								type='link'
								icon={<CopyOutlined />}
								onClick={handleCopyId}
								style={{ padding: 0, color: '#1890ff' }}
								title='Sao chép ID'
							/>
						</Space>
					</Descriptions.Item>
					<Descriptions.Item label='Tình trạng'>
						<Tag color={record.tinhTrang === 'đã duyệt' ? 'green' : 'orange'}>{record.tinhTrang}</Tag>
					</Descriptions.Item>
					<Descriptions.Item label='ID thông tin cá nhân'>{record.thongTinCaNhanId}</Descriptions.Item>
					<Descriptions.Item label='Dân tộc'>{thongTinBoSung.danToc}</Descriptions.Item>
					<Descriptions.Item label='Quốc tịch'>{thongTinBoSung.quocTich}</Descriptions.Item>
					<Descriptions.Item label='Tôn giáo'>{thongTinBoSung.tonGiao}</Descriptions.Item>
					<Descriptions.Item label='Nơi sinh'>
						{thongTinBoSung.noiSinh.trongNuoc ? 'Trong nước' : 'Nước ngoài'} - {thongTinBoSung.noiSinh.tinh_ThanhPho}
					</Descriptions.Item>
					<Descriptions.Item label='Người liên hệ' span={2}>
						{thongTinLienHe.ten}
					</Descriptions.Item>
					<Descriptions.Item label='Địa chỉ liên hệ' span={2}>
						{`${thongTinLienHe.diaChi.diaChiCuThe}, ${thongTinLienHe.diaChi.xaPhuong}, ${thongTinLienHe.diaChi.quanHuyen}, ${thongTinLienHe.diaChi.tinh_ThanhPho}`}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</Modal>
	);
};

export default HoSoDetail;

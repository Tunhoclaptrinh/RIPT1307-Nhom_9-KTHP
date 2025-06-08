import React from 'react';
import { Modal, Descriptions, Tag, Button, Typography, Divider, Card, Row, Col, Avatar, Space, Image } from 'antd';
import { UserOutlined, BookOutlined, TrophyOutlined, FileTextOutlined } from '@ant-design/icons';
import useUsers from '@/hooks/useUsers';
import { useModel } from 'umi';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: DiemHocSinh.IRecord;
	onEdit: () => void;
}

const { Text, Title } = Typography;

const renderLoaiHanhKiem = (loai?: DiemHocSinh.LoaiHanhKiem) => {
	const colorMap: { [key in DiemHocSinh.LoaiHanhKiem]: string } = {
		tốt: 'green',
		khá: 'blue',
		'trung bình': 'orange',
		yếu: 'red',
		kém: 'volcano',
	};
	if (!loai || !colorMap[loai]) return <Tag color='default'>Không xác định</Tag>;
	return (
		<Tag color={colorMap[loai]} style={{ fontSize: '14px', padding: '4px 8px' }}>
			{loai.toUpperCase()}
		</Tag>
	);
};

const renderXepLoaiHocLuc = (xepLoai?: string) => {
	const colorMap: { [key: string]: string } = {
		giỏi: 'gold',
		khá: 'blue',
		'trung bình': 'orange',
		yếu: 'red',
		kém: 'volcano',
	};
	if (!xepLoai) return <Tag color='default'>Chưa xếp loại</Tag>;
	return (
		<Tag color={colorMap[xepLoai] || 'default'} style={{ fontSize: '14px', padding: '4px 8px' }}>
			{xepLoai.toUpperCase()}
		</Tag>
	);
};

const renderDiemMonHoc = (diemMonHoc: DiemHocSinh.IDiemMonHoc[]) => {
	if (!diemMonHoc || diemMonHoc.length === 0) {
		return (
			<div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
				<BookOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
				<div>Chưa có điểm môn học</div>
			</div>
		);
	}

	// Tính điểm trung bình
	const diemTrungBinh = (diemMonHoc.reduce((sum, item) => sum + item.diemTongKet, 0) / diemMonHoc.length).toFixed(1);

	return (
		<div>
			<div style={{ marginBottom: '16px', textAlign: 'center' }}>
				<Title level={5} style={{ color: '#1890ff', margin: 0 }}>
					<TrophyOutlined /> Điểm trung bình: {diemTrungBinh}/10
				</Title>
			</div>

			<Row gutter={[16, 16]}>
				{diemMonHoc.map((diem, idx) => (
					<Col span={12} key={idx}>
						<Card
							size='small'
							style={{
								borderLeft: `4px solid ${
									diem.diemTongKet >= 8
										? '#52c41a'
										: diem.diemTongKet >= 6.5
										? '#1890ff'
										: diem.diemTongKet >= 5
										? '#faad14'
										: '#ff4d4f'
								}`,
								boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
							}}
						>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<div>
									<Text strong style={{ fontSize: '15px' }}>
										{diem.mon}
									</Text>
									<br />
									<Text type='secondary' style={{ fontSize: '12px' }}>
										Học kỳ {diem.hocKy}
									</Text>
								</div>
								<div style={{ textAlign: 'right' }}>
									<Text
										style={{
											fontSize: '18px',
											fontWeight: 'bold',
											color:
												diem.diemTongKet >= 8
													? '#52c41a'
													: diem.diemTongKet >= 6.5
													? '#1890ff'
													: diem.diemTongKet >= 5
													? '#faad14'
													: '#ff4d4f',
										}}
									>
										{diem.diemTongKet}
									</Text>
									<Text type='secondary' style={{ fontSize: '12px' }}>
										/10
									</Text>
								</div>
							</div>
							{diem.ghiChu && (
								<div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
									<Text type='secondary' style={{ fontSize: '12px', fontStyle: 'italic' }}>
										{diem.ghiChu}
									</Text>
								</div>
							)}
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
};

const HocBaDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	const { getUserFullName, getUserInfo, getUserById } = useUsers();
	const { avatarUrl} = useModel('users');
	
	if (!record) return null;

	// Lấy thông tin học sinh
	const userInfo = getUserInfo(record.userId);
	const fullName = getUserFullName(record.userId);
	const userDetail = getUserById(record.userId);

	return (
		<Modal
			title={
				<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
					<BookOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
					<span style={{ fontSize: '18px', fontWeight: 600 }}>Chi tiết học bạ</span>
				</div>
			}
			visible={isVisible}
			onCancel={onClose}
			width={900}
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
			bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
		>
			<Card type='inner'>
				{' '}
				{/* Thông tin học sinh */}
				<Card
					style={{
						marginBottom: '16px',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						border: 'none',
					}}
				>
					<Row align='middle' gutter={16}>
						<Col>
							<Avatar size={64} src={avatarUrl} icon={<UserOutlined />} style={{ border: '3px solid white' }} />
						</Col>
						<Col flex={1}>
							<Title level={4} style={{ color: 'white', margin: 0 }}>
								{fullName}
							</Title>
							<div style={{ color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
								<div>Mã học sinh: {record.userId}</div>
								{userInfo?.username && <div>@{userInfo.username}</div>}
								{userDetail?.soCCCD && <div>CCCD: {userDetail.soCCCD}</div>}
							</div>
						</Col>
						<Col>
							<div style={{ textAlign: 'right', color: 'white' }}>
								{record.namHoc && <div>Năm học: {record.namHoc}</div>}
								{record.khoiLop && <div>Khối: {record.khoiLop}</div>}
							</div>
						</Col>
					</Row>
				</Card>
				{/* Thông tin cơ bản */}
				<Descriptions
					title={
						<>
							<FileTextOutlined /> Thông tin học bạ
						</>
					}
					column={2}
					bordered
					labelStyle={{ fontWeight: 600, width: 180, backgroundColor: '#fafafa' }}
					contentStyle={{ whiteSpace: 'pre-wrap' }}
					style={{ marginBottom: '24px' }}
				>
					<Descriptions.Item label='ID học bạ' span={2}>
						<Text code style={{ fontSize: '14px' }}>
							{record.id}
						</Text>
					</Descriptions.Item>

					<Descriptions.Item label='Loại hạnh kiểm'>{renderLoaiHanhKiem(record.loaiHanhKiem)}</Descriptions.Item>

					<Descriptions.Item label='Xếp loại học lực'>{renderXepLoaiHocLuc(record.xepLoaiHocLuc)}</Descriptions.Item>
				</Descriptions>
				{/* Điểm các môn học */}
				<Card
					title={
						<>
							<BookOutlined /> Điểm các môn học
						</>
					}
					style={{ marginBottom: '16px' }}
					headStyle={{ backgroundColor: '#f0f9ff', borderBottom: '2px solid #1890ff' }}
				>
					{renderDiemMonHoc(record.diemMonHoc)}
				</Card>
				{/* Nhận xét và đánh giá */}
				{(record.nhanXetGiaoVien || record.minhChung) && (
					<Card
						title={
							<>
								<FileTextOutlined /> Nhận xét và đánh giá
							</>
						}
						headStyle={{ backgroundColor: '#f6ffed', borderBottom: '2px solid #52c41a' }}
					>
						{record.nhanXetGiaoVien && (
							<div style={{ marginBottom: '16px' }}>
								<Title level={5} style={{ color: '#52c41a', marginBottom: '8px' }}>
									Nhận xét của giáo viên chủ nhiệm:
								</Title>
								<div
									style={{
										backgroundColor: '#f6ffed',
										padding: '12px',
										borderRadius: '6px',
										borderLeft: '4px solid #52c41a',
										fontStyle: 'italic',
									}}
								>
									{record.nhanXetGiaoVien}
								</div>
							</div>
						)}

						
							<div>
								<Title level={5} style={{ color: '#1890ff', marginBottom: '8px' }}>
									Minh chứng và thành tích:
								</Title>
								<div
									style={{
										backgroundColor: '#f0f9ff',
										padding: '12px',
										borderRadius: '6px',
										borderLeft: '4px solid #1890ff',
									}}
								>
									{record.minhChung ? (
									<Image
                                        width={100}
                                        src={record.minhChung} 
                                        alt={`Minh chứng cho ${record.minhChung}`}
                                    />
									) : (
                                    <Text type="secondary">Không có ảnh</Text>
                                )
									}
								</div>
							</div>
					</Card>
				)}
			</Card>
		</Modal>
	);
};

export default HocBaDetail;

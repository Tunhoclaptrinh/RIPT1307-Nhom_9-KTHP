import React from 'react';
import { Modal, Descriptions, Button, Tag, Typography, Divider, Avatar, Card, Row, Col } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons';
import useUsers from '@/hooks/useUsers';
import moment from 'moment';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: ThongTinHocTap.IRecord;
	onEdit: () => void;
}

const { Text, Title } = Typography;

const renderDiemTHPT = (diemArr: ThongTinHocTap.IDiemTHPT[] = []) => {
	if (!diemArr.length) return <Text type='secondary'>Chưa có điểm</Text>;
	return (
		<div>
			{diemArr.map((item, idx) => (
				<div key={idx}>
					<Text strong>{item.mon}</Text>: <Text type='success'>{item.diem}</Text>
				</div>
			))}
		</div>
	);
};

const renderMonTuDuy = (monArr: ThongTinHocTap.IDiemMonTuDuy[] = []) => {
	if (!monArr.length) return <Text type='secondary'>Chưa có điểm</Text>;
	return (
		<div>
			{monArr.map((item, idx) => (
				<div key={idx}>
					<Text strong>{item.ten}</Text>: <Text type='success'>{item.diem}</Text>
				</div>
			))}
		</div>
	);
};

const renderChungChi = (arr: ThongTinHocTap.IChungChi[] = []) => {
	if (!arr.length) return <Text type='secondary'>Không có</Text>;
	return (
		<div>
			{arr.map((cc, idx) => (
				<div key={idx} style={{ marginBottom: 4 }}>
					<Tag color='blue'>{cc.loaiCC}</Tag> - Kết quả: <Text>{cc.ketQua}</Text>
					{cc.minhChung && (
						<span>
							{' '}
							| Minh chứng: <Text type='secondary'>{cc.minhChung}</Text>
						</span>
					)}
				</div>
			))}
		</div>
	);
};

const ThongTinHocTapDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	const { getUserFullName, getUserInfo, getUserById } = useUsers();

	if (!record) return null;

	const { thongTinTHPT, hocBaTHPT, diemTHPT, diemDGTD, diemDGNL, giaiHSG, chungChi, userId } = record;

	// Lấy thông tin thí sinh
	const studentInfo = getUserById(userId);
	const studentFullName = getUserFullName(userId);
	const studentUserInfo = getUserInfo(userId);

	// Component hiển thị thông tin thí sinh
	const StudentInfoCard = () => {
		if (!studentInfo) {
			return (
				<Card
					title={
						<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
							<UserOutlined />
							<span>Thông tin thí sinh</span>
						</div>
					}
					style={{ marginBottom: 16 }}
				>
					<Text type='secondary'>Không tìm thấy thông tin thí sinh</Text>
				</Card>
			);
		}

		return (
			<Card
				title={
					<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
						<UserOutlined />
						<span>Thông tin thí sinh</span>
					</div>
				}
				style={{ marginBottom: 16 }}
			>
				<Row gutter={16}>
					<Col span={6}>
						<div style={{ textAlign: 'center' }}>
							<Avatar size={80} src={studentUserInfo?.avatar} icon={<UserOutlined />} style={{ marginBottom: 8 }} />
							<br />
							<Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
								{studentFullName}
							</Text>
							<br />
							<Text type='secondary'>@{studentUserInfo?.username}</Text>
						</div>
					</Col>
					<Col span={18}>
						<Descriptions column={2} size='small'>
							<Descriptions.Item
								label={
									<>
										<IdcardOutlined /> Mã thí sinh
									</>
								}
							>
								<Text copyable>{studentInfo.id}</Text>
							</Descriptions.Item>
							<Descriptions.Item
								label={
									<>
										<MailOutlined /> Email
									</>
								}
							>
								{studentInfo.email || <Text type='secondary'>Chưa có</Text>}
							</Descriptions.Item>
							<Descriptions.Item
								label={
									<>
										<PhoneOutlined /> Số điện thoại
									</>
								}
							>
								{studentInfo.soDT || <Text type='secondary'>Chưa có</Text>}
							</Descriptions.Item>
							<Descriptions.Item
								label={
									<>
										<IdcardOutlined /> Số CCCD
									</>
								}
							>
								{studentInfo.soCCCD || <Text type='secondary'>Chưa có</Text>}
							</Descriptions.Item>
							<Descriptions.Item
								label={
									<>
										<CalendarOutlined /> Ngày sinh
									</>
								}
							>
								{studentInfo.ngaySinh ? (
									moment(studentInfo.ngaySinh).format('DD/MM/YYYY')
								) : (
									<Text type='secondary'>Chưa có</Text>
								)}
							</Descriptions.Item>
							<Descriptions.Item label='Giới tính'>
								{studentInfo.gioiTinh === 'nam' ? (
									'Nam'
								) : studentInfo.gioiTinh === 'nu' ? (
									'Nữ'
								) : (
									<Text type='secondary'>Chưa có</Text>
								)}
							</Descriptions.Item>
							<Descriptions.Item label='Địa chỉ' span={2}>
								{studentInfo.diaChi || <Text type='secondary'>Chưa có</Text>}
							</Descriptions.Item>
							<Descriptions.Item label='Dân tộc'>
								{studentInfo.danToc || <Text type='secondary'>Chưa có</Text>}
							</Descriptions.Item>
							<Descriptions.Item label='Tôn giáo'>
								{studentInfo.tonGiao || <Text type='secondary'>Chưa có</Text>}
							</Descriptions.Item>
						</Descriptions>
					</Col>
				</Row>
			</Card>
		);
	};

	return (
		<Modal
			title={
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<UserOutlined />
					<span>Chi tiết thông tin học tập - {studentFullName}</span>
				</div>
			}
			visible={isVisible}
			onCancel={onClose}
			width={1000}
			footer={[
				<div style={{ textAlign: 'center' }} key='footer'>
					<Button key='edit' type='primary' onClick={onEdit}>
						Chỉnh sửa
					</Button>
					<Button key='back' onClick={onClose} style={{ marginLeft: 8 }}>
						Đóng
					</Button>
				</div>,
			]}
			style={{ top: 20 }}
			bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
		>
			{/* Thông tin thí sinh */}
			<StudentInfoCard />

			{/* Thông tin học tập */}
			<Card title='Thông tin học tập' type='inner'>
				<Descriptions
					column={2}
					bordered
					labelStyle={{ fontWeight: 600, width: 180 }}
					contentStyle={{ whiteSpace: 'pre-wrap' }}
				>
					<Descriptions.Item label='ID hồ sơ' span={2}>
						<Text copyable>{record.id}</Text>
					</Descriptions.Item>
					<Descriptions.Item label='Tỉnh/Thành phố'>{thongTinTHPT.tinh_ThanhPho}</Descriptions.Item>
					<Descriptions.Item label='Quận/Huyện'>{thongTinTHPT.quanHuyen}</Descriptions.Item>
					<Descriptions.Item label='Xã/Phường'>{thongTinTHPT.xaPhuong}</Descriptions.Item>
					<Descriptions.Item label='Địa chỉ'>{thongTinTHPT.diaChi}</Descriptions.Item>
					<Descriptions.Item label='Mã trường'>{thongTinTHPT.maTruong}</Descriptions.Item>
					<Descriptions.Item label='Mã tỉnh'>{thongTinTHPT.maTinh}</Descriptions.Item>
					<Descriptions.Item label='Đối tượng ưu tiên'>
						{thongTinTHPT.doiTuongUT ? (
							<Tag color={thongTinTHPT.doiTuongUT === 'hộ nghèo' ? 'volcano' : 'orange'}>{thongTinTHPT.doiTuongUT}</Tag>
						) : (
							<Text type='secondary'>Không</Text>
						)}
					</Descriptions.Item>
					<Descriptions.Item label='Khu vực ưu tiên'>
						{thongTinTHPT.khuVucUT ? (
							<Tag
								color={
									thongTinTHPT.khuVucUT === 'kv1'
										? 'red'
										: thongTinTHPT.khuVucUT === 'kv2'
										? 'orange'
										: thongTinTHPT.khuVucUT === 'kv2NT'
										? 'blue'
										: 'green'
								}
							>
								{thongTinTHPT.khuVucUT.toUpperCase()}
							</Tag>
						) : (
							<Text type='secondary'>Không</Text>
						)}
					</Descriptions.Item>
					<Descriptions.Item label='Đã tốt nghiệp'>
						<Tag color={thongTinTHPT.daTotNghiep ? 'green' : 'orange'}>
							{thongTinTHPT.daTotNghiep ? 'Đã tốt nghiệp' : 'Chưa tốt nghiệp'}
						</Tag>
					</Descriptions.Item>
					<Descriptions.Item label='Năm tốt nghiệp'>
						{thongTinTHPT.namTotNghiep || <Text type='secondary'>Không rõ</Text>}
					</Descriptions.Item>
					<Descriptions.Item label='Học bạ THPT (ID)' span={2}>
						{hocBaTHPT || <Text type='secondary'>Không có</Text>}
					</Descriptions.Item>
					<Descriptions.Item label='Điểm THPT' span={2}>
						{renderDiemTHPT(diemTHPT)}
					</Descriptions.Item>
					<Descriptions.Item label='Điểm đánh giá tư duy' span={2}>
						{renderMonTuDuy(diemDGTD?.mon)}
						<Divider style={{ margin: '8px 0' }} />
						Tổng điểm: <Text type='success'>{diemDGTD?.tongDiem ?? '0'}</Text>
					</Descriptions.Item>
					<Descriptions.Item label='Điểm đánh giá năng lực' span={2}>
						{renderMonTuDuy(diemDGNL?.mon)}
						<Divider style={{ margin: '8px 0' }} />
						Tổng điểm: <Text type='success'>{diemDGNL?.tongDiem ?? '0'}</Text>
					</Descriptions.Item>
					<Descriptions.Item label='Giải HSG' span={2}>
						{giaiHSG ? (
							<div>
								<Tag color='purple'>{giaiHSG.giaiHsgCap}</Tag> - <Text strong>{giaiHSG.mon}</Text> -
								<Tag color='gold' style={{ marginLeft: 4 }}>
									{giaiHSG.loaiGiai}
								</Tag>
								<br />
								<Text type='secondary'>Năm: {giaiHSG.nam}</Text> |
								<Text type='secondary'> Nơi cấp: {giaiHSG.noiCap}</Text>
								<br />
								<Text type='secondary'>Minh chứng: {giaiHSG.minhChung || 'Không có'}</Text>
							</div>
						) : (
							<Text type='secondary'>Không có</Text>
						)}
					</Descriptions.Item>
					<Descriptions.Item label='Chứng chỉ' span={2}>
						{renderChungChi(chungChi)}
					</Descriptions.Item>
				</Descriptions>
			</Card>
		</Modal>
	);
};

export default ThongTinHocTapDetail;

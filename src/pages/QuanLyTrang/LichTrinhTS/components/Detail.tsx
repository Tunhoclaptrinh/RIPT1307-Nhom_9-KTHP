import React from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';
import moment from 'moment';
import { CalendarOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: LichTrinhTS.IRecord;
	onEdit: () => void;
}

// Helper: Hiển thị icon + màu cho loại sự kiện
const renderType = (type: string) => {
	switch (type) {
		case 'dangky':
			return (
				<Tag icon={<CalendarOutlined />} color='blue'>
					Đăng ký
				</Tag>
			);
		case 'ketqua':
			return (
				<Tag icon={<CheckCircleOutlined />} color='green'>
					Kết quả
				</Tag>
			);
		case 'nhaphoc':
			return (
				<Tag icon={<UserOutlined />} color='purple'>
					Nhập học
				</Tag>
			);
		default:
			return <Tag>{type}</Tag>;
	}
};

// Helper: Trạng thái màu
const renderStatus = (status: string) => {
	switch (status) {
		case 'upcoming':
			return <Tag color='orange'>Sắp diễn ra</Tag>;
		case 'ongoing':
			return <Tag color='blue'>Đang diễn ra</Tag>;
		case 'completed':
			return <Tag color='green'>Đã hoàn thành</Tag>;
		default:
			return <Tag>{status}</Tag>;
	}
};

const LichTrinhTSDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết lịch trình tuyển sinh'
			visible={isVisible}
			onCancel={onClose}
			width={800}
			footer={[
				<div style={{ textAlign: 'center' }}>
					<Button key='edit' type='primary' onClick={onEdit}>
						Chỉnh sửa
					</Button>
					<Button key='back' onClick={onClose} style={{ marginRight: 8 }}>
						Đóng
					</Button>
				</div>,
			]}
		>
			<Descriptions
				column={2}
				bordered
				labelStyle={{ fontWeight: 600, width: 150 }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='Tiêu đề'>{record.title}</Descriptions.Item>
				<Descriptions.Item label='Loại sự kiện'>{renderType(record.type)}</Descriptions.Item>

				<Descriptions.Item label='Ngày bắt đầu'>{moment(record.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
				<Descriptions.Item label='Ngày kết thúc'>{moment(record.endDate).format('DD/MM/YYYY')}</Descriptions.Item>

				<Descriptions.Item label='Trạng thái'>{renderStatus(record.status)}</Descriptions.Item>
				<Descriptions.Item label=' '>{''}</Descriptions.Item>

				<Descriptions.Item label='Mô tả' span={2}>
					{record.description || 'Không có mô tả'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default LichTrinhTSDetail;

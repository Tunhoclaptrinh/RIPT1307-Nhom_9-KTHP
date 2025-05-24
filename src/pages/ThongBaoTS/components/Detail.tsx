import React from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: ThongBaoTS.IRecord;
	onEdit: () => void;
}

// Helper: Render trạng thái isActive
const renderStatus = (isActive: boolean) => {
	return isActive ? (
		<Tag icon={<CheckCircleOutlined />} color='green'>
			Bật
		</Tag>
	) : (
		<Tag icon={<CloseCircleOutlined />} color='red'>
			Tắt
		</Tag>
	);
};

const ThongBaoTSDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết thông báo tuyển sinh'
			visible={isVisible}
			onCancel={onClose}
			width={800}
			footer={[
				<div key='footer' style={{ textAlign: 'center' }}>
					<Button type='primary' onClick={onEdit} style={{ marginRight: 8 }}>
						Chỉnh sửa
					</Button>
					<Button onClick={onClose}>Đóng</Button>
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
				<Descriptions.Item label='Ngày đăng'>
					{moment(record.date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item label='Ưu tiên'>{record.priority}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>{renderStatus(record.isActive)}</Descriptions.Item>
				<Descriptions.Item label='Tóm tắt' span={2}>
					{record.summary || 'Không có tóm tắt'}
				</Descriptions.Item>
				<Descriptions.Item label='Nội dung' span={2}>
					{record.content || 'Không có nội dung'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ThongBaoTSDetail;

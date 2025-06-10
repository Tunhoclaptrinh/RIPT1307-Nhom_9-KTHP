import React from 'react';
import { Modal, Descriptions, Tag, Button, Typography } from 'antd';
import moment from 'moment';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Paragraph } = Typography;

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

// Helper: Sanitize HTML content (giả lập, có thể dùng DOMPurify nếu cần)
const sanitizeHtml = (html: string) => {
	// Trong môi trường production, nên dùng thư viện như DOMPurify để sanitize HTML
	// Ví dụ: import DOMPurify from 'dompurify'; return DOMPurify.sanitize(html);
	return html;
};

const ThongBaoTSDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết thông báo tuyển sinh'
			visible={isVisible}
			onCancel={onClose}
			width={1000}
			style={{ top: 20 }}
			bodyStyle={{ maxHeight: '80vh', overflowY: 'auto', padding: '24px' }}
			footer={
				<div style={{ textAlign: 'center' }}>
					<Button type='primary' onClick={onEdit} style={{ marginRight: 8 }}>
						Chỉnh sửa
					</Button>
					<Button onClick={onClose}>Đóng</Button>
				</div>
			}
		>
			<Descriptions
				column={{ xs: 1, sm: 2 }}
				bordered
				labelStyle={{ fontWeight: 600, width: 150, background: '#fafafa' }}
				contentStyle={{ whiteSpace: 'pre-wrap', padding: '12px' }}
			>
				<Descriptions.Item label='Tiêu đề'>{record.title || 'Không có tiêu đề'}</Descriptions.Item>
				<Descriptions.Item label='Ngày đăng'>
					{record.date ? moment(record.date, 'DD/MM/YYYY').format('DD/MM/YYYY') : 'N/A'}
				</Descriptions.Item>
				<Descriptions.Item label='Ưu tiên'>{record.priority || 'N/A'}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>{renderStatus(!!record.isActive)}</Descriptions.Item>
				<Descriptions.Item label='Tóm tắt' span={2}>
					{record.summary || 'Không có tóm tắt'}
				</Descriptions.Item>
				<Descriptions.Item label='Nội dung' span={2}>
					{record.content ? (
						<div
							style={{ lineHeight: '1.6', padding: '12px', background: '#fff', borderRadius: '4px' }}
							dangerouslySetInnerHTML={{ __html: sanitizeHtml(record.content) }}
						/>
					) : (
						<Paragraph type='secondary'>Không có nội dung</Paragraph>
					)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ThongBaoTSDetail;

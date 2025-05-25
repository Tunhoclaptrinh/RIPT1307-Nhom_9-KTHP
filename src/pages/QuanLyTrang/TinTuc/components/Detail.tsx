import React from 'react';
import { Modal, Descriptions, Tag, Button, Image } from 'antd';
import moment from 'moment';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: TinTuc.IRecord;
	onEdit: () => void;
}

// Helper: Hiển thị tag danh mục
const renderCategory = (category: string) => {
	const categoryMap: { [key: string]: { color: string; text: string } } = {
		'thi-cu': { color: 'blue', text: 'Thi cử' },
		'tuyen-sinh': { color: 'green', text: 'Tuyển sinh' },
		'hoc-tap': { color: 'orange', text: 'Học tập' },
		'su-kien': { color: 'purple', text: 'Sự kiện' },
	};
	const info = categoryMap[category] || { color: 'default', text: category };
	return <Tag color={info.color}>{info.text}</Tag>;
};

const TinTucDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết tin tức'
			visible={isVisible}
			onCancel={onClose}
			width={800}
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
		>
			<Descriptions
				column={2}
				bordered
				labelStyle={{ fontWeight: 600, width: 150 }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='Tiêu đề'>{record.title}</Descriptions.Item>
				<Descriptions.Item label='Danh mục'>{renderCategory(record.category)}</Descriptions.Item>

				<Descriptions.Item label='Tác giả'>{record.author}</Descriptions.Item>
				<Descriptions.Item label='Ngày đăng'>
					{moment(record.date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
				</Descriptions.Item>

				<Descriptions.Item label='Nổi bật'>
					<Tag color={record.featured ? 'gold' : 'default'}>{record.featured ? 'Nổi bật' : 'Thường'}</Tag>
				</Descriptions.Item>
				<Descriptions.Item label='Hình ảnh'>
					{record.imageUrl ? (
						<Image width={100} src={record.imageUrl} alt='Ảnh tin tức' style={{ borderRadius: 4 }} />
					) : (
						<Tag color='default'>Không có ảnh</Tag>
					)}
				</Descriptions.Item>

				<Descriptions.Item label='Tóm tắt' span={2}>
					{record.summary}
				</Descriptions.Item>
				<Descriptions.Item label='Nội dung' span={2}>
					{record.content}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default TinTucDetail;

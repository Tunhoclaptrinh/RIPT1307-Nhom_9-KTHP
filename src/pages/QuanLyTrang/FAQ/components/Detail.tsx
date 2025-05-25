import React from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: FAQ.IRecord;
	onEdit: () => void;
}

const renderCategory = (category: string) => {
	const categoryColors: { [key: string]: string } = {
		dangky: 'blue',
		hoso: 'green',
		thoihan: 'orange',
		ketqua: 'purple',
	};
	const categoryNames: { [key: string]: string } = {
		dangky: 'Đăng ký',
		hoso: 'Hồ sơ',
		thoihan: 'Thời hạn',
		ketqua: 'Kết quả',
	};
	return <Tag color={categoryColors[category] || 'default'}>{categoryNames[category] || category}</Tag>;
};

const renderStatus = (isActive: boolean) => (
	<Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hiển thị' : 'Ẩn'}</Tag>
);

const FAQDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết câu hỏi thường gặp'
			visible={isVisible}
			onCancel={onClose}
			width={700}
			footer={[
				<div style={{ textAlign: 'center' }} key='footer'>
					<Button key='edit' type='primary' icon={<EditOutlined />} onClick={onEdit}>
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
				<Descriptions.Item label='Câu hỏi' span={2}>
					{record.question}
				</Descriptions.Item>
				<Descriptions.Item label='Trả lời' span={2}>
					{record.answer}
				</Descriptions.Item>
				<Descriptions.Item label='Danh mục'>{renderCategory(record.category)}</Descriptions.Item>
				<Descriptions.Item label='Trạng thái'>{renderStatus(record.isActive)}</Descriptions.Item>
				<Descriptions.Item label='Lượt xem'>{record.viewCount}</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default FAQDetail;

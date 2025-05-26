import React from 'react';
import { Modal, Descriptions, Button } from 'antd';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: HeDaoTao.IRecord;
	onEdit: () => void;
}

const HeDaoTaoDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết hệ đào tạo'
			visible={isVisible}
			onCancel={onClose}
			width={500}
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
				column={1}
				bordered
				labelStyle={{ fontWeight: 600, width: 180 }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='Mã hệ đào tạo'>{record.id}</Descriptions.Item>
				<Descriptions.Item label='Tên hệ đào tạo'>{record.ten}</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default HeDaoTaoDetail;

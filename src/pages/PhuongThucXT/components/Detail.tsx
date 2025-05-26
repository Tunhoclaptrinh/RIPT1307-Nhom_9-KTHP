import React from 'react';
import { Modal, Descriptions, Button } from 'antd';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: PhuongThucXT.IRecord;
	onEdit: () => void;
}

const PhuongThucXTDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết phương thức xét tuyển'
			visible={isVisible}
			onCancel={onClose}
			width={600}
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
				labelStyle={{ fontWeight: 600, width: 180 }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='ID'>{record.id}</Descriptions.Item>
				<Descriptions.Item label='Tên phương thức'>{record.ten}</Descriptions.Item>
				<Descriptions.Item label='Nguyên tắc' span={2}>
					{record.nguyenTac || 'Không có'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default PhuongThucXTDetail;

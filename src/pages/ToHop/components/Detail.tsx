import React from 'react';
import { Modal, Descriptions, Button, Tag } from 'antd';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: ToHop.IRecord;
	onEdit: () => void;
}

const ToHopDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết tổ hợp xét tuyển'
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
				column={2}
				bordered
				labelStyle={{ fontWeight: 500, width: 120 }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='ID'>{record.id}</Descriptions.Item>
				<Descriptions.Item label='Các môn' span={2}>
					{record.monHoc && record.monHoc.length > 0
						? record.monHoc.map((m, idx) => <Tag key={idx}>{m}</Tag>)
						: 'Không có'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ToHopDetail;

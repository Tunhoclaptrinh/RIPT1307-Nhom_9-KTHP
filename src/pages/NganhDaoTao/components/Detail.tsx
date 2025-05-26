import React from 'react';
import { Modal, Descriptions, Button } from 'antd';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: NganhDaoTao.IRecord;
	onEdit: () => void;
}

const NganhDaoTaoDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết ngành đào tạo'
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
				<Descriptions.Item label='Mã ngành đào tạo' span={2}>
					{record.ma}
				</Descriptions.Item>
				<Descriptions.Item label='Tên ngành đào tạo' span={2}>
					{record.ten}
				</Descriptions.Item>
				<Descriptions.Item label='Tổ hợp xét tuyển' span={2}>
					{record.toHopXetTuyenId || 'Không có'}
				</Descriptions.Item>
				<Descriptions.Item label='Mô tả ngành đào tạo' span={2}>
					{record.moTa || 'Không có mô tả'}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default NganhDaoTaoDetail;

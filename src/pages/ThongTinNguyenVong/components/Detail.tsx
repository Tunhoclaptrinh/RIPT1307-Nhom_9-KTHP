import React from 'react';
import { Modal, Descriptions, Button, Tag } from 'antd';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: ThongTinNguyenVong.IRecord;
	onEdit: () => void;
}

const ThongTinNguyenVongDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết nguyện vọng'
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
				<Descriptions.Item label='ID'>{record.id}</Descriptions.Item>
				<Descriptions.Item label='Thứ tự NV'>{record.thuTuNV}</Descriptions.Item>
				<Descriptions.Item label='Tên nguyện vọng' span={2}>
					{record.ten}
				</Descriptions.Item>
				<Descriptions.Item label='Phương thức ID'>{record.phuongThucId}</Descriptions.Item>
				<Descriptions.Item label='Phương thức xét tuyển' span={2}>
					{record.phuongThucXT && record.phuongThucXT.length > 0
						? record.phuongThucXT.map((pt, idx) => (
								<Tag color='blue' key={idx}>
									{pt}
								</Tag>
						  ))
						: 'Không có'}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm chưa ưu tiên'>{record.diemChuaUT}</Descriptions.Item>
				<Descriptions.Item label='Điểm có ưu tiên'>{record.diemCoUT}</Descriptions.Item>
				<Descriptions.Item label='Điểm đối tượng ưu tiên'>{record.diemDoiTuongUT}</Descriptions.Item>
				<Descriptions.Item label='Điểm khu vực ưu tiên'>{record.diemKhuVucUT}</Descriptions.Item>
				<Descriptions.Item label='Tổng điểm' span={2}>
					<span style={{ fontWeight: 600, color: '#389e0d' }}>{record.tongDiem}</span>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ThongTinNguyenVongDetail;

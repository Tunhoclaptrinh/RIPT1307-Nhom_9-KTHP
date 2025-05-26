import React from 'react';
import { Modal, Descriptions, Tag, Button, Typography, Divider } from 'antd';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: DiemHocSinh.IRecord;
	onEdit: () => void;
}

const { Text } = Typography;

const renderLoaiHanhKiem = (loai?: DiemHocSinh.LoaiHanhKiem) => {
	const colorMap: { [key in DiemHocSinh.LoaiHanhKiem]: string } = {
		tốt: 'green',
		khá: 'blue',
		'trung bình': 'orange',
		yếu: 'red',
		kém: 'volcano',
	};
	if (!loai || !colorMap[loai]) return <Tag color='default'>Không xác định</Tag>;
	return <Tag color={colorMap[loai]}>{loai.toUpperCase()}</Tag>;
};

const renderDiemMonHoc = (diemMonHoc: DiemHocSinh.IDiemMonHoc[]) => {
	if (!diemMonHoc || diemMonHoc.length === 0) {
		return <Text type='secondary'>Chưa có điểm</Text>;
	}
	return (
		<div>
			{diemMonHoc.map((diem, idx) => (
				<div key={idx} style={{ marginBottom: 4 }}>
					<Text strong>{diem.mon}</Text> - HK{diem.hocKy}: <Text type='success'>{diem.diemTongKet}</Text>
				</div>
			))}
		</div>
	);
};

const HocBaDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết học bạ'
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
				<Descriptions.Item label='ID học bạ' span={2}>
					{record.id}
				</Descriptions.Item>
				<Descriptions.Item label='Loại hạnh kiểm' span={2}>
					{renderLoaiHanhKiem(record.loaiHanhKiem)}
				</Descriptions.Item>
				<Descriptions.Item label='Minh chứng' span={2}>
					{record.minhChung || 'Không có'}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm các môn học' span={2}>
					{renderDiemMonHoc(record.diemMonHoc)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default HocBaDetail;

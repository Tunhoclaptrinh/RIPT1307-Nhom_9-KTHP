import React from 'react';
import { Modal, Descriptions, Button, Tag } from 'antd';
import { HoSo } from '@/services/HoSo/typing';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: HoSo.IRecord;
	onEdit: () => void;
}

const HoSoDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	const { thongTinBoSung, thongTinLienHe } = record;

	return (
		<Modal
			title='Chi tiết hồ sơ'
			visible={isVisible}
			onCancel={onClose}
			width={700}
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
				<Descriptions.Item label='ID hồ sơ' span={2}>
					{record.id}
				</Descriptions.Item>
				<Descriptions.Item label='Tình trạng'>
					<Tag color={record.tinhTrang === 'đã duyệt' ? 'green' : 'orange'}>{record.tinhTrang} </Tag>
				</Descriptions.Item>
				<Descriptions.Item label='ID thông tin cá nhân'>{record.thongTinCaNhanId}</Descriptions.Item>
				<Descriptions.Item label='Dân tộc'>{thongTinBoSung.danToc}</Descriptions.Item>
				<Descriptions.Item label='Quốc tịch'>{thongTinBoSung.quocTich}</Descriptions.Item>
				<Descriptions.Item label='Tôn giáo'>{thongTinBoSung.tonGiao}</Descriptions.Item>
				<Descriptions.Item label='Nơi sinh'>
					{thongTinBoSung.noiSinh.trongNuoc ? 'Trong nước' : 'Nước ngoài'} - {thongTinBoSung.noiSinh.tinh_ThanhPho}
				</Descriptions.Item>
				<Descriptions.Item label='Người liên hệ' span={2}>
					{thongTinLienHe.ten}
				</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ liên hệ' span={2}>
					{`${thongTinLienHe.diaChi.diaChiCuThe}, ${thongTinLienHe.diaChi.xaPhuong}, ${thongTinLienHe.diaChi.quanHuyen}, ${thongTinLienHe.diaChi.tinh_ThanhPho}`}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default HoSoDetail;

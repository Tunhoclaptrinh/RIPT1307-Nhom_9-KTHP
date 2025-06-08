// components/CandidateModal.tsx
import React from 'react';
import { Modal, Table, Tag, Space, Button } from 'antd';
import { TrophyOutlined, CheckCircleOutlined, FileExcelOutlined } from '@ant-design/icons';

interface CandidateModalProps {
	visible: boolean;
	modalType: 'major' | 'status';
	selectedMajor: string | null;
	selectedStatus: string | null;
	stats: ThongKe.Stats;
	onClose: () => void;
	onExportMajor: (major: string) => void;
	onExportStatus: (status: string) => void;
}

const CandidateModal: React.FC<CandidateModalProps> = ({
	visible,
	modalType,
	selectedMajor,
	selectedStatus,
	stats,
	onClose,
	onExportMajor,
	onExportStatus,
}) => {
	const columns = [
		{
			title: 'STT',
			key: 'index',
			width: 60,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Họ tên',
			dataIndex: ['thongTinLienHe', 'ten'],
			key: 'ten',
			render: (text: string) => text || 'N/A',
		},
		{
			title: 'Điểm',
			key: 'diem',
			width: 80,
			render: (record: ThongKe.HoSo) => {
				const diem = record.ketQua?.diem ?? record.diem;
				return (
					<Tag color='blue' style={{ fontWeight: 'bold' }}>
						{typeof diem === 'number' ? diem.toFixed(1) : 'N/A'}
					</Tag>
				);
			},
			sorter: (a: ThongKe.HoSo, b: ThongKe.HoSo) => {
				const diemA = a.ketQua?.diem ?? a.diem ?? 0;
				const diemB = b.ketQua?.diem ?? b.diem ?? 0;
				return diemA - diemB;
			},
		},
		{
			title: 'Địa chỉ',
			key: 'diaChi',
			render: (record: ThongKe.HoSo) =>
				record.thongTinLienHe?.diaChi
					? `${record.thongTinLienHe.diaChi.diaChiCuThe || ''}, ${record.thongTinLienHe.diaChi.xaPhuong || ''}, ${
							record.thongTinLienHe.diaChi.quanHuyen || ''
					  }, ${record.thongTinLienHe.diaChi.tinh_ThanhPho || ''}`
					: 'N/A',
			ellipsis: true,
		},
		{
			title: 'Tình trạng',
			dataIndex: 'tinhTrang',
			key: 'tinhTrang',
			width: 120,
			render: (text: string) => (
				<Tag
					color={text === 'đã duyệt' ? 'green' : text === 'từ chối' ? 'red' : 'orange'}
					icon={text === 'đã duyệt' ? <CheckCircleOutlined /> : undefined}
				>
					{text || 'N/A'}
				</Tag>
			),
		},
	];

	const getDataSource = () => {
		if (modalType === 'major' && selectedMajor) {
			return stats.admittedByMajor[selectedMajor]?.candidates || [];
		}
		if (modalType === 'status' && selectedStatus) {
			return stats.profileStatus[selectedStatus]?.candidates || [];
		}
		return [];
	};

	const getCount = () => {
		if (modalType === 'major' && selectedMajor) {
			return stats.admittedByMajor[selectedMajor]?.count || 0;
		}
		if (modalType === 'status' && selectedStatus) {
			return stats.profileStatus[selectedStatus]?.count || 0;
		}
		return 0;
	};

	return (
		<Modal
			visible={visible}
			title={
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '40px' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						{modalType === 'major' ? (
							<>
								<TrophyOutlined style={{ color: '#faad14', fontSize: '20px' }} />
								<span style={{ fontSize: '18px', fontWeight: 600 }}>Danh sách thí sinh đậu ngành {selectedMajor}</span>
								<Tag color='blue' style={{ fontSize: '14px', padding: '4px 8px' }}>
									{getCount()} thí sinh
								</Tag>
							</>
						) : (
							<>
								<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
								<span style={{ fontSize: '18px', fontWeight: 600 }}>Danh sách hồ sơ trạng thái {selectedStatus}</span>
								<Tag color='blue' style={{ fontSize: '14px', padding: '4px 8px' }}>
									{getCount()} hồ sơ
								</Tag>
							</>
						)}
					</div>
				</div>
			}
			onCancel={onClose}
			footer={
				<Space>
					<Button onClick={onClose}>Đóng</Button>
					<Button
						type='primary'
						icon={<FileExcelOutlined />}
						onClick={() => {
							if (modalType === 'major' && selectedMajor) {
								onExportMajor(selectedMajor);
							} else if (modalType === 'status' && selectedStatus) {
								onExportStatus(selectedStatus);
							}
						}}
						style={{
							background: 'linear-gradient(135deg, #52c41a, #73d13d)',
							border: 'none',
						}}
					>
						Xuất Excel
					</Button>
				</Space>
			}
			width={900}
			style={{ top: 20 }}
		>
			<Table
				dataSource={getDataSource()}
				columns={columns}
				rowKey='id'
				pagination={{
					pageSize: 8,
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: (total, range) =>
						`${range[0]}-${range[1]} của ${total} ${modalType === 'major' ? 'thí sinh' : 'hồ sơ'}`,
					pageSizeOptions: ['5', '8', '10', '20'],
				}}
				scroll={{ x: 700 }}
				size='middle'
				style={{ marginTop: '16px' }}
			/>
		</Modal>
	);
};

export default CandidateModal;

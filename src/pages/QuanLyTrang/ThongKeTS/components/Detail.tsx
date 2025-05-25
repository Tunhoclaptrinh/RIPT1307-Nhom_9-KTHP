import React from 'react';
import { Modal, Descriptions, Button, Statistic } from 'antd';
import moment from 'moment';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: ThongKeTS.IRecord;
	onEdit: () => void;
}

const ThongKeTSDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	return (
		<Modal
			title='Chi tiết thống kê tuyển sinh'
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
				<Descriptions.Item label='Năm'>{record.year}</Descriptions.Item>
				<Descriptions.Item label='Cập nhật lần cuối'>
					{record.lastUpdated ? moment(record.lastUpdated, 'DD/MM/YYYY').format('DD/MM/YYYY') : ''}
				</Descriptions.Item>
				<Descriptions.Item label='Số trường ĐH'>
					<Statistic value={record.soTruongDaiHoc} valueStyle={{ fontSize: '16px', color: '#52c41a' }} />
				</Descriptions.Item>
				<Descriptions.Item label='Số ngành đào tạo'>
					<Statistic value={record.soNganhDaoTao} valueStyle={{ fontSize: '16px', color: '#1890ff' }} />
				</Descriptions.Item>
				<Descriptions.Item label='Số thí sinh đăng ký'>
					<Statistic value={record.soThiSinhDangKy} valueStyle={{ fontSize: '16px', color: '#722ed1' }} />
				</Descriptions.Item>
				<Descriptions.Item label='Tỷ lệ hồ sơ trực tuyến (%)'>
					<Statistic
						value={record.tyLeHoSoTrucTuyen}
						suffix='%'
						valueStyle={{
							fontSize: '16px',
							color:
								record.tyLeHoSoTrucTuyen >= 70 ? '#52c41a' : record.tyLeHoSoTrucTuyen >= 50 ? '#fa8c16' : '#ff4d4f',
						}}
					/>
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ThongKeTSDetail;

import { Modal, Descriptions, Tag, Button } from 'antd';
import moment from 'moment';

interface ChiTietKetQuaProps {
	visible: boolean;
	record: any;
	toHopData: Record<string, string>;
	nganhDaoTaoData: any[];
	onClose: () => void;
}

const ChiTietKetQua = ({ visible, record, toHopData, nganhDaoTaoData, onClose }: ChiTietKetQuaProps) => {
	const renderDetailContent = () => {
		if (!record) return null;

		const { user, hoSo, nguyenVong, thongTinHocTap } = record;
		const ketQua = hoSo?.ketQua;
		const nguyenVongTrungTuyen = nguyenVong?.find((nv: any) => nv.id === ketQua?.nguyenVongDo);

		return (
			<Descriptions bordered column={1} size='small'>
				<Descriptions.Item label='Mã hồ sơ'>{hoSo?.id || 'N/A'}</Descriptions.Item>
				<Descriptions.Item label='Họ và tên'>
					{`${user?.ho || ''} ${user?.ten || ''}`.trim() || 'N/A'}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>
					{user?.ngaySinh ? moment(user.ngaySinh).format('DD/MM/YYYY') : 'N/A'}
				</Descriptions.Item>
				<Descriptions.Item label='Số CCCD'>{user?.soCCCD || 'N/A'}</Descriptions.Item>
				<Descriptions.Item label='Email'>{user?.email || 'N/A'}</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{user?.soDT || 'N/A'}</Descriptions.Item>
				<Descriptions.Item label='Đối tượng ưu tiên'>
					{thongTinHocTap?.thongTinTHPT?.doiTuongUT || 'N/A'}
				</Descriptions.Item>
				<Descriptions.Item label='Khu vực ưu tiên'>{thongTinHocTap?.thongTinTHPT?.khuVucUT || 'N/A'}</Descriptions.Item>
				<Descriptions.Item label='Tổng điểm xét tuyển'>
					{ketQua?.diem ? Number(ketQua.diem).toFixed(1) : 'N/A'}
				</Descriptions.Item>
				<Descriptions.Item label='Kết quả xét tuyển'>
					{ketQua?.succes ? <Tag color='green'>Trúng tuyển</Tag> : <Tag color='red'>Không trúng tuyển</Tag>}
				</Descriptions.Item>
				<Descriptions.Item label='Nguyện vọng trúng tuyển'>
					{ketQua?.succes && nguyenVongTrungTuyen ? (
						<div>
							<div style={{ fontWeight: 'bold' }}>{nguyenVongTrungTuyen.ten}</div>
							<div>
								NV{nguyenVongTrungTuyen.thuTuNV} - {nguyenVongTrungTuyen.coSoDaoTao || 'Cơ sở chính'}
							</div>
						</div>
					) : (
						'N/A'
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Tổ hợp xét tuyển'>
					{ketQua?.succes && nguyenVongTrungTuyen
						? (() => {
								const maNganh = nguyenVongTrungTuyen.maNganh;
								const nganhDaoTao = nganhDaoTaoData.find((nganh) => nganh.ma === maNganh);
								return nganhDaoTao ? toHopData[nganhDaoTao.toHopXetTuyenId] || 'N/A' : 'N/A';
						  })()
						: nguyenVong?.[0]
						? (() => {
								const maNganh = nguyenVong[0].maNganh;
								const nganhDaoTao = nganhDaoTaoData.find((nganh) => nganh.ma === maNganh);
								return nganhDaoTao ? toHopData[nganhDaoTao.toHopXetTuyenId] || 'N/A' : 'N/A';
						  })()
						: 'N/A'}
				</Descriptions.Item>
				<Descriptions.Item label='Trường THPT'>{thongTinHocTap?.thongTinTHPT?.ten || 'N/A'}</Descriptions.Item>
				<Descriptions.Item label='Năm tốt nghiệp'>
					{thongTinHocTap?.thongTinTHPT?.namTotNghiep || 'N/A'}
				</Descriptions.Item>
			</Descriptions>
		);
	};

	return (
		<Modal
			title='Chi tiết hồ sơ xét tuyển'
			visible={visible}
			onCancel={onClose}
			footer={[
				<Button key='close' onClick={onClose}>
					Đóng
				</Button>,
			]}
			width={800}
		>
			{renderDetailContent()}
		</Modal>
	);
};

export default ChiTietKetQua;

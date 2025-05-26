import React from 'react';
import { Modal, Descriptions, Button, Tag, Typography, Divider } from 'antd';

interface Props {
	isVisible: boolean;
	onClose: () => void;
	record?: ThongTinHocTap.IRecord;
	onEdit: () => void;
}

const { Text } = Typography;

const renderDiemTHPT = (diemArr: ThongTinHocTap.IDiemTHPT[] = []) => {
	if (!diemArr.length) return <Text type='secondary'>Chưa có điểm</Text>;
	return (
		<div>
			{diemArr.map((item, idx) => (
				<div key={idx}>
					<Text strong>{item.mon}</Text>: <Text type='success'>{item.diem}</Text>
				</div>
			))}
		</div>
	);
};

const renderMonTuDuy = (monArr: ThongTinHocTap.IDiemMonTuDuy[] = []) => {
	if (!monArr.length) return <Text type='secondary'>Chưa có điểm</Text>;
	return (
		<div>
			{monArr.map((item, idx) => (
				<div key={idx}>
					<Text strong>{item.ten}</Text>: <Text type='success'>{item.diem}</Text>
				</div>
			))}
		</div>
	);
};

const renderChungChi = (arr: ThongTinHocTap.IChungChi[] = []) => {
	if (!arr.length) return <Text type='secondary'>Không có</Text>;
	return (
		<div>
			{arr.map((cc, idx) => (
				<div key={idx} style={{ marginBottom: 4 }}>
					<Tag color='blue'>{cc.loaiCC}</Tag> - Kết quả: <Text>{cc.ketQua}</Text>
					{cc.minhChung && (
						<span>
							{' '}
							| Minh chứng: <Text type='secondary'>{cc.minhChung}</Text>
						</span>
					)}
				</div>
			))}
		</div>
	);
};

const ThongTinHocTapDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
	if (!record) return null;

	const { thongTinTHPT, hocBaTHPT, diemTHPT, diemDGTD, diemDGNL, giaiHSG, chungChi } = record;

	return (
		<Modal
			title='Chi tiết thông tin học tập'
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
				labelStyle={{ fontWeight: 600, width: 180 }}
				contentStyle={{ whiteSpace: 'pre-wrap' }}
			>
				<Descriptions.Item label='ID hồ sơ' span={2}>
					{record.id}
				</Descriptions.Item>
				<Descriptions.Item label='Tỉnh/Thành phố'>{thongTinTHPT.tinh_ThanhPho}</Descriptions.Item>
				<Descriptions.Item label='Quận/Huyện'>{thongTinTHPT.quanHuyen}</Descriptions.Item>
				<Descriptions.Item label='Xã/Phường'>{thongTinTHPT.xaPhuong}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ'>{thongTinTHPT.diaChi}</Descriptions.Item>
				<Descriptions.Item label='Mã trường'>{thongTinTHPT.maTruong}</Descriptions.Item>
				<Descriptions.Item label='Mã tỉnh'>{thongTinTHPT.maTinh}</Descriptions.Item>
				<Descriptions.Item label='Đối tượng ưu tiên'>{thongTinTHPT.doiTuongUT || 'Không'}</Descriptions.Item>
				<Descriptions.Item label='Khu vực ưu tiên'>{thongTinTHPT.khuVucUT || 'Không'}</Descriptions.Item>
				<Descriptions.Item label='Đã tốt nghiệp'>{thongTinTHPT.daTotNghiep ? 'Có' : 'Chưa'}</Descriptions.Item>
				<Descriptions.Item label='Năm tốt nghiệp'>{thongTinTHPT.namTotNghiep || 'Không rõ'}</Descriptions.Item>
				<Descriptions.Item label='Học bạ THPT (ID)' span={2}>
					{hocBaTHPT || 'Không có'}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm THPT' span={2}>
					{renderDiemTHPT(diemTHPT)}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm đánh giá tư duy' span={2}>
					{renderMonTuDuy(diemDGTD?.mon)}
					<Divider style={{ margin: '8px 0' }} />
					Tổng điểm: <Text type='success'>{diemDGTD?.tongDiem ?? '0'}</Text>
				</Descriptions.Item>
				<Descriptions.Item label='Điểm đánh giá năng lực' span={2}>
					{renderMonTuDuy(diemDGNL?.mon)}
					<Divider style={{ margin: '8px 0' }} />
					Tổng điểm: <Text type='success'>{diemDGNL?.tongDiem ?? '0'}</Text>
				</Descriptions.Item>
				<Descriptions.Item label='Giải HSG' span={2}>
					{giaiHSG ? (
						<div>
							<Tag color='purple'>{giaiHSG.giaiHsgCap}</Tag> - <Text strong>{giaiHSG.mon}</Text> - {giaiHSG.loaiGiai}
							<br />
							Năm: {giaiHSG.nam} | Nơi cấp: {giaiHSG.noiCap}
							<br />
							Minh chứng: <Text type='secondary'>{giaiHSG.minhChung || 'Không có'}</Text>
						</div>
					) : (
						<Text type='secondary'>Không có</Text>
					)}
				</Descriptions.Item>
				<Descriptions.Item label='Chứng chỉ' span={2}>
					{renderChungChi(chungChi)}
				</Descriptions.Item>
			</Descriptions>
		</Modal>
	);
};

export default ThongTinHocTapDetail;

import { EyeOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { ipLocal } from '@/utils/ip';

import ChiTietKetQua from './ChiTiet';

interface KetQuaXetTuyenProps {
	searchResults: any[];
	loading: boolean;
}

const KetQuaXetTuyen = ({ searchResults, loading }: KetQuaXetTuyenProps) => {
	const [toHopData, setToHopData] = useState<Record<string, string>>({});
	const [nganhDaoTaoData, setNganhDaoTaoData] = useState<any[]>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<any>(null);

	// Lấy dữ liệu tổ hợp và ngành đào tạo từ API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const toHopResponse = await axios.get(`${ipLocal}/toHop`);
				const toHopMap: Record<string, string> = {};
				toHopResponse.data.forEach((item: any) => {
					toHopMap[item.id] = item.monHoc.join(', ');
				});
				setToHopData(toHopMap);

				const nganhResponse = await axios.get(`${ipLocal}/nganhDaoTao`);
				setNganhDaoTaoData(nganhResponse.data);
			} catch (error) {
				console.error('Lỗi khi lấy dữ liệu tổ hợp và ngành đào tạo:', error);
			}
		};

		fetchData();
	}, []);

	// Hàm mở modal và lưu thông tin hồ sơ được chọn
	const showDetailModal = (record: any) => {
		setSelectedRecord(record);
		setIsModalVisible(true);
	};

	// Hàm đóng modal
	const handleModalClose = () => {
		setIsModalVisible(false);
		setSelectedRecord(null);
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Mã hồ sơ',
			width: 140,
			render: (val: any, rec: any) => rec?.hoSo?.id || 'N/A',
		},
		{
			title: 'Họ và tên',
			width: 140,
			render: (val: any, rec: any) => {
				const ho = rec?.user?.ho || '';
				const ten = rec?.user?.ten || '';
				return ho || ten ? `${ho} ${ten}`.trim() : 'N/A';
			},
		},
		{
			title: 'Ngày sinh',
			width: 120,
			render: (val: any, rec: any) => (rec?.user?.ngaySinh ? moment(rec.user.ngaySinh).format('DD/MM/YYYY') : 'N/A'),
		},
		{
			title: 'Số CCCD',
			width: 140,
			render: (val: any, rec: any) => rec?.user?.soCCCD || 'N/A',
		},
		{
			title: 'Đối tượng ƯT',
			align: 'center',
			width: 120,
			render: (val: any, rec: any) => rec?.thongTinHocTap?.thongTinTHPT?.doiTuongUT || 'N/A',
		},
		{
			title: 'Tổng điểm XT',
			width: 120,
			align: 'center',
			render: (val: any, rec: any) => {
				const diem = rec?.hoSo?.ketQua?.diem;
				return diem ? Number(diem).toFixed(1) : 'N/A';
			},
		},
		{
			title: 'Tổ hợp',
			width: 140,
			render: (val: any, rec: any) => {
				const ketQua = rec?.hoSo?.ketQua;
				if (ketQua?.succes && ketQua?.nguyenVongDo) {
					const nguyenVongTrungTuyen = rec?.nguyenVong?.find((nv: any) => nv.id === ketQua.nguyenVongDo);

					if (nguyenVongTrungTuyen) {
						const maNganh = nguyenVongTrungTuyen.maNganh;
						const nganhDaoTao = nganhDaoTaoData.find((nganh) => nganh.ma === maNganh);
						return nganhDaoTao ? toHopData[nganhDaoTao.toHopXetTuyenId] || 'N/A' : 'N/A';
					}
				}

				const nguyenVongDauTien = rec?.nguyenVong?.[0];
				if (nguyenVongDauTien) {
					const maNganh = nguyenVongDauTien.maNganh;
					const nganhDaoTao = nganhDaoTaoData.find((nganh) => nganh.ma === maNganh);
					return nganhDaoTao ? toHopData[nganhDaoTao.toHopXetTuyenId] || 'N/A' : 'N/A';
				}

				return 'N/A';
			},
		},
		{
			title: 'Kết quả xét tuyển',
			width: 160,
			render: (val: any, rec: any) => {
				const ketQua = rec?.hoSo?.ketQua;
				if (ketQua?.succes) {
					return <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Trúng tuyển</span>;
				}
				return <span style={{ color: '#ff4d4f' }}>Không trúng tuyển</span>;
			},
		},
		{
			title: 'Nguyện vọng trúng tuyển',
			width: 200,
			render: (val: any, rec: any) => {
				const ketQua = rec?.hoSo?.ketQua;
				if (ketQua?.succes && ketQua?.nguyenVongDo) {
					const nguyenVongTrungTuyen = rec?.nguyenVong?.find((nv: any) => nv.id === ketQua.nguyenVongDo);

					if (nguyenVongTrungTuyen) {
						return (
							<div>
								<div style={{ fontWeight: 'bold', color: '#1890ff' }}>{nguyenVongTrungTuyen.ten}</div>
								<div style={{ fontSize: '12px', color: '#666' }}>
									NV{nguyenVongTrungTuyen.thuTuNV} - {nguyenVongTrungTuyen.coSoDaoTao || 'Cơ sở chính'}
								</div>
							</div>
						);
					} else {
						return <span style={{ color: '#ff4d4f' }}>Không tìm thấy thông tin nguyện vọng</span>;
					}
				}
				return <span style={{ color: '#999' }}>-</span>;
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			render: (val: any, rec: any) =>
				rec?.hoSo?.id ? (
					<ButtonExtend tooltip='Chi tiết' type='link' icon={<EyeOutlined />} onClick={() => showDetailModal(rec)} />
				) : (
					<span style={{ color: '#999' }}>(Chưa có thông tin)</span>
				),
		},
	];

	return (
		<>
			<Card title='Kết quả xét tuyển'>
				{searchResults.length === 0 && !loading ? (
					<div
						style={{
							textAlign: 'center',
							padding: '40px 20px',
							color: '#999',
						}}
					>
						<i style={{ color: '#ff4d4f', fontSize: '16px' }}>
							Không tồn tại thông tin phù hợp với điều kiện tìm kiếm!
						</i>
					</div>
				) : (
					<TableStaticData
						loading={loading}
						columns={columns}
						data={searchResults}
						hasTotal
						addStt
						otherProps={{
							scroll: { x: 1200, y: 380 },
							pagination: {
								pageSize: 10,
								showSizeChanger: true,
								showQuickJumper: true,
							},
						}}
					/>
				)}
			</Card>

			<ChiTietKetQua
				visible={isModalVisible}
				record={selectedRecord}
				toHopData={toHopData}
				nganhDaoTaoData={nganhDaoTaoData}
				onClose={handleModalClose}
			/>
		</>
	);
};

export default KetQuaXetTuyen;

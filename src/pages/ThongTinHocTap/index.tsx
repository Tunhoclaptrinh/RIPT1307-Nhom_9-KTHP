import React from 'react';
import { Popconfirm, Tag, Space, Typography } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ThongTinHocTapForm from './components/Form';

const { Text } = Typography;

const ThongTinHocTapPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('thongtinhoctap');

	// Helper function để render trạng thái tốt nghiệp
	const renderTrangThaiTotNghiep = (daTotNghiep: boolean, namTotNghiep: string | Date) => {
		if (daTotNghiep) {
			return (
				<div>
					<Tag color="green">Đã tốt nghiệp</Tag>
					<br />
					<Text type="secondary">Năm: {moment(namTotNghiep).format('YYYY')}</Text>
				</div>
			);
		}
		return <Tag color="orange">Chưa tốt nghiệp</Tag>;
	};

	// Helper function để render điểm THPT
	const renderDiemTHPT = (diemTHPT: ThongTinHocTap.IDiemTHPT[]) => {
		if (!diemTHPT || diemTHPT.length === 0) {
			return <Text type="secondary">Chưa có điểm</Text>;
		}
		
		return (
			<div>
				{diemTHPT.slice(0, 3).map((diem, index) => (
					<div key={index} style={{ marginBottom: 2 }}>
						<Text strong>{diem.mon}</Text>: <Text type="success">{diem.diem}</Text>
					</div>
				))}
				{diemTHPT.length > 3 && (
					<Text type="secondary">... và {diemTHPT.length - 3} môn khác</Text>
				)}
			</div>
		);
	};

	// Helper function để render khu vực ưu tiên
	const renderKhuVucUT = (khuVuc: ThongTinHocTap.KhuVucUT) => {
		const colorMap: Record<string, string> = {
			'kv1': 'red',
			'kv2': 'orange',
			'kv2NT': 'blue',
			'kv3': 'green'
		};
		return <Tag color={colorMap[khuVuc] || 'default'}>{khuVuc.toUpperCase()}</Tag>;
	};

	// Helper function để render đối tượng ưu tiên
	const renderDoiTuongUT = (doiTuong: ThongTinHocTap.DoiTuongUT) => {
		const colorMap: Record<string, string> = {
			'hộ nghèo': 'volcano',
			'cận nghèo': 'orange'
		};
		return <Tag color={colorMap[doiTuong] || 'default'}>{doiTuong}</Tag>;
	};

	const columns: IColumn<ThongTinHocTap.IRecord>[] = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: 100,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Thông tin trường THPT',
			width: 250,
			render: (_, record) => (
				<div>
					<div><Text strong>Mã trường:</Text> {record.thongTinTHPT.maTruong}</div>
					<div><Text strong>Tỉnh/TP:</Text> {record.thongTinTHPT.tinh_ThanhPho}</div>
					<div><Text strong>Quận/Huyện:</Text> {record.thongTinTHPT.quanHuyen}</div>
				</div>
			),
		},
		{
			title: 'Trạng thái tốt nghiệp',
			width: 150,
			filterType: 'select',
			filters: [
				{ text: 'Đã tốt nghiệp', value: true },
				{ text: 'Chưa tốt nghiệp', value: false },
			],
			render: (_, record) => renderTrangThaiTotNghiep(
				record.thongTinTHPT.daTotNghiep, 
				record.thongTinTHPT.namTotNghiep
			),
		},
		{
			title: 'Ưu tiên',
			width: 120,
			render: (_, record) => (
				<div>
					{renderKhuVucUT(record.thongTinTHPT.khuVucUT)}
					<br />
					{renderDoiTuongUT(record.thongTinTHPT.doiTuongUT)}
				</div>
			),
		},
		{
			title: 'Điểm THPT',
			dataIndex: 'diemTHPT',
			width: 200,
			render: (diemTHPT: ThongTinHocTap.IDiemTHPT[]) => renderDiemTHPT(diemTHPT),
		},
		{
			title: 'Điểm ĐGTD',
			width: 100,
			render: (_, record) => (
				<Text strong type="success">
					{record.diemDGTD?.tongDiem || 0}
				</Text>
			),
		},
		{
			title: 'Điểm ĐGNL',
			width: 100,
			render: (_, record) => (
				<Text strong type="success">
					{record.diemDGNL?.tongDiem || 0}
				</Text>
			),
		},
		{
			title: 'Giải HSG',
			width: 150,
			render: (_, record) => {
				if (!record.giaiHSG) {
					return <Text type="secondary">Không có</Text>;
				}
				return (
					<div>
						<Tag color="gold">{record.giaiHSG.loaiGiai}</Tag>
						<br />
						<Text type="secondary">{record.giaiHSG.mon} - {record.giaiHSG.giaiHsgCap}</Text>
					</div>
				);
			},
		},
		{
			title: 'Chứng chỉ',
			width: 120,
			render: (_, record) => {
				if (!record.chungChi || record.chungChi.length === 0) {
					return <Text type="secondary">Không có</Text>;
				}
				return (
					<div>
						{record.chungChi.slice(0, 2).map((cc, index) => (
							<Tag key={index} color="blue" style={{ marginBottom: 2 }}>
								{cc.loaiCC}
							</Tag>
						))}
						{record.chungChi.length > 2 && (
							<Text type="secondary">+{record.chungChi.length - 2}</Text>
						)}
					</div>
				);
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend 
						tooltip='Xem chi tiết' 
						onClick={() => handleView(record)} 
						type='link' 
						icon={<EyeOutlined />} 
					/>
					<ButtonExtend 
						tooltip='Chỉnh sửa' 
						onClick={() => handleEdit(record)} 
						type='link' 
						icon={<EditOutlined />} 
					/>
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa thông tin học tập này?'
						placement='topRight'
					>
						<ButtonExtend 
							tooltip='Xóa' 
							danger 
							type='link' 
							icon={<DeleteOutlined />} 
						/>
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<TableBase
				columns={columns}
				modelName='thongtinhoctap'
				title='Quản lý thông tin học tập'
				Form={ThongTinHocTapForm}
				widthDrawer={1000}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
		</div>
	);
};

export default ThongTinHocTapPage;
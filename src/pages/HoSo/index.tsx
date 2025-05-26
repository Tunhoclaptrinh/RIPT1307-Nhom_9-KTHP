import React, { useState } from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import Form from './components/Form'; // Assuming a Form component exists for HoSo
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { HoSo } from '@/services/HoSo/typing';
import HoSoDetail from './components/Detail';

const HoSoPage = () => {
	const { handleEdit, handleView, deleteModel } = useModel('hoso');
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<HoSo.IRecord | undefined>();

	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: HoSo.IRecord) => {
		setSelectedRecord(record);
		setExtendedModalVisible(true);
	};

	// Hàm đóng
	const onCloseExtendedModal = () => {
		setExtendedModalVisible(false);
	};

	// Hàm chuyển sang chế độ edit
	const onEditFromView = () => {
		setExtendedModalVisible(false);
		if (selectedRecord) {
			handleEdit(selectedRecord);
		}
	};

	const columns: IColumn<HoSo.IRecord>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'thongTinLienHe',
			width: 180,
			sortable: true,
			filterType: 'string',
			render: (thongTinLienHe) => thongTinLienHe?.ten || '',
		},
		{
			title: 'Dân tộc',
			dataIndex: 'thongTinBoSung',
			width: 120,
			sortable: true,
			filterType: 'string',
			render: (thongTinBoSung) => thongTinBoSung?.danToc || '',
		},
		{
			title: 'Quốc tịch',
			dataIndex: 'thongTinBoSung',
			width: 120,
			sortable: true,
			filterType: 'select',
			filterData: ['Việt Nam', 'Lào', 'Campuchia'],
			render: (thongTinBoSung) => (
				<Tag color={thongTinBoSung?.quocTich === 'Việt Nam' ? 'blue' : 'green'}>{thongTinBoSung?.quocTich || ''}</Tag>
			),
		},
		{
			title: 'Tôn giáo',
			dataIndex: 'thongTinBoSung',
			width: 120,
			sortable: true,
			filterType: 'select',
			filterData: ['không', 'Thiên Chúa giáo', 'Phật giáo'],
			render: (thongTinBoSung) => (
				<Tag color={thongTinBoSung?.tonGiao === 'không' ? 'gray' : 'blue'}>{thongTinBoSung?.tonGiao || ''}</Tag>
			),
		},
		{
			title: 'Nơi sinh',
			dataIndex: 'thongTinBoSung',
			width: 200,
			render: (thongTinBoSung) => {
				const noiSinh = thongTinBoSung?.noiSinh;
				if (!noiSinh) return '';
				return noiSinh.trongNuoc ? noiSinh.tinh_ThanhPho : 'Nước ngoài';
			},
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'thongTinLienHe',
			width: 250,
			render: (thongTinLienHe) => {
				const diaChi = thongTinLienHe?.diaChi;
				if (!diaChi) return '';
				return `${diaChi.diaChiCuThe}, ${diaChi.xaPhuong}, ${diaChi.quanHuyen}, ${diaChi.tinh_ThanhPho}`;
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
						onClick={() => onOpenExtendedModal(record)}
						type='link'
						icon={<EyeOutlined />}
					/>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa hồ sơ này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<TableBase
				columns={columns}
				modelName='hoso'
				title='Quản lý hồ sơ'
				Form={Form}
				widthDrawer={900}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			<HoSoDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default HoSoPage;

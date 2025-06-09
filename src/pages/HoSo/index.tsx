import React, { useState } from 'react';
import { Popconfirm, Tag, Space, message, Button, Popover } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import Form from './components/Form'; // Assuming a Form component exists for HoSo
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { HoSo } from '@/services/HoSo/typing';
import HoSoDetail from './components/Detail';
import { duyetHoSo, tuChoiHoSo } from '@/services/HoSo';
import AdmissionStepModal from '@/components/FormHoSo';

const HoSoPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('hoso');
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
			title: 'Tình trạng',
			dataIndex: 'tinhTrang',
			width: 100,
			render: (status) => <Tag color={status === 'đã duyệt' ? 'green' : 'orange'}>{status}</Tag>,
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
					<Popconfirm
						title={
							<Popover>
								<Button
									type='primary'
									size='small'
									icon={<CheckOutlined />}
									onClick={async (e) => {
										e.stopPropagation();
										try {
											await duyetHoSo(record);
											message.success('Duyệt hồ sơ thành công!');
											getModel();
										} catch (error) {
											message.error('Duyệt hồ sơ thất bại!');
										}
									}}
								>
									Duyệt
								</Button>
								<Button
									danger
									size='small'
									icon={<CloseOutlined />}
									onClick={async (e) => {
										e.stopPropagation();
										try {
											await tuChoiHoSo(record);
											message.success('Từ chối hồ sơ thành công!');
											getModel();
										} catch (error) {
											message.error('Từ chối hồ sơ thất bại!');
										}
									}}
								>
									Từ chối
								</Button>
							</Popover>
						}
						showCancel={false}
						placement='topLeft'
						onConfirm={() => {}}
					>
						<ButtonExtend
							tooltip='Duyệt'
							type='link'
							className='btn-success'
							icon={<CheckOutlined />}
							disabled={record.tinhTrang === 'đã duyệt'}
						/>
					</Popconfirm>

					<ButtonExtend
						tooltip='Chỉnh sửa'
						onClick={() => handleEdit(record)}
						type='link'
						icon={<EditOutlined />}
						disabled={record.tinhTrang === 'đã duyệt'}
					/>
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

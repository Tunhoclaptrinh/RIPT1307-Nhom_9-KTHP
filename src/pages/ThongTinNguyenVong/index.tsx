import React, { useState } from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import ThongTinNguyenVongForm from './components/Form';
import ThongTinNguyenVongDetail from './components/Detail';

const ThongTinNguyenVongPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('thongtinnguyenvong');
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<ThongTinNguyenVong.IRecord | undefined>();

	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: ThongTinNguyenVong.IRecord) => {
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

	const columns: IColumn<ThongTinNguyenVong.IRecord>[] = [
		{
			title: 'Thứ tự nguyện vọng',
			defaultSortOrder: 'ascend',
			dataIndex: 'thuTuNV',
			width: 150,
			sortable: true,
			filterType: 'number',
			align: 'center',
			sorter: (a, b) => a.thuTuNV - b.thuTuNV,
			render: (text) => <strong>{text}</strong>,
		},
		{
			title: 'Tên nguyện vọng',
			dataIndex: 'ten',
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (text) => <strong>{text}</strong>,
		},
		{
			title: 'Phương thức xét tuyển',
			dataIndex: 'phuongThucXT',
			width: 200,
			//   render: (phuongThucXT: string[]) => (
			//     <Space>
			//       {phuongThucXT?.map((item, index) => (
			//         <Tag key={index}>{item}</Tag>
			//       ))}
			//     </Space>
			//   ),
		},

		{
			title: 'Điểm chưa ưu tiên',
			dataIndex: 'diemChuaUT',
			width: 150,
			sortable: true,
			filterType: 'number',
		},
		{
			title: 'Điểm có ưu tiên',
			dataIndex: 'diemCoUT',
			width: 150,
			sortable: true,
			filterType: 'number',
		},
		{
			title: 'Điểm đối tượng ưu tiên',
			dataIndex: 'diemDoiTuongUT',
			width: 150,
			sortable: true,
			filterType: 'number',
		},
		{
			title: 'Điểm khu vực ưu tiên',
			dataIndex: 'diemKhuVucUT',
			width: 150,
			sortable: true,
			filterType: 'number',
		},
		{
			title: 'Tổng điểm',
			dataIndex: 'tongDiem',
			width: 150,
			sortable: true,
			filterType: 'number',
		},

		// {
		//   title: 'Thao tác',
		//   align: 'center',
		//   width: 150,
		//   fixed: 'right',
		//   render: (_, record) => (
		//     <Space>
		//       <ButtonExtend
		//         tooltip="Xem chi tiết"
		//         onClick={() => handleView(record)}
		//         type="link"
		//         icon={<EyeOutlined />}
		//       />
		//       <ButtonExtend
		//         tooltip="Chỉnh sửa"
		//         onClick={() => handleEdit(record)}
		//         type="link"
		//         icon={<EditOutlined />}
		//       />
		//       <Popconfirm
		//         onConfirm={() => deleteModel(record.id)}
		//         title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
		//         placement="topRight"
		//       >
		//         <ButtonExtend tooltip="Xóa" danger type="link" icon={<DeleteOutlined />} />
		//       </Popconfirm>
		//     </Space>
		//   ),
		// },
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
						title='Bạn có chắc chắn muốn xóa người dùng này?'
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
				addStt={false}
				modelName='thongtinnguyenvong'
				title='Quản lý thông tin nguyện vọng'
				Form={ThongTinNguyenVongForm}
				widthDrawer={700}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSortable //kéo thả sắp xếp=> siêu xem xets
				rowSelection
			/>
			<ThongTinNguyenVongDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default ThongTinNguyenVongPage;

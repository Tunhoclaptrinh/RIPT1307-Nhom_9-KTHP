import React, { useState } from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import PhuongThucXTForm from './components/Form';
import PhuongThucXTDetail from './components/Detail';
import { PhuongThucXT } from '@/services/PhuongThucXT/typing';

const PhuongThucXetTuyenPage = () => {
	const { 
		handleEdit, 
		handleView, 
		deleteModel, 
		getModel, 
		getExportFieldsModel, 
		postExportModel,
		// Import functions
		getImportHeaderModel,
		getImportTemplateModel,
		postValidateModel,
		postExecuteImpotModel,
		importHeaders
	} = useModel('phuongthucxt');
	
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<PhuongThucXT.IRecord | undefined>();

	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: PhuongThucXT.IRecord) => {
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

	const columns: IColumn<PhuongThucXT.IRecord>[] = [
		{
			title: 'Tên phương thức xét tuyển',
			dataIndex: 'ten',
			width: 180,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Nguyên tắc xét tuyển',
			dataIndex: 'nguyenTac',
			width: 180,
			sortable: true,
			filterType: 'string',
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
						title='Bạn có chắc chắn muốn hủy phương thức xét tuyển này?'
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
				modelName='phuongthucxt'
				title='Phương thức xét tuyển'
				Form={PhuongThucXTForm}
				widthDrawer={500}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
				// Cấu hình export
				exportConfig={{
					fileName: 'DanhSachPhuongThucXetTuyen.xlsx',
					getExportFieldsModel,
					postExportModel,
					maskCloseableForm: false
				}}
				// Cấu hình import
				importConfig={{
					titleTemplate: 'Template_PhuongThucXetTuyen.xlsx',
					maskCloseableForm: false,
					extendData: {
						// Có thể thêm dữ liệu mở rộng nếu cần
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString()
					}
				}}
			/>
			<PhuongThucXTDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default PhuongThucXetTuyenPage;
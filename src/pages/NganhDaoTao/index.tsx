import React, { useState } from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import NganhDaoTaoForm from './components/Form';
import NganhDaoTaoDetail from './components/Detail';
import { NganhDaoTao } from '@/services/NganhDaoTao/typing';

const NganhDaoTaoPage = () => {
	const {
		handleEdit,
		handleView,
		deleteModel,
		getModel,
		getExportFieldsModel,
		postExportModel,
		getImportHeaderModel,
		getImportTemplateModel,
		postValidateModel,
		postExecuteImpotModel,
		importHeaders,
	} = useModel('nganhdaotao');
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<NganhDaoTao.IRecord | undefined>();

	// Function to open extended modal
	const onOpenExtendedModal = (record: NganhDaoTao.IRecord) => {
		setSelectedRecord(record);
		setExtendedModalVisible(true);
	};

	// Function to close modal
	const onCloseExtendedModal = () => {
		setExtendedModalVisible(false);
	};

	// Function to switch to edit mode
	const onEditFromView = () => {
		setExtendedModalVisible(false);
		if (selectedRecord) {
			handleEdit(selectedRecord);
		}
	};

	const columns: IColumn<NganhDaoTao.IRecord>[] = [
		{
			title: 'Mã ngành đào tạo',
			dataIndex: 'ma',
			width: 180,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Tên ngành đào tạo',
			dataIndex: 'ten',
			width: 180,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Mô tả ngành đào tạo',
			dataIndex: 'moTa',
			width: 180,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Tổ hợp xét tuyển',
			dataIndex: 'toHopXetTuyenId',
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
						title='Bạn có chắc chắn muốn xóa ngành đào tạo này?'
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
				modelName='nganhdaotao'
				title='Quản lý ngành đào tạo'
				Form={NganhDaoTaoForm}
				widthDrawer={500}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
				// Export configuration
				exportConfig={{
					fileName: 'DanhSachNganhDaoTao.xlsx',
					getExportFieldsModel,
					postExportModel,
					maskCloseableForm: false,
				}}
				// Import configuration
				importConfig={{
					titleTemplate: 'Template_NganhDaoTao.xlsx',
					maskCloseableForm: false,
					extendData: {
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				}}
			/>
			<NganhDaoTaoDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default NganhDaoTaoPage;

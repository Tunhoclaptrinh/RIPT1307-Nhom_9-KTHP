import React, { useState } from 'react';
import { Popconfirm, Tag, Space, Button, Popover } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import HuongDanHSForm from './components/Form';
import HuongDanHSDetail from './components/Detail';
import { getNameFile } from '@/utils/utils';
import { ipLocal } from '@/utils/ip';

interface HuongDanHSRecord {
	id: string;
	title: string;
	category: string;
	date: string;
	summary: string;
	fileUrl: string;
	fileSize: string;
}

const HuongDanHSPage = () => {
	const { handleEdit, deleteModel } = useModel('quanlytrang.huongdanhs');
	const [detailModalVisible, setDetailModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<HuongDanHSRecord | undefined>();

	const onOpenDetailModal = (record: HuongDanHSRecord) => {
		setSelectedRecord(record);
		setDetailModalVisible(true);
	};

	const onCloseDetailModal = () => {
		setDetailModalVisible(false);
	};

	const onEditFromView = () => {
		setDetailModalVisible(false);
		if (selectedRecord) {
			handleEdit(selectedRecord);
		}
	};

	const columns: IColumn<HuongDanHSRecord>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 300,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Danh mục',
			dataIndex: 'category',
			width: 150,
			sortable: true,
			filterType: 'select',
			align: 'center',
		},
		{
			title: 'Tóm tắt',
			dataIndex: 'summary',
			width: 300,
			sortable: false,
			filterType: 'string',
			render: (summary: string) => (
				<Popover content={<div style={{ maxWidth: 360 }}>{summary}</div>} title='Tóm tắt' trigger='click'>
					<div
						style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '380px',
							cursor: 'pointer',
						}}
					>
						{summary}
					</div>
				</Popover>
			),
		},
		{
			title: 'Ngày đăng',
			dataIndex: 'date',
			align: 'center',
			width: 120,
			sortable: true,
			filterType: 'date',
			render: (date: string) => moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
		},
		{
			title: 'Tệp hướng dẫn',
			dataIndex: 'fileUrl',
			width: 200,
			sortable: false,
			render: (fileUrl: string) =>
				fileUrl ? (
					<a href={`${ipLocal}${fileUrl}`} target='_blank' rel='noopener noreferrer'>
						{getNameFile(fileUrl)}
					</a>
				) : (
					'N/A'
				),
		},
		{
			title: 'Dung lượng',
			dataIndex: 'fileSize',
			width: 100,
			sortable: true,
			align: 'center',
			render: (fileSize: string) => {
				const bytes = parseInt(fileSize, 10);
				if (isNaN(bytes)) return 'N/A';
				if (bytes < 1024) return `${bytes} B`;
				if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
				return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
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
						onClick={() => onOpenDetailModal(record)}
						type='link'
						icon={<EyeOutlined />}
					/>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa hướng dẫn này?'
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
				modelName='quanlytrang.huongdanhs'
				title='Hướng dẫn hồ sơ'
				Form={HuongDanHSForm}
				widthDrawer={800}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			<HuongDanHSDetail
				isVisible={detailModalVisible}
				onClose={onCloseDetailModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default HuongDanHSPage;

import React, { useState } from 'react';
import { Popconfirm, Tag, Space, Badge, Popover } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ThongBaoTSForm from './components/Form';
import ThongBaoTSDetail from './components/Detail';

const ThongBaoTSPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('quanlytrang.thongbaots');
	const [detailModalVisible, setDetailModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<ThongBaoTS.IRecord | undefined>();

	const onOpenDetailModal = (record: ThongBaoTS.IRecord) => {
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

	const columns: IColumn<ThongBaoTS.IRecord>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 300,
			sortable: true,
			filterType: 'string',
			render: (title: string) => <div style={{ fontWeight: 500 }}>{title}</div>,
		},
		{
			title: 'Tóm tắt',
			dataIndex: 'summary',
			width: 400,
			sortable: false,
			filterType: 'string',
			render: (summary: string) => (
				<Popover content={<div style={{ maxWidth: 400 }}>{summary}</div>} title='Chi tiết mô tả' trigger='click'>
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
			width: 120,
			sortable: true,
			filterType: 'date',
			align: 'center',
			render: (date: string) => moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
		},
		{
			title: 'Ưu tiên',
			dataIndex: 'priority',
			width: 100,
			sortable: true,
			filterType: 'number',
			align: 'center',
			render: (priority: number) => (
				<Badge count={priority} color={priority === 1 ? 'red' : priority === 2 ? 'orange' : 'blue'} showZero />
			),
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isActive',
			width: 120,
			sortable: true,
			filterType: 'select',
			align: 'center',
			render: (isActive: boolean) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hiển thị' : 'Ẩn'}</Tag>,
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
						title='Bạn có chắc chắn muốn xóa thông báo này?'
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
				modelName='quanlytrang.thongbaots'
				title='Thông báo tuyển sinh'
				Form={ThongBaoTSForm}
				widthDrawer={800}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			<ThongBaoTSDetail
				isVisible={detailModalVisible}
				onClose={onCloseDetailModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default ThongBaoTSPage;

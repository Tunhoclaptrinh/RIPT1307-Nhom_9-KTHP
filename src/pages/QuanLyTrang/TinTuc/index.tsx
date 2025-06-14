import React, { useState } from 'react';
import { Popconfirm, Tag, Space, Image, Popover } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import TinTucForm from './components/Form';
import TinTucDetail from './components/Detail';

const getCategoryColor = (category: string) => {
	switch (category) {
		case 'thi-cu':
			return 'blue';
		case 'tuyen-sinh':
			return 'green';
		case 'hoc-tap':
			return 'orange';
		case 'su-kien':
			return 'purple';
		default:
			return 'default';
	}
};

const getCategoryText = (category: string) => {
	switch (category) {
		case 'thi-cu':
			return 'Thi cử';
		case 'tuyen-sinh':
			return 'Tuyển sinh';
		case 'hoc-tap':
			return 'Học tập';
		case 'su-kien':
			return 'Sự kiện';
		default:
			return category;
	}
};

const TinTucPage = () => {
	const { handleEdit, handleView, deleteModel } = useModel('quanlytrang.tintuc');
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<TinTuc.IRecord | undefined>();

	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: TinTuc.IRecord) => {
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

	const columns: IColumn<TinTuc.IRecord>[] = [
		{
			title: 'Hình ảnh',
			dataIndex: 'imageUrl',
			width: 80,
			sortable: false,
			filterType: 'string',
			align: 'center',
			render: (imageUrl: string) => (
				<Image
					width={50}
					height={40}
					src={imageUrl}
					fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN'
					style={{ objectFit: 'cover', borderRadius: 4 }}
				/>
			),
		},
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
			width: 320,
			sortable: false,
			filterType: 'string',
			render: (summary: string) => (
				<Popover content={<div style={{ maxWidth: 400 }}>{summary}</div>} title='Tóm tắt' trigger='click'>
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
			title: 'Danh mục',
			dataIndex: 'category',
			width: 120,
			sortable: true,
			filterType: 'select',
			align: 'center',
			render: (category: string) => <Tag color={getCategoryColor(category)}>{getCategoryText(category)}</Tag>,
		},
		{
			title: 'Tác giả',
			dataIndex: 'author',
			width: 120,
			sortable: true,
			filterType: 'string',
			render: (author: string) => <div style={{ fontStyle: 'italic' }}>{author}</div>,
		},
		{
			title: 'Ngày đăng',
			dataIndex: 'date',
			width: 120,
			sortable: true,
			filterType: 'date',
			render: (date: string) => moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
		},
		{
			title: 'Nổi bật',
			dataIndex: 'featured',
			width: 100,
			sortable: true,
			filterType: 'select',
			align: 'center',
			render: (featured: boolean) => <Tag color={featured ? 'gold' : 'default'}>{featured ? 'Nổi bật' : 'Thường'}</Tag>,
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
						title='Bạn có chắc chắn muốn xóa phần này?'
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
				modelName='quanlytrang.tintuc'
				title='Quản lý tin tức'
				Form={TinTucForm}
				widthDrawer={650}
				// buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			<TinTucDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default TinTucPage;

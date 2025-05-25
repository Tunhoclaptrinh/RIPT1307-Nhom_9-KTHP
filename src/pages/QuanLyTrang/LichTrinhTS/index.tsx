import React, { useState } from 'react';
import { Popconfirm, Tag, Space, Badge, Popover } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	CalendarOutlined,
	CheckCircleOutlined,
	UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import LichTrinhTSForm from './components/Form';
import LichTrinhTSDetail from './components/Detail';

const LichTrinhTSPage = () => {
	const { handleEdit, handleView, deleteModel } = useModel('quanlytrang.lichtrinhts');
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<LichTrinhTS.IRecord | undefined>();

	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: LichTrinhTS.IRecord) => {
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

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'dangky':
				return 'blue';
			case 'ketqua':
				return 'green';
			case 'nhaphoc':
				return 'purple';
			default:
				return 'default';
		}
	};

	const getTypeText = (type: string) => {
		switch (type) {
			case 'dangky':
				return 'Đăng ký';
			case 'ketqua':
				return 'Kết quả';
			case 'nhaphoc':
				return 'Nhập học';
			default:
				return type;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'upcoming':
				return 'orange';
			case 'ongoing':
				return 'blue';
			case 'completed':
				return 'green';
			default:
				return 'default';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'upcoming':
				return 'Sắp diễn ra';
			case 'ongoing':
				return 'Đang diễn ra';
			case 'completed':
				return 'Đã hoàn thành';
			default:
				return status;
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'dangky':
				return <CalendarOutlined />;
			case 'ketqua':
				return <CheckCircleOutlined />;
			case 'nhaphoc':
				return <UserOutlined />;
			default:
				return <CalendarOutlined />;
		}
	};

	const columns: IColumn<LichTrinhTS.IRecord>[] = [
		{
			title: 'Tiêu đề',
			dataIndex: 'title',
			width: 300,
			sortable: true,
			filterType: 'string',
			render: (title: string, record) => (
				<div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
					{getTypeIcon(record.type)}
					{title}
				</div>
			),
		},
		{
			title: 'Mô tả',
			dataIndex: 'description',
			width: 380,
			sortable: false,
			filterType: 'string',
			render: (description: string) => (
				<Popover content={<div style={{ maxWidth: 360 }}>{description}</div>} title='Chi tiết mô tả' trigger='click'>
					<div
						style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '380px',
							cursor: 'pointer',
						}}
					>
						{description}
					</div>
				</Popover>
			),
		},
		{
			title: 'Ngày bắt đầu',
			dataIndex: 'startDate',
			width: 120,
			sortable: true,
			filterType: 'date',
			render: (startDate: string) => moment(startDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
		},
		{
			title: 'Ngày kết thúc',
			dataIndex: 'endDate',
			width: 120,
			sortable: true,
			filterType: 'date',
			render: (endDate: string) => moment(endDate, 'DD/MM/YYYY').format('DD/MM/YYYY'),
		},
		{
			title: 'Loại sự kiện',
			dataIndex: 'type',
			width: 120,
			sortable: true,
			filterType: 'select',
			align: 'center',
			render: (type: string) => <Tag color={getTypeColor(type)}>{getTypeText(type)}</Tag>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'status',
			width: 120,
			sortable: true,
			filterType: 'select',
			align: 'center',
			render: (status: string) => <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>,
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
						title='Bạn có chắc chắn muốn xóa lịch trình này?'
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
				modelName='quanlytrang.lichtrinhts'
				title='Lịch trình tuyển sinh'
				Form={LichTrinhTSForm}
				widthDrawer={800}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			<LichTrinhTSDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
		</div>
	);
};

export default LichTrinhTSPage;

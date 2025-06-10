import React, { useState } from 'react';
import { Popconfirm, Tag, Space, message, Button, Popover, Avatar, Typography } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import Form from './components/Form';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { HoSo } from '@/services/HoSo/typing';
import HoSoDetail from './components/Detail';
import { duyetHoSo, tuChoiHoSo } from '@/services/HoSo';
import useUsers from '@/hooks/useUsers';
import UserDetail from '../Users/components/Detail'; // Import UserDetail component
import { ipLocal } from '@/utils/ip';

const HoSoPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('hoso');
	const { getUserFullName, getUserInfo, getUserById, loading: usersLoading } = useUsers(); // Add useUsers hook
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [userDetailModalVisible, setUserDetailModalVisible] = useState(false); // State for UserDetail modal
	const [selectedRecord, setSelectedRecord] = useState<HoSo.IRecord | undefined>();
	const [selectedUser, setSelectedUser] = useState<User.IRecord | undefined>(); // State for selected user

	const onOpenExtendedModal = (record: HoSo.IRecord) => {
		setSelectedRecord(record);
		setExtendedModalVisible(true);
	};

	const onCloseExtendedModal = () => {
		setExtendedModalVisible(false);
	};

	const onEditFromView = () => {
		setExtendedModalVisible(false);
		if (selectedRecord) {
			handleEdit(selectedRecord);
		}
	};

	// Hàm xử lý click vào thông tin user
	const handleUserClick = (userId: string) => {
		const user = getUserById(userId);
		if (user) {
			setSelectedUser(user);
			setUserDetailModalVisible(true);
		}
	};

	// Hàm đóng modal user detail
	const handleCloseUserDetail = () => {
		setUserDetailModalVisible(false);
		setSelectedUser(undefined);
	};

	// Render user info với avatar và tên - có thể click
	const renderUserInfo = (userId: string) => {
		const userInfo = getUserInfo(userId);
		const fullName = getUserFullName(userId);

		if (usersLoading) {
			return <text type='secondary'>Đang tải...</text>;
		}

		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					cursor: 'pointer',
					padding: '4px 8px',
					borderRadius: '6px',
					transition: 'all 0.3s ease',
				}}
				onClick={() => handleUserClick(userId)}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = '#f0f9ff';
					e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = 'transparent';
					e.currentTarget.style.boxShadow = 'none';
				}}
				title='Click để xem thông tin chi tiết'
			>
				<Avatar size='small' src={`${ipLocal}${userInfo?.avatar}`} icon={<UserOutlined />} />
				<div>
					<div style={{ fontWeight: 500, color: '#1890ff' }}>{fullName}</div>
					{userInfo?.username && (
						<text type='secondary' style={{ fontSize: '12px' }}>
							@{userInfo.username}
						</text>
					)}
					<div style={{ margin: 0 }}>
						<text type='secondary' style={{ fontSize: '12px' }}>
							ID: {userId}
						</text>
					</div>
				</div>
			</div>
		);
	};

	const columns: IColumn<HoSo.IRecord>[] = [
		{
			title: 'Mã hồ sơ',
			dataIndex: 'id',
			width: 150,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Người sở hữu',
			dataIndex: 'thongTinCaNhanId', // Use thongTinCaNhanId instead of userId
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (userId: string) => renderUserInfo(userId),
		},
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
							<Space direction='vertical'>
								<Button
									type='primary'
									size='small'
									icon={<CheckOutlined />}
									onClick={async () => {
										try {
											await duyetHoSo(record);
											message.success('Duyệt hồ sơ thành công!');
											getModel();
										} catch (error) {
											message.error('Duyệt hồ sơ thất bại!');
										}
									}}
									style={{ width: 100 }}
									disabled={record.tinhTrang === 'đã duyệt'}
								>
									Duyệt
								</Button>
								<Button
									danger
									size='small'
									icon={<CloseOutlined />}
									onClick={async () => {
										try {
											await tuChoiHoSo(record);
											message.success('Từ chối hồ sơ thành công!');
											getModel();
										} catch (error) {
											message.error('Từ chối hồ sơ thất bại!');
										}
									}}
									style={{ width: 100 }}
									disabled={record.tinhTrang === 'đã duyệt'}
								>
									Từ chối
								</Button>
							</Space>
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
				exportConfig={{
					fileName: 'DanhSachHoSo.xlsx',
					maskCloseableForm: false,
				}}
			/>
			<HoSoDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
			<UserDetail
				isVisible={userDetailModalVisible}
				onClose={handleCloseUserDetail}
				record={selectedUser}
				title='người sở hữu hồ sơ'
				hideFooter
			/>
		</div>
	);
};

export default HoSoPage;

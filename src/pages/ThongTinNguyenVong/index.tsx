import React, { useState, useEffect } from 'react';
import { Popconfirm, Tag, Space, Avatar, Typography, Spin, message } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined, UserOutlined, LoadingOutlined } from '@ant-design/icons';
import ThongTinNguyenVongForm from './components/Form';
import ThongTinNguyenVongDetail from './components/Detail';
import UserDetail from '../Users/components/Detail';

const ThongTinNguyenVongPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('thongtinnguyenvong');
	const { handleView: viewUser, getByIdModel: getUserById } = useModel('users');

	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<ThongTinNguyenVong.IRecord | undefined>();
	const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User.IRecord | undefined>();
	const [loadingUserId, setLoadingUserId] = useState<string | null>(null); // Track loading state

	// State để lưu trữ thông tin user đã load
	const [usersCache, setUsersCache] = useState<{ [key: string]: User.IRecord }>({});

	const { Text } = Typography;

	// Hàm load thông tin user và cache lại
	const loadUserInfo = async (userId: string) => {
		if (usersCache[userId]) {
			return usersCache[userId];
		}

		try {
			const user = await getUserById(userId);
			if (user) {
				setUsersCache((prev) => ({
					...prev,
					[userId]: user,
				}));
				return user;
			}
		} catch (error) {
			console.error('Error loading user:', error);
			message.error('Không thể tải thông tin thí sinh');
		}
		return null;
	};

	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: ThongTinNguyenVong.IRecord) => {
		setSelectedRecord(record);
		setExtendedModalVisible(true);
	};

	const handleUserClick = async (userId: string) => {
		// Nếu đang loading user khác, không cho phép click
		if (loadingUserId && loadingUserId !== userId) {
			return;
		}

		try {
			setLoadingUserId(userId);

			// Nếu user đã có trong cache, hiển thị ngay
			if (usersCache[userId]) {
				setSelectedUser(usersCache[userId]);
				setUserDetailModalVisible(true);
				setLoadingUserId(null);
				return;
			}

			// Nếu chưa có trong cache, load từ API
			const user = await loadUserInfo(userId);
			if (user) {
				setSelectedUser(user);
				setUserDetailModalVisible(true);
			}
		} catch (error) {
			message.error('Không thể mở thông tin thí sinh');
		} finally {
			setLoadingUserId(null);
		}
	};

	// Hàm đóng modal user detail
	const handleCloseUserDetail = () => {
		setUserDetailModalVisible(false);
		setSelectedUser(undefined);
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

	// Component để render thông tin user
	const UserInfoCell = ({ userId }: { userId: string }) => {
		const [userInfo, setUserInfo] = useState<User.IRecord | null>(null);
		const [loading, setLoading] = useState(true);

		useEffect(() => {
			const fetchUser = async () => {
				setLoading(true);
				const user = await loadUserInfo(userId);
				setUserInfo(user);
				setLoading(false);
			};

			fetchUser();
		}, [userId]);

		const isClickLoading = loadingUserId === userId;

		// Container style cố định để tránh layout shift
		const containerStyle = {
			display: 'flex',
			alignItems: 'center',
			gap: 8,
			cursor: loading ? 'default' : isClickLoading ? 'wait' : 'pointer',
			padding: '6px 10px',
			borderRadius: '8px',
			transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
			position: 'relative' as const,
			minHeight: '40px', // Cố định chiều cao
			width: '100%', // Cố định chiều rộng
			opacity: isClickLoading ? 0.7 : 1,
		};

		if (loading) {
			return (
				<div style={containerStyle}>
					<Avatar size='small' icon={<UserOutlined />} />
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 4,
							flex: 1, // Đảm bảo chiếm hết không gian còn lại
						}}
					>
						<Spin size='small' />
						<span style={{ color: '#666', fontSize: '14px' }}>Đang tải...</span>
					</div>
				</div>
			);
		}

		if (!userInfo) {
			return (
				<div style={containerStyle}>
					<Avatar size='small' icon={<UserOutlined />} />
					<div
						style={{
							color: '#ff4d4f',
							fontSize: '14px',
							flex: 1,
						}}
					>
						Không tìm thấy thông tin
					</div>
				</div>
			);
		}

		const fullName = userInfo.ho + ' ' + userInfo.ten;

		return (
			<div
				style={containerStyle}
				onClick={() => !isClickLoading && !loading && handleUserClick(userId)}
				onMouseEnter={(e) => {
					if (!isClickLoading && !loading) {
						e.currentTarget.style.backgroundColor = '#f0f9ff';
						e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.15)';
					}
				}}
				onMouseLeave={(e) => {
					if (!isClickLoading && !loading) {
						e.currentTarget.style.backgroundColor = 'transparent';
						e.currentTarget.style.boxShadow = 'none';
					}
				}}
				title={
					loading ? 'Đang tải thông tin...' : isClickLoading ? 'Đang mở chi tiết...' : 'Click để xem thông tin chi tiết'
				}
			>
				<Avatar
					size='small'
					src={userInfo.avatar}
					icon={<UserOutlined />}
					style={{
						flexShrink: 0, // Không cho phép thu nhỏ
						filter: isClickLoading ? 'brightness(0.8)' : 'brightness(1)',
						transition: 'filter 0.2s ease',
					}}
				/>
				<div
					style={{
						flex: 1,
						minWidth: 0, // Cho phép text truncate nếu cần
						overflow: 'hidden',
					}}
				>
					<div
						style={{
							fontWeight: 500,
							color: isClickLoading ? '#666' : '#1890ff',
							transition: 'color 0.2s ease',
							fontSize: '14px',
							lineHeight: '20px',
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
						}}
					>
						{fullName}
					</div>
					{userInfo.username && (
						<Text
							type='secondary'
							style={{
								fontSize: '12px',
								lineHeight: '16px',
								display: 'block',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							@{userInfo.username}
						</Text>
					)}
					{userInfo.id && (
						<Text
							type='secondary'
							style={{
								fontSize: '12px',
								lineHeight: '16px',
								display: 'block',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							ID:{userInfo.id}
						</Text>
					)}
				</div>
				{isClickLoading && (
					<div
						style={{
							position: 'absolute',
							right: 10,
							top: '50%',
							transform: 'translateY(-50%)',
							zIndex: 1,
						}}
					>
						<Spin size='small' indicator={<LoadingOutlined style={{ fontSize: 14, color: '#1890ff' }} spin />} />
					</div>
				)}
			</div>
		);
	};

	const columns: IColumn<ThongTinNguyenVong.IRecord>[] = [
		{
			title: 'Thí sinh',
			dataIndex: 'userId',
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (userId: string) => <UserInfoCell userId={userId} />,
		},
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
						title='Bạn có chắc chắn muốn xóa nguyện vọng này?'
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
				rowSortable
				rowSelection
			/>
			<ThongTinNguyenVongDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
			<UserDetail
				isVisible={userDetailModalVisible}
				onClose={handleCloseUserDetail}
				record={selectedUser}
				title='thí sinh'
			/>
		</div>
	);
};

export default ThongTinNguyenVongPage;

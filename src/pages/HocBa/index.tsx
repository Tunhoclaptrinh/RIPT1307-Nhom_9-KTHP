import React, { useEffect, useState } from 'react';
import { Popconfirm, Tag, Space, Typography, Popover, Avatar, Image } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import DiemHocSinhForm from './components/Form';
import HocBaDetail from './components/Detail';
import UserDetail from '../Users/components/Detail';
import useUsers from '@/hooks/useUsers';

const { Text } = Typography;

const DiemHocSinhPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('hocba');
	const { getUserProof, getAvatar} = useModel('users');
	const { getUserFullName, getUserInfo, getUserById, loading: usersLoading } = useUsers();
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [userDetailModalVisible, setUserDetailModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<DiemHocSinh.IRecord | undefined>();
	const [selectedUser, setSelectedUser] = useState<User.IRecord | undefined>(); // User được chọn
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  	const [poofUrl, setPoofUrl] = useState<string | null>(null);
	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: DiemHocSinh.IRecord) => {
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

	// hàm render cột minh chứng 
const PoofCell: React.FC<User.AvatarCellProps> = ({ userId }) => {

  useEffect(() => {
    const fetchPoof = async () => {
      try {
        const response = await getUserProof(userId);

        if (response?.data?.length > 0) {
          setPoofUrl(response.data[0].fileList[0].thumbUrl);
        }
      } catch (error) {
        console.error('Error fetching poof:', error);
      }
    };

	fetchPoof();
  }, [userId]);

	
  return poofUrl ? (
    <Image
      src={poofUrl}
      width={80}
      height={80}
      style={{ objectFit: 'cover' }}
      preview={{
        src: poofUrl,
      }}
    />
  ) : null;
	};

	const renderLoaiHanhKiem = (loai?: DiemHocSinh.LoaiHanhKiem) => {
		const colorMap: { [key in DiemHocSinh.LoaiHanhKiem]: string } = {
			tốt: 'green',
			khá: 'blue',
			'trung bình': 'orange',
			yếu: 'red',
			kém: 'volcano',
		};

		if (!loai || !colorMap[loai]) {
			return <Tag color='default'>Không xác định</Tag>;
		}

		return <Tag color={colorMap[loai]}>{loai.toUpperCase()}</Tag>;
	};

	const renderDiemMonHoc = (diemMonHoc: DiemHocSinh.IDiemMonHoc[]) => {
		if (!diemMonHoc || diemMonHoc.length === 0) {
			return <Text type='secondary'>Chưa có điểm</Text>;
		}

		return (
			<div style={{ maxHeight: 300, overflowY: 'auto' }}>
				{diemMonHoc.map((diem, index) => (
					<div key={index} style={{ marginBottom: 4 }}>
						<Text strong>{diem.mon}</Text> - HK{diem.hocKy}: <Text type='success'>{diem.diemTongKet}</Text>
					</div>
				))}
			</div>
		);
	};

	// Render user info với avatar và tên - có thể click
	const renderUserInfo = (userId: string) => {
		const userInfo = getUserInfo(userId);
		const fullName = getUserFullName(userId);
		// ham lay avatar 
		const AvatarCell: React.FC<User.AvatarCellProps> = ({ userId }) => {
	
		useEffect(() => {
		const fetchAvatar = async () => {
			try {
			const response = await getAvatar(userId);
			if (response?.data?.length > 0) {
				setAvatarUrl(response.data[0].avatarUrl.fileList[0].thumbUrl);
			}
			} catch (error) {
			console.error('Error fetching avatar:', error);
			}
		};
	
		fetchAvatar();
		}, [userId]);
		return userInfo ? (
			<Avatar size='small' src={userInfo?.avatar} icon={<UserOutlined />} />
		) : null;
		};

		if (usersLoading) {
			return <Text type='secondary'>Đang tải...</Text>;
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
				{/* <Avatar size='small' src={userInfo?.avatar} icon={<UserOutlined />} /> */}
				<AvatarCell userId={userId} />,
				<div>
					<div style={{ fontWeight: 500, color: '#1890ff' }}>{fullName}</div>
					{userInfo?.username && (
						<Text type='secondary' style={{ fontSize: '12px' }}>
							@{userInfo.username}
						</Text>
					)}
					<div style={{ margin: 0 }}>
						<Text type='secondary' style={{ fontSize: '12px' }}>
							ID:{userId}
						</Text>
					</div>
				</div>
			</div>
		);
	};

	const columns: IColumn<DiemHocSinh.IRecord>[] = [
		{
			title: 'Thí sinh',
			dataIndex: 'userId',
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (userId: string) => renderUserInfo(userId),
		},
		{
			title: 'Điểm các môn học',
			dataIndex: 'diemMonHoc',
			width: 300,
			render: (diemMonHoc: DiemHocSinh.IDiemMonHoc[]) => {
				if (!diemMonHoc || diemMonHoc.length === 0) {
					return <Text type='secondary'>Chưa có điểm</Text>;
				}

				const summary =
					diemMonHoc
						.slice(0, 3)
						.map((diem) => `${diem.mon} - HK${diem.hocKy}: ${diem.diemTongKet}`)
						.join(', ') + (diemMonHoc.length > 3 ? ', ...' : '');

				return (
					<Popover content={renderDiemMonHoc(diemMonHoc)} title='Chi tiết điểm môn học' trigger='click'>
						<div
							style={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								maxWidth: '280px',
								cursor: 'pointer',
							}}
						>
							{summary}
						</div>
					</Popover>
				);
			},
		},
		{
			title: 'Loại hạnh kiểm',
			dataIndex: 'loaiHanhKiem',
			width: 150,
			sortable: true,
			filterType: 'select',
			filterIcon: [
				{ text: 'Tốt', value: 'tốt' },
				{ text: 'Khá', value: 'khá' },
				{ text: 'Trung bình', value: 'trung bình' },
				{ text: 'Yếu', value: 'yếu' },
				{ text: 'Kém', value: 'kém' },
			],
			render: (loai: DiemHocSinh.LoaiHanhKiem) => renderLoaiHanhKiem(loai),
		},
		{
			title: 'Ảnh minh chứng',
			dataIndex: 'minhChung',
			width: 200,
			align: 'center',
			render: (_, record) => <PoofCell userId={record.userId} />,
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
						title='Bạn có chắc chắn muốn xóa bảng điểm này?'
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
				modelName='hocba'
				title='Quản lý Học Bạ'
				Form={DiemHocSinhForm}
				widthDrawer={900}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			<HocBaDetail
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
				hideFooter
			/>
		</div>
	);
};

export default DiemHocSinhPage;

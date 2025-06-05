import React, { useState, useEffect } from 'react';
import { Popconfirm, Tag, Space, Popover, Image } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import UserForm from './components/Form';
import UserDetail from './components/Detail';
import ExpandText from '@/components/ExpandText';


// PasswordCell component (unchanged)
const PasswordCell = ({ password }: { password: string }) => {
	const content = (
		<div style={{ padding: '8px', maxWidth: '200px' }}>
			<div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Mật khẩu:</div>
			<div
				style={{
					fontFamily: 'monospace',
					fontSize: '14px',
					padding: '4px 8px',
					backgroundColor: '#f5f5f5',
					borderRadius: '4px',
					wordBreak: 'break-all',
				}}
			>
				{password || 'Không có mật khẩu'}
			</div>
		</div>
	);

	return (
		<Popover content={content} trigger='click' placement='top'>
			<span
				style={{
					cursor: 'pointer',
					userSelect: 'none',
					padding: '2px 6px',
					backgroundColor: '#f0f0f0',
					borderRadius: '4px',
					border: '1px dashed #d9d9d9',
					display: 'inline-block',
					minWidth: '80px',
					textAlign: 'center',
					fontSize: '12px',
					transition: 'all 0.2s',
				}}
				title='Click để xem mật khẩu'
			>
				••••••••
			</span>
		</Popover>
	);
};

const UsersPage = () => {
	const { handleEdit, handleView, deleteModel, getModel, getAvatar } = useModel('users');
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<User.IRecord | undefined>();

const AvatarCell: React.FC<User.AvatarCellProps> = ({ userId }) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await getAvatar(userId);
        if (response?.data?.length > 0) {
          setAvatarUrl(response.data[0].avatarUrl);
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
      }
    };

    fetchAvatar();
  }, [userId]);

  return avatarUrl ? (
    <Image
      src={avatarUrl}
      width={80}
      height={80}
      style={{ objectFit: 'cover' }}
      preview={{
        src: avatarUrl,
      }}
    />
  ) : null;
};
	const onView = (record: User.IRecord) => {
		setSelectedRecord(record);
		setViewModalVisible(true);
	};

	const onCloseModal = () => {
		setViewModalVisible(false);
		setSelectedRecord(undefined);
	};

	const onEditFromView = () => {
		setViewModalVisible(false);
		if (selectedRecord) {
			handleEdit(selectedRecord);
		}
	};

	const columns: IColumn<User.IRecord>[] = [
		{
			title: 'Avatar',
			dataIndex: 'id',
			width: 120,
			align: 'center',
			render: (id) => <AvatarCell userId={id} />,
		},
		{
			title: 'Họ tên',
			dataIndex: 'ho',
			width: 180,
			sortable: true,
			filterType: 'string',
			render: (ho, record) => `${ho} ${record.ten}`,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Mật khẩu',
			dataIndex: 'password',
			width: 100,
			align: 'center',
			render: (password) => <PasswordCell password={password} />,
		},
		{
			title: 'Số CCCD',
			dataIndex: 'soCCCD',
			width: 130,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDT',
			width: 120,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 120,
			sortable: true,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: ['nam', 'nữ', 'khác'],
			render: (val) => {
				const colors = { nam: 'blue', nữ: 'pink', khác: 'gray' };
				return <Tag color={colors[val as keyof typeof colors]}>{val}</Tag>;
			},
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'hoKhauThuongTru',
			width: 250,
			render: (val) => {
				if (!val) return '';
				return `${val.diaChi}, ${val.xaPhuong}, ${val.quanHuyen}, ${val.tinh_ThanhPho}`;
			},
		},
		{
			title: 'Ngày cấp CCCD',
			dataIndex: 'ngayCap',
			width: 120,
			sorter: true,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend tooltip='Xem chi tiết' onClick={() => onView(record)} type='link' icon={<EyeOutlined />} />
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
				modelName='users'
				title='Quản lý người dùng'
				Form={UserForm}
				widthDrawer={900}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
			{/* Modal xem chi tiết */}
			{selectedRecord && (
				<UserDetail
					isVisible={viewModalVisible}
					onClose={onCloseModal}
					onEdit={onEditFromView}
					record={selectedRecord}
					title='người dùng'
				/>
			)}
		</div>
	);
};

export default UsersPage;

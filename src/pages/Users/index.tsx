import React, { useState, useEffect } from 'react';
import { Popconfirm, Tag, Space, Popover, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import UserForm from './components/Form';
import UserDetail from './components/Detail';
import AdmissionStepModal from '../../components/FormHoSo';
import { useAddress } from '@/hooks/useAddress';
import ExpandText from '@/components/ExpandText';
import { ipLocal } from '@/utils/ip';

// PasswordCell component
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

// Component hiển thị địa chỉ trong bảng
const AddressCell = ({ address, recordId }: { address: any; recordId: string }) => {
	const [addressName, setAddressName] = useState('');
	const [loading, setLoading] = useState(true);
	const { getAddressName } = useAddress();

	useEffect(() => {
		const loadAddress = async () => {
			setLoading(true);
			try {
				if (address) {
					const name = await getAddressName(address);
					setAddressName(name || 'Không có thông tin');
				} else {
					setAddressName('Không có thông tin');
				}
			} catch (error) {
				console.error('Error loading address for record:', recordId, error);
				setAddressName('Lỗi tải địa chỉ');
			} finally {
				setLoading(false);
			}
		};

		loadAddress();
	}, [address, recordId, getAddressName]);

	if (loading) {
		return <span style={{ color: '#999' }}>Đang tải...</span>;
	}

	return (
		<Popover
			content={<div style={{ maxWidth: 300, wordBreak: 'break-word' }}>{addressName}</div>}
			trigger='click'
			placement='top'
		>
			<span
				style={{
					maxWidth: 250,
					cursor: 'pointer',
				}}
			>
				{addressName?.length > 50 ? `${addressName.substring(0, 50)}...` : addressName}
			</span>
		</Popover>
	);
};

const UsersPage = () => {
	const { handleEdit, handleView, deleteModel, getModel, getExportFieldsModel, postExportModel } = useModel('users');
	const [viewModalVisible, setViewModalVisible] = useState(false);
	const [selectedRecord, setSelectedRecord] = useState<User.IRecord | undefined>();
	const [admissionModalVisible, setAdmissionModalVisible] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState<string>('');

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

	const onCreateAdmission = (record: User.IRecord) => {
		setSelectedUserId(record.id);
		setAdmissionModalVisible(true);
	};

	const onCloseAdmissionModal = () => {
		setAdmissionModalVisible(false);
		setSelectedUserId('');
	};

	const columns: IColumn<User.IRecord>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'ho',
			width: 180,
			sortable: true,
			filterType: 'string',
			render: (ho, record) => (
				<Space>
					<Avatar size={32} src={record.avatar ? `${ipLocal}${record.avatar}` : undefined} icon={<UserOutlined />} />
					<span>{`${ho || ''} ${record.ten || ''}`}</span>
				</Space>
			),
		},
		{
			title: 'Username',
			dataIndex: 'username',
			width: 150,
			sortable: true,
			filterType: 'string',
			render: (val) => val || 'Chưa có',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (val) => val || 'Chưa có',
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
			render: (val) => val || 'Chưa có',
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDT',
			width: 130,
			sortable: true,
			filterType: 'string',
			render: (val) => val || 'Chưa có',
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 120,
			sortable: true,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : 'Chưa có'),
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: ['nam', 'nữ', 'khác'],
			render: (val) => {
				if (!val) return <Tag color='gray'>Chưa có</Tag>;
				const colors = { nam: 'blue', nữ: 'pink', khác: 'gray' };
				return <Tag color={colors[val as keyof typeof colors]}>{val}</Tag>;
			},
		},
		{
			title: 'Ngày cấp CCCD',
			dataIndex: 'ngayCap',
			width: 130,
			sorter: true,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : 'Chưa có'),
		},
		{
			title: 'Nơi cấp',
			dataIndex: 'noiCap',
			width: 150,
			sortable: true,
			filterType: 'string',
			render: (val) => val || 'Chưa có',
		},
		{
			title: 'Địa chỉ',
			dataIndex: 'hoKhauThuongTru',
			width: 250,
			render: (address, record) => <AddressCell address={address} recordId={record.id} />,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 160,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend tooltip='Xem chi tiết' onClick={() => onView(record)} type='link' icon={<EyeOutlined />} />
					<ButtonExtend
						tooltip='Tạo hồ sơ cho thí sinh này'
						onClick={() => onCreateAdmission(record)}
						type='link'
						icon={<FormOutlined />}
					/>
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
				exportConfig={{
					fileName: 'DanhSachNguoiDung.xlsx',
					getExportFieldsModel,
					postExportModel,
					maskCloseableForm: false,
				}}
			/>
			{selectedRecord && (
				<UserDetail
					isVisible={viewModalVisible}
					onClose={onCloseModal}
					onEdit={onEditFromView}
					record={selectedRecord}
					title='người dùng'
				/>
			)}
			{admissionModalVisible && selectedUserId && (
				<AdmissionStepModal userId={selectedUserId} visible={admissionModalVisible} onClose={onCloseAdmissionModal} />
			)}
		</div>
	);
};

export default UsersPage;

import React from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import Form from './components/Form';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import UserForm from './components/Form';

const UsersPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('users');

	const columns: IColumn<User.IRecord>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'ho',
			width: 180,
			sortable: true,
			filterType: 'string',
			render: (ho, record) => `${ho} ${record.ten}`,
		},
		{
			title: 'Username',
			dataIndex: 'username',
			width: 120,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			sortable: true,
			filterType: 'string',
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
					<ButtonExtend tooltip='Xem chi tiết' onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
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
				getData={getModel}
			/>
		</div>
	);
};

export default UsersPage;

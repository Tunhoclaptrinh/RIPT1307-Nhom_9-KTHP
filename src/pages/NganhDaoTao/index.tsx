import React from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import NganhDaoTaoForm from './components/Form';
const UsersPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('nganhdaotao');

	const columns: IColumn<NganhDaoTao.IRecord>[] = [
		{
			title: 'Mã ngành đào tạo',
            dataIndex:'ma',
			width: 180,
			sortable: true,
			filterType: 'string',
		},
        {
			title: 'Tên ngành đào tạo',
            dataIndex:'ten',
			width: 180,
			sortable: true,
			filterType: 'string',
		},
        {
			title: 'Mô tả ngành đào tạo',
            dataIndex:'moTa',
			width: 180,
			sortable: true,
			filterType: 'string',
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
						title='Bạn có chắc chắn muốn xóa ngành đào tạo này?'
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
				modelName='nganhdaotao'
				title='Quản lý ngành đào tạo'
				Form={NganhDaoTaoForm}
				widthDrawer={500}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
		</div>
	);
};

export default UsersPage;

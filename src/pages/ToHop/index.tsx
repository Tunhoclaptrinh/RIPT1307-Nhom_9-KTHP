import React, { useState } from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import ToHopForm from './components/Form';

const ToHopPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('tohop');

	const columns: IColumn<ToHop.IRecord>[] = [
		{
			title: 'Mã tổ hợp',
			dataIndex: 'id',
			width: 120,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Môn học',
			dataIndex: 'monHoc',
			width: 300,
			sortable: false,
			filterType: 'string',
			render: (monHoc: string[]) => (
				<Space wrap>
					{monHoc?.map((mon, index) => (
						<Tag key={index} color='blue'>
							{mon}
						</Tag>
					))}
				</Space>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa tổ hợp này?'
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
				modelName='tohop'
				title='Tổ hợp môn học'
				Form={ToHopForm}
				widthDrawer={500}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
		</div>
	);
};

export default ToHopPage;

import { Popconfirm,  Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import HeDaoTaoForm from './components/Form';

const UsersPage = () => {
	const { handleEdit, handleView, deleteModel } = useModel('hedaotao');

	const columns: IColumn<HeDaoTao.IRecord>[] = [
		{
			title: 'Mã hệ đào tạo',
			dataIndex: 'id',
			width: 180,
			sortable: true,
			filterType: 'string',
		},
		{
			title: 'Tên hệ đào tạo',
			dataIndex: 'ten',
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
						title='Bạn có chắc chắn muốn xóa hệ dào tạo này?'
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
				modelName='hedaotao'
				title='Quản lý hệ đào tạo'
				Form={HeDaoTaoForm}
				widthDrawer={500}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
		</div>
	);
};

export default UsersPage;
import React from 'react';
import { Popconfirm, Tag, Space, Badge } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import FAQForm from './components/Form';

const FAQPage = () => {
	const { handleEdit, handleView, deleteModel, getModel } = useModel('quanlytrang.faq');

	const columns: IColumn<FAQ.IRecord>[] = [
		{
			title: 'Câu hỏi',
			dataIndex: 'question',
			width: 400,
			sortable: true,
			filterType: 'string',
			render: (question: string) => <div style={{ fontWeight: 500 }}>{question}</div>,
		},
		{
			title: 'Trả lời',
			dataIndex: 'answer',
			width: 500,
			sortable: false,
			filterType: 'string',
			render: (answer: string) => (
				<div
					style={{
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						maxWidth: '480px',
					}}
				>
					{answer}
				</div>
			),
		},
		{
			title: 'Danh mục',
			dataIndex: 'category',
			width: 120,
			sortable: true,
			filterType: 'select',
			align: 'center',
			render: (category: string) => {
				const categoryColors: { [key: string]: string } = {
					dangky: 'blue',
					hoso: 'green',
					thoihan: 'orange',
					ketqua: 'purple',
				};
				const categoryNames: { [key: string]: string } = {
					dangky: 'Đăng ký',
					hoso: 'Hồ sơ',
					thoihan: 'Thời hạn',
					ketqua: 'Kết quả',
				};
				return <Tag color={categoryColors[category] || 'default'}>{categoryNames[category] || category}</Tag>;
			},
		},
		{
			title: 'Lượt xem',
			dataIndex: 'viewCount',
			width: 100,
			sortable: true,
			filterType: 'number',
			align: 'center',
			render: (viewCount: number) => <Badge count={viewCount} color='blue' showZero overflowCount={9999} />,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'isActive',
			width: 120,
			sortable: true,
			filterType: 'select',
			align: 'center',
			render: (isActive: boolean) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'Hiển thị' : 'Ẩn'}</Tag>,
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
						title='Bạn có chắc chắn muốn xóa câu hỏi này?'
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
				modelName='quanlytrang.faq'
				title='Câu hỏi thường gặp'
				Form={FAQForm}
				widthDrawer={600}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
			/>
		</div>
	);
};

export default FAQPage;

import React from 'react';
import { Popconfirm, Tag, Space, Badge } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ThongBaoTSForm from './components/Form';

const ThongBaoTSPage = () => {
    const { handleEdit, handleView, deleteModel, getModel } = useModel('thongbaots');

    const columns: IColumn<ThongBaoTS.IRecord>[] = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            width: 300,
            sortable: true,
            filterType: 'string',
            render: (title: string) => (
                <div style={{ fontWeight: 500 }}>
                    {title}
                </div>
            ),
        },
        {
            title: 'Tóm tắt',
            dataIndex: 'summary',
            width: 400,
            sortable: false,
            filterType: 'string',
            render: (summary: string) => (
                <div style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '380px'
                }}>
                    {summary}
                </div>
            ),
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'date',
            width: 120,
            sortable: true,
            filterType: 'date',
            render: (date: string) => moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        },
        {
            title: 'Ưu tiên',
            dataIndex: 'priority',
            width: 100,
            sortable: true,
            filterType: 'number',
            align: 'center',
            render: (priority: number) => (
                <Badge 
                    count={priority} 
                    color={priority === 1 ? 'red' : priority === 2 ? 'orange' : 'blue'}
                    showZero
                />
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            width: 120,
            sortable: true,
            filterType: 'select',
            align: 'center',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'green' : 'red'}>
                    {isActive ? 'Hiển thị' : 'Ẩn'}
                </Tag>
            ),
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
                        title='Bạn có chắc chắn muốn xóa thông báo này?'
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
                modelName='thongbaots'
                title='Thông báo tuyển sinh'
                Form={ThongBaoTSForm}
                widthDrawer={800}
                buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
                deleteMany
                rowSelection
            />
        </div>
    );
};

export default ThongBaoTSPage;
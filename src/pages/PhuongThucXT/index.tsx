import React from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import PhuongThucXTForm from './components/Form';

const PhuongThucXetTuyenPage = () => {
    const { handleEdit, handleView, deleteModel, getModel } = useModel('phuongthucxt');

    const columns: IColumn<PhuongThucXT.IRecord>[] = [
        
        {
            title: 'Tên phương thức xét tuyển',
            dataIndex: 'ten',
            width: 180,
            sortable: true,
            filterType: 'string',
        },
        {
            title: 'Nguyên tắc xét tuyển',
            dataIndex: 'nguyenTac',
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
                        title='Bạn có chắc chắn muốn hủy phương thức xét tuyển này?'
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
                modelName='phuongthucxt'
                title='Phương thức xét tuyển'
                Form={PhuongThucXTForm}
                widthDrawer={500}
                buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
                deleteMany
                rowSelection
            />
        </div>
    );
};

export default PhuongThucXetTuyenPage;

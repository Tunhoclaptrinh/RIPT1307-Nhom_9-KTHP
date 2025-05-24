import React from 'react';
import { Popconfirm, Tag, Space, Statistic } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ThongKeTSForm from './components/Form';

const ThongKeTSPage = () => {
    const { handleEdit, handleView, deleteModel, getModel } = useModel('thongkets');

    const columns: IColumn<ThongKeTS.IRecord>[] = [
        {
            title: 'Năm',
            dataIndex: 'year',
            width: 100,
            sortable: true,
            filterType: 'number',
            align: 'center',
            render: (year: number) => (
                <div style={{ fontWeight: 500, color: '#1890ff' }}>
                    {year}
                </div>
            ),
        },
        {
            title: 'Số trường ĐH',
            dataIndex: 'soTruongDaiHoc',
            width: 130,
            sortable: true,
            filterType: 'number',
            align: 'center',
            render: (value: number) => (
                <Statistic 
                    value={value} 
                    valueStyle={{ fontSize: '14px', color: '#52c41a' }}
                />
            ),
        },
        {
            title: 'Số ngành đào tạo',
            dataIndex: 'soNganhDaoTao',
            width: 150,
            sortable: true,
            filterType: 'number',
            align: 'center',
            render: (value: number) => (
                <Statistic 
                    value={value} 
                    valueStyle={{ fontSize: '14px', color: '#1890ff' }}
                />
            ),
        },
        {
            title: 'Số thí sinh đăng ký',
            dataIndex: 'soThiSinhDangKy',
            width: 160,
            sortable: true,
            filterType: 'number',
            align: 'center',
            render: (value: number) => (
                <Statistic 
                    value={value} 
                    valueStyle={{ fontSize: '14px', color: '#722ed1' }}
                />
            ),
        },
        {
            title: 'Tỷ lệ hồ sơ trực tuyến (%)',
            dataIndex: 'tyLeHoSoTrucTuyen',
            width: 180,
            sortable: true,
            filterType: 'number',
            align: 'center',
            render: (value: number) => (
                <div style={{ 
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: value >= 70 ? '#f6ffed' : value >= 50 ? '#fff7e6' : '#fff2f0',
                    border: `1px solid ${value >= 70 ? '#b7eb8f' : value >= 50 ? '#ffd591' : '#ffccc7'}`,
                    color: value >= 70 ? '#52c41a' : value >= 50 ? '#fa8c16' : '#ff4d4f',
                    fontWeight: 500
                }}>
                    {value}%
                </div>
            ),
        },
        {
            title: 'Cập nhật lần cuối',
            dataIndex: 'lastUpdated',
            width: 140,
            sortable: true,
            filterType: 'date',
            render: (date: string) => (
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')}
                </div>
            ),
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
                        onClick={() => handleView(record)} 
                        type='link' 
                        icon={<EyeOutlined />} 
                    />
                    <ButtonExtend 
                        tooltip='Chỉnh sửa' 
                        onClick={() => handleEdit(record)} 
                        type='link' 
                        icon={<EditOutlined />} 
                    />
                    <Popconfirm
                        onConfirm={() => deleteModel(record.id)}
                        title='Bạn có chắc chắn muốn xóa phần này?'
                        placement='topRight'
                    >
                        <ButtonExtend 
                            tooltip='Xóa' 
                            danger 
                            type='link' 
                            icon={<DeleteOutlined />} 
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <TableBase
                columns={columns}
                modelName='thongkets'
                title='Thống kê tuyển sinh'
                Form={ThongKeTSForm}
                widthDrawer={500}
                buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
                deleteMany
                rowSelection
            />
        </div>
    );
};

export default ThongKeTSPage;
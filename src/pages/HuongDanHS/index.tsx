import React from 'react';
import { Popconfirm, Tag, Space, Button } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import moment from 'moment';
import HuongDanHSForm from './components/Form';

const HuongDanHSPage = () => {
    const { handleEdit, handleView, deleteModel, getModel } = useModel('huongdanhs');

    const formatFileSize = (size: string) => {
        const sizeInBytes = parseInt(size);
        if (sizeInBytes < 1024) return `${sizeInBytes} B`;
        if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
        return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const handleDownload = (fileUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns: IColumn<HuongDanHS.IRecord>[] = [
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            width: 300,
            sortable: true,
            filterType: 'string',
            render: (title: string) => (
                <div style={{ fontWeight: 500 }}>
                    <FileTextOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                    {title}
                </div>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            width: 150,
            sortable: true,
            filterType: 'select',
            align: 'center',
            render: (category: string) => (
                <Tag color='blue'>
                    {category}
                </Tag>
            ),
        },
        {
            title: 'Tóm tắt',
            dataIndex: 'summary',
            width: 350,
            sortable: false,
            filterType: 'string',
            render: (summary: string) => (
                <div style={{ 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '330px'
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
            title: 'Kích thước file',
            dataIndex: 'fileSize',
            width: 120,
            sortable: true,
            filterType: 'string',
            align: 'center',
            render: (fileSize: string) => (
                <span style={{ color: '#666' }}>
                    {formatFileSize(fileSize)}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            align: 'center',
            width: 180,
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
                        tooltip='Tải xuống' 
                        onClick={() => handleDownload(record.fileUrl, record.title)} 
                        type='link' 
                        icon={<DownloadOutlined />} 
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
                modelName='huongdanhs'
                title='Hướng dẫn hồ sơ'
                Form={HuongDanHSForm}
                widthDrawer={800}
                buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
                deleteMany
                rowSelection
            />
        </div>
    );
};

export default HuongDanHSPage;
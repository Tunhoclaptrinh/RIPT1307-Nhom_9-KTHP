import React from 'react';
import { Popconfirm, Tag, Space } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import ThongTinNguyenVongForm from './components/Form';

const ThongTinNguyenVongPage = () => {
  const { handleEdit, handleView, deleteModel, getModel } = useModel('thongtinnguyenvong');

  const columns: IColumn<ThongTinNguyenVong.IRecord>[] = [
    {
      title: 'Mã Nguyện Vọng',
      dataIndex: 'id',
      width: 150,
      sortable: true,
      filterType: 'number',
    },
    {
      title: 'Thứ tự nguyện vọng',
      dataIndex: 'thuTuNV',
      width: 150,
      sortable: true,
      filterType: 'number',
    },
    {
      title: 'Tên nguyện vọng',
      dataIndex: 'ten',
      width: 200,
      sortable: true,
      filterType: 'string',
    },
    {
      title: 'Phương thức xét tuyển',
      dataIndex: 'phuongThucId',
      width: 180,
      sortable: true,
      filterType: 'string',
    },
    {
      title: 'Điểm chưa ưu tiên',
      dataIndex: 'diemChuaUT',
      width: 150,
      sortable: true,
      filterType: 'number',
    },
    {
      title: 'Điểm có ưu tiên',
      dataIndex: 'diemCoUT',
      width: 150,
      sortable: true,
      filterType: 'number',
    },
    {
      title: 'Điểm đối tượng ưu tiên',
      dataIndex: 'diemDoiTuongUT',
      width: 150,
      sortable: true,
      filterType: 'number',
    },
    {
      title: 'Điểm khu vực ưu tiên',
      dataIndex: 'diemKhuVucUT',
      width: 150,
      sortable: true,
      filterType: 'number',
    },
    {
      title: 'Tổng điểm',
      dataIndex: 'tongDiem',
      width: 150,
      sortable: true,
      filterType: 'number',
    },
    {
      title: 'Phương thức xét tuyển (Array)',
      dataIndex: 'phuongThucXT',
      width: 200,
    //   render: (phuongThucXT: string[]) => (
    //     <Space>
    //       {phuongThucXT?.map((item, index) => (
    //         <Tag key={index}>{item}</Tag>
    //       ))}
    //     </Space>
    //   ),
    },
    // {
    //   title: 'Thao tác',
    //   align: 'center',
    //   width: 150,
    //   fixed: 'right',
    //   render: (_, record) => (
    //     <Space>
    //       <ButtonExtend
    //         tooltip="Xem chi tiết"
    //         onClick={() => handleView(record)}
    //         type="link"
    //         icon={<EyeOutlined />}
    //       />
    //       <ButtonExtend
    //         tooltip="Chỉnh sửa"
    //         onClick={() => handleEdit(record)}
    //         type="link"
    //         icon={<EditOutlined />}
    //       />
    //       <Popconfirm
    //         onConfirm={() => deleteModel(record.id)}
    //         title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
    //         placement="topRight"
    //       >
    //         <ButtonExtend tooltip="Xóa" danger type="link" icon={<DeleteOutlined />} />
    //       </Popconfirm>
    //     </Space>
    //   ),
    // },
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
        modelName="thongtinnguyenvong"
        title="Quản lý thông tin nguyện vọng"
        Form={ThongTinNguyenVongForm}
        widthDrawer={500}
        buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
        deleteMany
        rowSelection
      />
    </div>
  );
};

export default ThongTinNguyenVongPage;
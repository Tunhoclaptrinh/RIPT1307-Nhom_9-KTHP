import React from 'react';
import { Popconfirm, Tag, Space, Typography, Popover } from 'antd';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import DiemHocSinhForm from './components/Form';

const { Text } = Typography;

const DiemHocSinhPage = () => {
  const { handleEdit, handleView, deleteModel, getModel } = useModel('hocba');

  const renderLoaiHanhKiem = (loai?: DiemHocSinh.LoaiHanhKiem) => {
    const colorMap: { [key in DiemHocSinh.LoaiHanhKiem]: string } = {
      'tốt': 'green',
      'khá': 'blue',
      'trung bình': 'orange',
      'yếu': 'red',
      'kém': 'volcano',
    };

    if (!loai || !colorMap[loai]) {
      return <Tag color="default">Không xác định</Tag>;
    }

    return <Tag color={colorMap[loai]}>{loai.toUpperCase()}</Tag>;
  };

  const renderDiemMonHoc = (diemMonHoc: DiemHocSinh.IDiemMonHoc[]) => {
    if (!diemMonHoc || diemMonHoc.length === 0) {
      return <Text type="secondary">Chưa có điểm</Text>;
    }

    return (
      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
        {diemMonHoc.map((diem, index) => (
          <div key={index} style={{ marginBottom: 4 }}>
            <Text strong>{diem.mon}</Text> - HK{diem.hocKy}: <Text type="success">{diem.diemTongKet}</Text>
          </div>
        ))}
      </div>
    );
  };

  const columns: IColumn<DiemHocSinh.IRecord>[] = [
    // {
    //   title: 'ID Học bạ',
    //   dataIndex: 'id',
    //   width: 120,
    //   sortable: true,
    //   filterType: 'string',
    // },
    {
      title: 'Điểm các môn học',
      dataIndex: 'diemMonHoc',
      width: 300,
      render: (diemMonHoc: DiemHocSinh.IDiemMonHoc[]) => {
        if (!diemMonHoc || diemMonHoc.length === 0) {
          return <Text type="secondary">Chưa có điểm</Text>;
        }

        const summary = diemMonHoc
          .slice(0, 3)
          .map((diem) => `${diem.mon} - HK${diem.hocKy}: ${diem.diemTongKet}`)
          .join(', ') + (diemMonHoc.length > 3 ? ', ...' : '');

        return (
          <Popover
            content={renderDiemMonHoc(diemMonHoc)}
            title="Chi tiết điểm môn học"
            trigger="click"
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '280px',
                cursor: 'pointer',
              }}
            >
              {summary}
            </div>
          </Popover>
        );
      },
    },
    {
      title: 'Loại hạnh kiểm',
      dataIndex: 'loaiHanhKiem',
      width: 150,
      sortable: true,
      filterType: 'select',
      filterIcon: [
        { text: 'Tốt', value: 'tốt' },
        { text: 'Khá', value: 'khá' },
        { text: 'Trung bình', value: 'trung bình' },
        { text: 'Yếu', value: 'yếu' },
        { text: 'Kém', value: 'kém' },
      ],
      render: (loai: DiemHocSinh.LoaiHanhKiem) => renderLoaiHanhKiem(loai),
    },
    {
      title: 'Minh chứng',
      dataIndex: 'minhChung',
      width: 200,
      filterType: 'string',
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 180 }}>
          {text}
        </Text>
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
            tooltip="Xem chi tiết"
            onClick={() => handleView(record)}
            type="link"
            icon={<EyeOutlined />}
          />
          <ButtonExtend
            tooltip="Chỉnh sửa"
            onClick={() => handleEdit(record)}
            type="link"
            icon={<EditOutlined />}
          />
          <Popconfirm
            onConfirm={() => deleteModel(record.id)}
            title="Bạn có chắc chắn muốn xóa bảng điểm này?"
            placement="topRight"
          >
            <ButtonExtend
              tooltip="Xóa"
              danger
              type="link"
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
        modelName="hocba"
        title="Quản lý Học Bạ"
        Form={DiemHocSinhForm}
        widthDrawer={800}
        buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
        deleteMany
        rowSelection
      />
    </div>
  );
};

export default DiemHocSinhPage;
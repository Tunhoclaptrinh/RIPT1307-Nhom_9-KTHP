import React from 'react';
import { Modal, Descriptions, Tag, Button, Typography, Card, Row, Col, Avatar, Space } from 'antd';
import { UserOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import useUsers from '@/hooks/useUsers';
import { ipLocal } from '@/utils/ip';
import { DiemHocSinh } from '../../../services/HocBa/typing'

interface Props {
  isVisible: boolean;
  onClose: () => void;
  record?: DiemHocSinh.IRecord;
  onEdit: () => void;
}

const { Text, Title } = Typography;

const renderLoaiHanhKiem = (loai?: DiemHocSinh.LoaiHanhKiem) => {
  const colorMap: { [key in DiemHocSinh.LoaiHanhKiem]: string } = {
    tốt: 'green',
    khá: 'blue',
    'trung bình': 'orange',
    yếu: 'red',
    kém: 'volcano',
  };
  return <Tag color={loai ? colorMap[loai] : 'default'}>{loai?.toUpperCase() || 'Không xác định'}</Tag>;
};

const renderXepLoaiHocLuc = (xepLoai?: string) => {
  const colorMap: { [key: string]: string } = {
    giỏi: 'gold',
    khá: 'blue',
    'trung bình': 'orange',
    yếu: 'red',
    kém: 'volcano',
  };
  return <Tag color={xepLoai ? colorMap[xepLoai] : 'default'}>{xepLoai?.toUpperCase() || 'Chưa xếp loại'}</Tag>;
};

const renderDiemMonHoc = (diemMonHoc: DiemHocSinh.IDiemMonHoc[]) => {
  if (!diemMonHoc?.length) {
    return (
      <div style={{ textAlign: 'center', padding: '16px' }}>
        <BookOutlined style={{ fontSize: '20px' }} />
        <div>Chưa có điểm môn học</div>
      </div>
    );
  }

  const diemTrungBinh = (diemMonHoc.reduce((sum, item) => sum + item.diemTongKet, 0) / diemMonHoc.length).toFixed(1);

  return (
    <div>
      <Title level={5}>Điểm trung bình: {diemTrungBinh}/10</Title>
      <Row gutter={[16, 16]}>
        {diemMonHoc.map((diem, idx) => (
          <Col span={12} key={idx}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Text strong>{diem.mon}</Text>
                  <br />
                  <Text type="secondary">Học kỳ {diem.hocKy}</Text>
                </div>
                <Text strong>{diem.diemTongKet}/10</Text>
              </div>
              {diem.ghiChu && <Text type="secondary">{diem.ghiChu}</Text>}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const HocBaDetail: React.FC<Props> = ({ isVisible, onClose, record, onEdit }) => {
  const { getUserFullName, getUserInfo, getUserById } = useUsers();

  if (!record) return null;

  const userInfo = getUserInfo(record.userId);
  const fullName = getUserFullName(record.userId);
  const userDetail = getUserById(record.userId);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOutlined style={{ color: '#1890ff', fontSize: '20px' }} />
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Chi tiết học bạ</span>
        </div>
      }
      visible={isVisible}
      onCancel={onClose}
      width={800}
      footer={[
        <div style={{ textAlign: 'center' }} key="footer">
          <Space>
            <Button type="primary" onClick={onEdit}>Chỉnh sửa</Button>
            <Button onClick={onClose}>Đóng</Button>
          </Space>
        </div>,
      ]}
    >
      <Card style={{ marginBottom: '16px', background: '#667eea' }}>
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={64} src={`${ipLocal}${userInfo?.avatar}`} icon={<UserOutlined />} />
          </Col>
          <Col flex={1}>
            <Title level={4} style={{ color: 'white', margin: 0 }}>{fullName}</Title>
            <div style={{ color: 'white' }}>
              <div>Mã học sinh: {record.userId}</div>
              {userInfo?.username && <div>@{userInfo.username}</div>}
              {userDetail?.soCCCD && <div>CCCD: {userDetail.soCCCD}</div>}
            </div>
          </Col>
          <Col>
            <div style={{ textAlign: 'right', color: 'white' }}>
              {record.namHoc && <div>Năm học: {record.namHoc}</div>}
              {record.khoiLop && <div>Khối: {record.khoiLop}</div>}
            </div>
          </Col>
        </Row>
      </Card>

      <Descriptions title={<><FileTextOutlined /> Thông tin học bạ</>} column={2} bordered>
        <Descriptions.Item label="ID học bạ">{record.id}</Descriptions.Item>
        <Descriptions.Item label="Loại hạnh kiểm">{renderLoaiHanhKiem(record.loaiHanhKiem)}</Descriptions.Item>
        <Descriptions.Item label="Xếp loại học lực">{renderXepLoaiHocLuc(record.xepLoaiHocLuc)}</Descriptions.Item>
      </Descriptions>

      <Card title={<><BookOutlined /> Điểm các môn học</>} style={{ marginTop: '16px' }}>
        {renderDiemMonHoc(record.diemMonHoc)}
      </Card>

      {(record.nhanXetGiaoVien || record.minhChung) && (
        <Card title={<><FileTextOutlined /> Nhận xét và đánh giá</>} style={{ marginTop: '16px' }}>
          {record.nhanXetGiaoVien && (
            <div style={{ marginBottom: '16px' }}>
              <Title level={5}>Nhận xét của giáo viên chủ nhiệm:</Title>
              <Text>{record.nhanXetGiaoVien}</Text>
            </div>
          )}
          {record.minhChung && (
            <div>
              <Title level={5}>Minh chứng và thành tích:</Title>
              <Text>{record.minhChung}</Text>
            </div>
          )}
        </Card>
      )}
    </Modal>
  );
};

export default HocBaDetail;
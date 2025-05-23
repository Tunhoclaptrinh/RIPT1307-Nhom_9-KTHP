import { Form, Input, Button, DatePicker, Select, message, Divider, Row, Col, Alert, Space } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import UploadFile from '@/components/Upload/UploadFile';
import { submitHoSo } from '@/services/XetTuyen';
import ModalThongTinHocTap from '../ModalThongTinHocTap';
import styles from './index.less';

const { Option } = Select;

interface XetTuyenFormProps {
  heDaoTao: any[];
  phuongThuc: any[];
  nganh: any[];
  toHop: any[];
  form: any;
  trangThaiHoSo: string;
  setTrangThaiHoSo: (status: string) => void;
}

const XetTuyenForm: React.FC<XetTuyenFormProps> = ({ 
  heDaoTao, 
  phuongThuc, 
  nganh, 
  toHop, 
  form,
  trangThaiHoSo,
  setTrangThaiHoSo
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [thongTinHocTap, setThongTinHocTap] = useState<any>(null);

  const handleSubmit = async (values: any) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const data = {
      thongTinCaNhanId: userInfo.id,
      thongTinLienHe: {
        ten: `${values.ho} ${values.ten}`,
        diaChi: {
          tinh_ThanhPho: values.tinhThanhPho,
          quanHuyen: values.quanHuyen,
          xaPhuong: values.xaPhuong,
          diaChiCuThe: values.diaChi,
        },
      },
      nguyenVong: {
        heDaoTao: values.heDaoTao,
        nganhDaoTao: values.nganhDaoTao,
        toHop: values.toHop,
        phuongThuc: values.phuongThuc,
      },
      thongTinHocTap: thongTinHocTap
    };
    try {
      await submitHoSo(data);
      message.success('Nộp hồ sơ thành công');
      setTrangThaiHoSo('Đã nộp');
    } catch (err) {
      message.error('Nộp hồ sơ thất bại');
    }
  };

  return (
    <div className={styles.main}>
      <Alert
        message="Trạng thái hồ sơ"
        description={trangThaiHoSo}
        type={trangThaiHoSo.includes('Đã nộp') ? 'success' : 'info'}
        showIcon
        style={{ marginBottom: 16 }}
      />
      <Divider />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col span={24} md={8}>
            <Form.Item label="Họ đệm" name="ho">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item label="Tên" name="ten">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item label="Ngày sinh" name="ngaySinh">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={24} md={8}>
            <Form.Item label="Giới tính" name="gioiTinh">
              <Select>
                <Option value="nam">Nam</Option>
                <Option value="nu">Nữ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item label="Email" name="email" rules={[{ type: 'email' }]}> 
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item label="Số điện thoại" name="soDT">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24} md={8}>
            <Form.Item label="Tỉnh/Thành phố" name="tinhThanhPho">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item label="Quận/Huyện" name="quanHuyen">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item label="Xã/Phường" name="xaPhuong">
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item label="Địa chỉ cụ thể" name="diaChi">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Nguyện vọng</Divider>
        <Form.Item label="Hệ đào tạo" name="heDaoTao">
          <Select>
            {heDaoTao.map(item => (
              <Option key={item.id} value={item.id}>{item.ten}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Ngành đào tạo" name="nganhDaoTao">
          <Select>
            {nganh.map(item => (
              <Option key={item.id} value={item.id}>{item.ten}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Tổ hợp xét tuyển" name="toHop">
          <Select>
            {toHop.map(item => (
              <Option key={item.id} value={item.id}>
                {item.id} - {item.monHoc.join(', ')}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Phương thức xét tuyển" name="phuongThuc">
          <Select>
            {phuongThuc.map(item => (
              <Option key={item.id} value={item.id}>{item.ten}</Option>
            ))}
          </Select>
        </Form.Item>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Button 
            type="dashed" 
            onClick={() => setModalVisible(true)}
            block
          >
            Nhập thông tin học tập
          </Button>
          <Button type="primary" htmlType="submit" block>
            Nộp hồ sơ
          </Button>
        </Space>
      </Form>

      <ModalThongTinHocTap
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={(values) => {
          setThongTinHocTap(values);
          setModalVisible(false);
        }}
        initialValues={thongTinHocTap}
      />
    </div>
  );
};

export default XetTuyenForm;

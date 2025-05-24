import { Form, Input, Button, DatePicker, Select, message, Divider, Row, Col, Alert, Space } from 'antd';
import { useEffect } from 'react';
import UploadFile from '@/components/Upload/UploadFile';
import { submitHoSo } from '@/services/XetTuyen';
import ModalThongTinHocTap from '../ModalThongTinHocTap';
import styles from './index.less';
import { useModel } from 'umi';

const { Option } = Select;

const XetTuyenForm = ({ heDaoTao, phuongThuc, nganh, toHop, form, trangThaiHoSo, setTrangThaiHoSo }: any) => {
const {
   modalVisible, 
   setModalVisible, 
   thongTinHocTap, 
   setThongTinHocTap, 
   provinces, 
   districts, 
   wards, 
   fetchProvinces, 
   fetchDistricts, 
   fetchWards
} = useModel('xettuyen');
  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleProvinceChange = (value: number) => {
    form.setFieldsValue({ quanHuyen: undefined, xaPhuong: undefined });
    fetchDistricts(value);
  };

  const handleDistrictChange = (value: number) => {
    form.setFieldsValue({ xaPhuong: undefined });
    fetchWards(value);
  };

  const handleSubmit = async (values: any) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const selectedProvince = provinces.find(p => p.id === values.tinhThanhPho)?.name;
    const selectedDistrict = districts.find(d => d.id === values.quanHuyen)?.name;
    const selectedWard = wards.find(w => w.id === values.xaPhuong)?.name;

    const data = {
      thongTinCaNhanId: userInfo.id,
      thongTinLienHe: {
        ten: `${values.ho} ${values.ten}`,
        diaChi: {
          tinh_ThanhPho: selectedProvince,
          quanHuyen: selectedDistrict,
          xaPhuong: selectedWard,
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
          <Col span={24} md={8}><Form.Item label="Họ đệm" name="ho"><Input /></Form.Item></Col>
          <Col span={24} md={8}><Form.Item label="Tên" name="ten"><Input /></Form.Item></Col>
          <Col span={24} md={8}><Form.Item label="Ngày sinh" name="ngaySinh"><DatePicker style={{ width: '100%' }} /></Form.Item></Col>

          <Col span={24} md={8}><Form.Item label="Giới tính" name="gioiTinh"><Select><Option value="nam">Nam</Option><Option value="nu">Nữ</Option></Select></Form.Item></Col>
          <Col span={24} md={8}><Form.Item label="Email" name="email" rules={[{ type: 'email' }]}><Input /></Form.Item></Col>
          <Col span={24} md={8}><Form.Item label="Số điện thoại" name="soDT"><Input /></Form.Item></Col>

          <Col span={24} md={8}><Form.Item label="Tỉnh/Thành phố" name="tinhThanhPho"><Select onChange={handleProvinceChange} placeholder="Chọn tỉnh">
            {provinces.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}</Select></Form.Item></Col>
          <Col span={24} md={8}><Form.Item label="Quận/Huyện" name="quanHuyen"><Select onChange={handleDistrictChange} placeholder="Chọn huyện">
            {districts.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}</Select></Form.Item></Col>
          <Col span={24} md={8}><Form.Item label="Xã/Phường" name="xaPhuong"><Select placeholder="Chọn xã">
            {wards.map(w => <Option key={w.id} value={w.id}>{w.name}</Option>)}</Select></Form.Item></Col>

          <Col span={24}><Form.Item label="Địa chỉ cụ thể" name="diaChi"><Input /></Form.Item></Col>
        </Row>

        <Divider>Nguyện vọng</Divider>
        <Form.Item label="Hệ đào tạo" name="heDaoTao"><Select>{heDaoTao.map(item => (<Option key={item.id} value={item.id}>{item.ten}</Option>))}</Select></Form.Item>
        <Form.Item label="Ngành đào tạo" name="nganhDaoTao"><Select>{nganh.map(item => (<Option key={item.id} value={item.id}>{item.ten}</Option>))}</Select></Form.Item>
        <Form.Item label="Tổ hợp xét tuyển" name="toHop"><Select>{toHop.map(item => (<Option key={item.id} value={item.id}>{item.id} - {item.monHoc.join(', ')}</Option>))}</Select></Form.Item>
        <Form.Item label="Phương thức xét tuyển" name="phuongThuc"><Select>{phuongThuc.map(item => (<Option key={item.id} value={item.id}>{item.ten}</Option>))}</Select></Form.Item>

        <Space direction="vertical" style={{ width: '100%' }}>
          <Button type="dashed" onClick={() => setModalVisible(true)} block>Nhập thông tin học tập</Button>
          <Button type="primary" htmlType="submit" block>Nộp hồ sơ</Button>
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

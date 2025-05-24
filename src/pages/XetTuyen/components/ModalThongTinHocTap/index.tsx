import { Modal, Form, Input, Button, Select, Row, Col, DatePicker, Upload, Divider } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useModel } from 'umi';
import { useEffect } from 'react';

const { Option } = Select;

interface ModalThongTinHocTapProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
  initialValues?: any;
}

const ModalThongTinHocTap: React.FC<ModalThongTinHocTapProps> = ({ 
  visible, 
  onCancel, 
  onOk,
  initialValues
}) => {
  const [form] = Form.useForm();
  const {
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

  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        onOk(values);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Thông tin học tập"
      visible={visible}
      onCancel={handleCancel}
      width={800}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Divider orientation="left">Thông tin THPT</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Tỉnh/Thành phố" name={['thongTinTHPT', 'tinh_ThanhPho']} >
              <Select onChange={handleProvinceChange} placeholder="Chọn tỉnh">
            {provinces.map(p => <Option key={p.id} value={p.id}>{p.name}</Option>)}</Select>  
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Quận/Huyện" name={['thongTinTHPT', 'quanHuyen']}>
            <Select onChange={handleDistrictChange} placeholder="Chọn huyện">
            {districts.map(d => <Option key={d.id} value={d.id}>{d.name}</Option>)}</Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Xã/Phường" name={['thongTinTHPT', 'xaPhuong']}>
              <Select placeholder="Chọn xã">
            {wards.map(w => <Option key={w.id} value={w.id}>{w.name}</Option>)}</Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa chỉ" name={['thongTinTHPT', 'diaChi']}>
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Mã trường" name={['thongTinTHPT', 'maTruong']}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Mã tỉnh" name={['thongTinTHPT', 'maTinh']}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Đã tốt nghiệp" name={['thongTinTHPT', 'daTotNghiep']} valuePropName="checked">
              <Select>
                <Option value={true}>Đã tốt nghiệp</Option>
                <Option value={false}>Chưa tốt nghiệp</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Đối tượng ưu tiên" name={['thongTinTHPT', 'doiTuongUT']}>
              <Select>
                <Option value="hộ nghèo">Hộ nghèo</Option>
                <Option value="dân tộc thiểu số">Dân tộc thiểu số</Option>
                <Option value="khuyết tật">Khuyết tật</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Khu vực ưu tiên" name={['thongTinTHPT', 'khuVucUT']}>
              <Select>
                <Option value="kv1">KV1</Option>
                <Option value="kv2">KV2</Option>
                <Option value="kv3">KV3</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Năm tốt nghiệp" name={['thongTinTHPT', 'namTotNghiep']}>
          <DatePicker picker="year" style={{ width: '100%' }} />
        </Form.Item>

        <Divider orientation="left">Điểm THPT</Divider>
        <Form.List name="diemTHPT">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={16} key={key}>
                  <Col span={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'mon']}
                      label="Môn học"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="toán">Toán</Option>
                        <Option value="lý">Lý</Option>
                        <Option value="hóa">Hóa</Option>
                        <Option value="văn">Văn</Option>
                        <Option value="anh">Anh</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'diem']}
                      label="Điểm"
                      rules={[{ required: true, message: 'Vui lòng nhập điểm' }]}
                    >
                      <Input type="number" min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(name)}
                      style={{ marginTop: 30 }}
                    >
                      Xóa
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Thêm môn học
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider orientation="left">Chứng chỉ</Divider>
        <Form.List name="chungChi">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={16} key={key}>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'loaiCC']}
                      label="Loại chứng chỉ"
                      rules={[{ required: true }]}
                    >
                      <Select>
                        <Option value="tiếng anh">Tiếng Anh</Option>
                        <Option value="tin học">Tin học</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'ketQua']}
                      label="Kết quả"
                      rules={[{ required: true }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'minhChung']}
                      label="Minh chứng"
                    >
                      <Upload>
                        <Button icon={<UploadOutlined />}>Tải lên</Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button
                      type="link"
                      danger
                      onClick={() => remove(name)}
                      style={{ marginTop: 30 }}
                    >
                      Xóa
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Thêm chứng chỉ
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default ModalThongTinHocTap;

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import { HoSo } from '@/services/HoSo/typing';
import { Space } from 'antd';
import UploadFile from '@/components/Upload/UploadFile';
const { Option } = Select;

interface HoSoFormProps {
  title?: string;
  [key: string]: any;
}

const HoSoForm: React.FC<HoSoFormProps> = ({ title = 'hồ sơ' }) => {
  const { record, setVisibleForm, edit, postModel, putModel,  visibleForm } = useModel('hoso');
    const { postAvatar } = useModel('users');
  
  const [form] = Form.useForm();
  const intl = useIntl();

  // State for address selection
  const [selectedProvince, setSelectedProvince] = useState<string>();
  const [selectedDistrict, setSelectedDistrict] = useState<string>();
  const [selectedWard, setSelectedWard] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  // Reset form and update values when record changes
  useEffect(() => {
    if (!visibleForm) {
      resetFieldsForm(form);
      setSelectedProvince(undefined);
      setSelectedDistrict(undefined);
      setSelectedWard(undefined);
    } else if (record?.id) {
      const formData = {
        ...record,
        thongTinLienHe: {
          ...record.thongTinLienHe,
          diaChi: record.thongTinLienHe?.diaChi || {},
        },
        thongTinBoSung: {
          ...record.thongTinBoSung,
          noiSinh: record.thongTinBoSung?.noiSinh || {},
        },
      };
      form.setFieldsValue(formData);

      // Update address state
      setSelectedProvince(record.thongTinLienHe?.diaChi?.tinh_ThanhPho);
      setSelectedDistrict(record.thongTinLienHe?.diaChi?.quanHuyen);
      setSelectedWard(record.thongTinLienHe?.diaChi?.xaPhuong);
    }
  }, [record?.id, visibleForm, form]);

  // Handle form submission
  const onFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const submitData: HoSo.IRecord = {
        ...values,
        thongTinLienHe: {
          ...values.thongTinLienHe,
          diaChi: {
            tinh_ThanhPho: values.thongTinLienHe?.diaChi?.tinh_ThanhPho,
            quanHuyen: values.thongTinLienHe?.diaChi?.quanHuyen,
            xaPhuong: values.thongTinLienHe?.diaChi?.xaPhuong,
            diaChiCuThe: values.thongTinLienHe?.diaChi?.diaChiCuThe,
          },
        },
				avatar: undefined,
        thongTinBoSung: {
          ...values.thongTinBoSung,
          noiSinh: {
            trongNuoc: values.thongTinBoSung?.noiSinh?.trongNuoc,
            tinh_ThanhPho: values.thongTinBoSung?.noiSinh?.tinh_ThanhPho,
          },
        },
      };
      let userId: string;
			if (edit) {
				if (!record?.id) {
					throw new Error('Record ID is required for editing');
				}
				userId = record.id;
				await putModel(userId, submitData);
			} else {
				const response = await postModel(submitData);
				userId = response.id;
			}


			if (values.avatar) {
				await postAvatar(userId, values.avatar);
			}
      if (edit) {
        await putModel(record?.id ?? '', submitData);
      } else {
        await postModel(submitData);
      }
      setVisibleForm(false);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    form.setFieldsValue({
      thongTinLienHe: {
        ...form.getFieldValue('thongTinLienHe'),
        diaChi: {
          ...form.getFieldValue('thongTinLienHe')?.diaChi,
          tinh_ThanhPho: value,
          quanHuyen: undefined,
          xaPhuong: undefined,
        },
      },
    });
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedWard(undefined);
    form.setFieldsValue({
      thongTinLienHe: {
        ...form.getFieldValue('thongTinLienHe'),
        diaChi: {
          ...form.getFieldValue('thongTinLienHe')?.diaChi,
          quanHuyen: value,
          xaPhuong: undefined,
        },
      },
    });
  };

  const handleWardChange = (value: string) => {
    setSelectedWard(value);
    form.setFieldsValue({
      thongTinLienHe: {
        ...form.getFieldValue('thongTinLienHe'),
        diaChi: {
          ...form.getFieldValue('thongTinLienHe')?.diaChi,
          xaPhuong: value,
        },
      },
    });
  };

  return (
    <div>
      <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Row gutter={[16, 0]} style={{ marginBottom: 16 }}>
            <Col span={24}>
              <Form.Item
                label="Họ và tên"
                name={['thongTinLienHe', 'ten']}
                rules={[...rules.required]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: 16 }}>
						<Col span={24}>
							<Form.Item label='Ảnh đại diện' name='avatar'>
								<UploadFile
									isAvatar 
									maxFileSize={5} 
									buttonDescription="Tải lên ảnh đại diện"
								/>
							</Form.Item>
						</Col>
					</Row>
          <Card title="Thông tin bổ sung" style={{ marginTop: 16, border: 'none' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Dân tộc"
                  name={['thongTinBoSung', 'danToc']}
                  rules={[...rules.required]}
                >
                  <Select placeholder="Chọn dân tộc">
                    <Option value="kinh">Kinh</Option>
                    <Option value="mông">Mông</Option>
                    <Option value="mèo">Mèo</Option>
                    <Option value="khác">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Quốc tịch"
                  name={['thongTinBoSung', 'quocTich']}
                  rules={[...rules.required]}
                >
                  <Select placeholder="Chọn quốc tịch">
                    <Option value="Việt Nam">Việt Nam</Option>
                    <Option value="Lào">Lào</Option>
                    <Option value="Campuchia">Campuchia</Option>
                    <Option value="khác">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tôn giáo"
                  name={['thongTinBoSung', 'tonGiao']}
                  rules={[...rules.required]}
                >
                  <Select placeholder="Chọn tôn giáo">
                    <Option value="không">Không</Option>
                    <Option value="Thiên Chúa giáo">Thiên Chúa giáo</Option>
                    <Option value="Phật giáo">Phật giáo</Option>
                    <Option value="khác">Khác</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Nơi sinh (Trong nước)"
                  name={['thongTinBoSung', 'noiSinh', 'trongNuoc']}
                  rules={[...rules.required]}
                >
                  <Select placeholder="Chọn nơi sinh">
                    <Option value={true}>Trong nước</Option>
                    <Option value={false}>Nước ngoài</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Tỉnh/Thành phố (Nơi sinh)"
              name={['thongTinBoSung', 'noiSinh', 'tinh_ThanhPho']}
              rules={[...rules.required]}
            >
              <Input placeholder="Nhập tỉnh/thành phố nơi sinh" />
            </Form.Item>
          </Card>

          <Card title="Địa chỉ liên hệ" style={{ marginTop: 16, border: 'none' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tỉnh/Thành phố"
                  name={['thongTinLienHe', 'diaChi', 'tinh_ThanhPho']}
                  rules={[...rules.required]}
                >
                  <ProvincesSelect
                    placeholder="Chọn tỉnh/thành phố"
                    onChange={handleProvinceChange}
                    value={selectedProvince}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Quận/Huyện"
                  name={['thongTinLienHe', 'diaChi', 'quanHuyen']}
                //   rules={[...rules.required]}
                >
                  <DistrictsSelect
                    provinceCode={selectedProvince}
                    placeholder="Chọn quận/huyện"
                    onChange={handleDistrictChange}
                    value={selectedDistrict}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Xã/Phường"
                  name={['thongTinLienHe', 'diaChi', 'xaPhuong']}
                //   rules={[...rules.required]}
                >
                  <WardsSelect
                    districtCode={selectedDistrict}
                    placeholder="Chọn xã/phường"
                    onChange={handleWardChange}
                    value={selectedWard}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Địa chỉ cụ thể"
                  name={['thongTinLienHe', 'diaChi', 'diaChiCuThe']}
                  rules={[...rules.required]}
                >
                  <Input placeholder="Nhập số nhà, tên đường..." />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          <div className="form-actions" style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button loading={submitting} htmlType="submit" type="primary">
                {!edit
                  ? intl.formatMessage({ id: 'global.button.themmoi' })
                  : intl.formatMessage({ id: 'global.button.luulai' })}
              </Button>
              <Button onClick={() => setVisibleForm(false)}>
                {intl.formatMessage({ id: 'global.button.huy' })}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default HoSoForm;
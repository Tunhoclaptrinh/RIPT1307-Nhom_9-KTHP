import React from 'react';
import { Button, Card, Form, Input, InputNumber } from 'antd';
import { useModel, useIntl } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Space } from 'antd';

interface ThongTinNguyenVongFormProps {
  title?: string;
}

const ThongTinNguyenVongForm: React.FC<ThongTinNguyenVongFormProps> = ({ title = 'thông tin nguyện vọng' }) => {
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('thongtinnguyenvong');
  const [form] = Form.useForm();
  const intl = useIntl();

  // Reset form when closing/opening form
  React.useEffect(() => {
    if (!visibleForm) {
      resetFieldsForm(form);
    } else if (record?.id) {
      form.setFieldsValue(record);
    }
  }, [record?.id, visibleForm]);

  const onFinish = async (values: ThongTinNguyenVong.IRecord) => {
    try {
      if (edit) {
        await putModel(record?.id ?? '', values);
      } else {
        await postModel(values);
      }
      setVisibleForm(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div>
      <Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
        <Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
          <Form.Item
            label='Thứ tự nguyện vọng'
            name='thuTuNV'
            rules={[...rules.required]}
          >
            <InputNumber
              min={1}
              placeholder='Nhập thứ tự nguyện vọng'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label='Tên nguyện vọng'
            name='ten'
            rules={[...rules.required]}
          >
            <Input placeholder='Nhập tên nguyện vọng' />
          </Form.Item>

          <Form.Item
            label='Phương thức ID'
            name='phuongThucId'
            rules={[...rules.required]}
          >
            <Input placeholder='Nhập ID phương thức xét tuyển' />
          </Form.Item>

          <Form.Item
            label='Điểm chưa ưu tiên'
            name='diemChuaUT'
            rules={[...rules.required]}
          >
            <InputNumber
              min={0}
              step={0.1}
              placeholder='Nhập điểm chưa ưu tiên'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label='Điểm có ưu tiên'
            name='diemCoUT'
            rules={[...rules.required]}
          >
            <InputNumber
              min={0}
              step={0.1}
              placeholder='Nhập điểm có ưu tiên'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label='Điểm đối tượng ưu tiên'
            name='diemDoiTuongUT'
          >
            <InputNumber
              min={0}
              step={0.1}
              placeholder='Nhập điểm đối tượng ưu tiên (tùy chọn)'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label='Điểm khu vực ưu tiên'
            name='diemKhuVucUT'
          >
            <InputNumber
              min={0}
              step={0.1}
              placeholder='Nhập điểm khu vực ưu tiên (tùy chọn)'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label='Tổng điểm'
            name='tongDiem'
            rules={[...rules.required]}
          >
            <InputNumber
              min={0}
              step={0.1}
              placeholder='Nhập tổng điểm'
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label='Phương thức xét tuyển'
            name='phuongThucXT'
          >
            <Input
              placeholder='Nhập danh sách phương thức xét tuyển (tùy chọn, cách nhau bằng dấu phẩy)'
            />
          </Form.Item>
          <div className="form-actions" style={{ marginTop: 24, textAlign: 'center' }}>
              <Space>
                  <Button loading={formSubmiting} htmlType="submit" type="primary">
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

export default ThongTinNguyenVongForm;
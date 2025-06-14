import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Space } from 'antd';
import ToHopSelect from '@/pages/ToHop/components/Select';
import { NganhDaoTao } from '@/services/NganhDaoTao/typing';


interface NganhDaoTaoFormProps {
  title?: string;
}

const NganhDaoTaoForm: React.FC<NganhDaoTaoFormProps> = ({ title = 'ngành đào tạo' }) => {
  const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('nganhdaotao');
  const [form] = Form.useForm();
  const intl = useIntl();

  // Reset form when visibility changes or record is updated
  React.useEffect(() => {
    if (!visibleForm) {
      resetFieldsForm(form);
    } else if (record?.id) {
      form.setFieldsValue(record);
    }
  }, [record?.id, visibleForm, form]);

  const onFinish = async (values: NganhDaoTao.IRecord) => {
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
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Mã ngành đào tạo"
            name="ma"
            rules={[...rules.required]}
          >
            <Input placeholder="Nhập mã ngành đào tạo" />
          </Form.Item>

          <Form.Item
            label="Tên ngành đào tạo"
            name="ten"
            rules={[...rules.required]}
          >
            <Input placeholder="Nhập tên ngành đào tạo" />
          </Form.Item>

          <Form.Item
            label="Mô tả ngành đào tạo"
            name="moTa"
            // rules={[...rules.required]} // Commented out as in original code
          >
            <Input.TextArea
              placeholder="Nhập mô tả ngành đào tạo"
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="Tổ hợp xét tuyển"
            name="toHopXetTuyenId"
            rules={[...rules.required]} // Added required rule for consistency
          >
            <ToHopSelect placeholder="Chọn tổ hợp xét tuyển" />
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

export default NganhDaoTaoForm;
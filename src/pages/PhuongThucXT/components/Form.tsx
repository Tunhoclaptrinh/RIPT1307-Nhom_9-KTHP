import React from 'react';
import { Button, Card, Form, Input,Space } from 'antd';
import {  useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

interface PhuongThucXTFormProps {
    title?: string;
}

const PhuongThucXTForm: React.FC<PhuongThucXTFormProps> = ({ title = 'phương thức xét tuyển' }) => {
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('phuongthucxt');
    const [form] = Form.useForm();

    // Reset form khi đóng/mở form
    React.useEffect(() => {
        if (!visibleForm) {
            resetFieldsForm(form);
        } else if (record?.id) {
            form.setFieldsValue(record);
        }
    }, [record?.id, visibleForm]);

    const onFinish = async (values: PhuongThucXT.IRecord) => {
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
                    <Form.Item label='Tên phương thức xét tuyển' name='ten' rules={[...rules.required]}>
                        <Input placeholder='Nhập tên phương thức xét tuyển' />
                    </Form.Item>

                    <Form.Item label='Nguyên tắc xét tuyển' name='nguyenTac' rules={[...rules.required]}>
                        <Input.TextArea placeholder='Nhập nguyên tắc xét tuyển' rows={3} />
                    </Form.Item>

                    <div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
                        <Space>
                            <Button loading={formSubmiting} type='primary' htmlType='submit'>
                            {!edit ? 'Thêm mới' : 'Cập nhật'}
                            </Button>
                            <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
                        </Space>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default PhuongThucXTForm;
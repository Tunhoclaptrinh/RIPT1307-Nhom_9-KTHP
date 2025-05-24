import React from 'react';
import { Button, Card, Form, Input, DatePicker, Switch, InputNumber } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface ThongBaoTSFormProps {
    title?: string;
}

const ThongBaoTSForm: React.FC<ThongBaoTSFormProps> = ({ title = 'Thông báo tuyển sinh' }) => {
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('thongbaots');
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (!visibleForm) {
            resetFieldsForm(form);
        } else if (record?.id) {
            form.setFieldsValue({
                ...record,
                date: record.date ? moment(record.date, 'DD/MM/YYYY') : null,
            });
        }
    }, [record?.id, visibleForm]);

    const onFinish = async (values: any) => {
        try {
            const submitValues = {
                ...values,
                date: values.date ? values.date.format('DD/MM/YYYY') : '',
            };
            if (edit) {
                await putModel(record?.id ?? '', submitValues);
            } else {
                await postModel(submitValues);
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
                    <Form.Item label='Tiêu đề' name='title' rules={[...rules.required]}>
                        <Input placeholder='Nhập tiêu đề' />
                    </Form.Item>
                    <Form.Item label='Ngày đăng' name='date' rules={[...rules.required]}>
                        <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày đăng' />
                    </Form.Item>
                    <Form.Item label='Tóm tắt' name='summary' rules={[...rules.required]}>
                        <Input.TextArea placeholder='Nhập tóm tắt' autoSize={{ minRows: 2 }} />
                    </Form.Item>
                    <Form.Item label='Nội dung' name='content' rules={[...rules.required]}>
                        <Input.TextArea placeholder='Nhập nội dung' autoSize={{ minRows: 4 }} />
                    </Form.Item>
                    <Form.Item label='Ưu tiên' name='priority' rules={[...rules.required]}>
                        <InputNumber min={1} max={10} style={{ width: '100%' }} placeholder='Nhập mức ưu tiên' />
                    </Form.Item>
                    <Form.Item label='Trạng thái' name='isActive' valuePropName='checked'>
                        <Switch checkedChildren='Hiển thị' unCheckedChildren='Ẩn' />
                    </Form.Item>
                    <div className='form-actions' style={{ marginTop: 24, textAlign: 'right' }}>
                        <Button.Group>
                            <Button loading={formSubmiting} type='primary' htmlType='submit'>
                                {!edit ? 'Thêm mới' : 'Cập nhật'}
                            </Button>
                            <Button onClick={() => setVisibleForm(false)}>Hủy</Button>
                        </Button.Group>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default ThongBaoTSForm;
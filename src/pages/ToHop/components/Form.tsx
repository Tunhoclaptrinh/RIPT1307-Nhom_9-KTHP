import React from 'react';
import { Button, Card, Form, Input,Space,  } from 'antd';
import {  useModel, useIntl } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

interface ToHopFormProps {
    title?: string;
}

const ToHopForm: React.FC<ToHopFormProps> = ({ title = 'tổ hợp môn học' }) => {
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('tohop');
    const [form] = Form.useForm();
    const intl = useIntl();

    // Reset form khi đóng/mở form
    React.useEffect(() => {
        if (!visibleForm) {
            resetFieldsForm(form);
        } else if (record?.id) {
            // Nếu record.monHoc là mảng, chuyển thành chuỗi nhiều dòng để hiển thị lên form
            form.setFieldsValue({
                ...record,
                monHoc: Array.isArray(record.monHoc) ? record.monHoc.join('\n') : record.monHoc,
            });
        }
    }, [record?.id, visibleForm]);

    const onFinish = async (values: any) => {
        try {
            // Chuyển monHoc từ chuỗi nhiều dòng sang mảng
            const submitValues = {
                ...values,
                monHoc: values.monHoc
                    .split('\n')
                    .map((item: string) => item.trim())
                    .filter((item: string) => item),
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
                    <Form.Item label='Mã tổ hợp' name='id' rules={[...rules.required]}>
                        <Input placeholder='Nhập mã tổ hợp' />
                    </Form.Item>

                    <Form.Item
                        label='Môn học'
                        name='monHoc'
                        rules={[...rules.required]}
                        tooltip="Mỗi dòng là một môn học (VD: Toán↵Lý↵Hóa)"
                    >
                        <Input.TextArea placeholder='Nhập mỗi môn học trên một dòng' autoSize={{ minRows: 3 }} />
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

export default ToHopForm;
import React from 'react';
import { Button, Card, Form, Input, DatePicker, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface HuongDanHSFormProps {
    title?: string;
}

const HuongDanHSForm: React.FC<HuongDanHSFormProps> = ({ title = 'Hướng dẫn hồ sơ' }) => {
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, ...rest } = useModel('huongdanhs');
    const categories: string[] = (rest as any).categories || [];
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState<any[]>([]);

    React.useEffect(() => {
        if (!visibleForm) {
            resetFieldsForm(form);
            setFileList([]);
        } else if (record?.id) {
            form.setFieldsValue({
                ...record,
                date: record.date ? moment(record.date, 'DD/MM/YYYY') : null,
            });
            if (record.fileUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: record.title,
                        status: 'done',
                        url: record.fileUrl,
                    },
                ]);
            }
        }
    }, [record?.id, visibleForm]);

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const onFinish = async (values: any) => {
        try {
            let fileUrl = record?.fileUrl || '';
            let fileSize = record?.fileSize || '';
            if (values.file && values.file.length > 0 && values.file[0].originFileObj) {
                // Upload file logic here, set fileUrl and fileSize after upload
                // For demo, just set dummy values
                fileUrl = 'uploaded/file/url';
                fileSize = values.file[0].originFileObj.size.toString();
            }
            const submitValues = {
                ...values,
                date: values.date ? values.date.format('DD/MM/YYYY') : '',
                fileUrl,
                fileSize,
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
                    <Form.Item label='Danh mục' name='category' rules={[...rules.required]}>
                        <Select placeholder='Chọn danh mục'>
                            {(categories || []).map((cat: string) => (
                                <Select.Option key={cat} value={cat}>{cat}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label='Tóm tắt' name='summary' rules={[...rules.required]}>
                        <Input.TextArea placeholder='Nhập tóm tắt' autoSize={{ minRows: 2 }} />
                    </Form.Item>
                    <Form.Item label='Ngày đăng' name='date' rules={[...rules.required]}>
                        <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày đăng' />
                    </Form.Item>
                    <Form.Item
                        label='Tệp hướng dẫn'
                        name='file'
                        valuePropName='fileList'
                        getValueFromEvent={normFile}
                        extra='Chỉ nhận file PDF, DOC, DOCX'
                        rules={[...rules.required]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            accept='.pdf,.doc,.docx'
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Chọn tệp</Button>
                        </Upload>
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

export default HuongDanHSForm;
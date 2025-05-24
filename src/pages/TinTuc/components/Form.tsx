import React from 'react';
import { Button, Card, Form, Input, DatePicker, Select, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface TinTucFormProps {
    title?: string;
}

const TinTucForm: React.FC<TinTucFormProps> = ({ title = 'Tin tức' }) => {
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('tintuc');
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
            if (record.imageUrl) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'Ảnh hiện tại',
                        status: 'done',
                        url: record.imageUrl,
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
            let imageUrl = record?.imageUrl || '';
            if (values.image && values.image.length > 0 && values.image[0].originFileObj) {
                // Upload logic ở đây, demo chỉ lấy URL tạm
                imageUrl = 'uploaded/image/url';
            }
            const submitValues = {
                ...values,
                date: values.date ? values.date.format('DD/MM/YYYY') : '',
                imageUrl,
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
                    <Form.Item label='Tóm tắt' name='summary' rules={[...rules.required]}>
                        <Input.TextArea placeholder='Nhập tóm tắt' autoSize={{ minRows: 2 }} />
                    </Form.Item>
                    <Form.Item label='Nội dung' name='content' rules={[...rules.required]}>
                        <Input.TextArea placeholder='Nhập nội dung' autoSize={{ minRows: 4 }} />
                    </Form.Item>
                    <Form.Item label='Ngày đăng' name='date' rules={[...rules.required]}>
                        <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày đăng' />
                    </Form.Item>
                    <Form.Item label='Tác giả' name='author' rules={[...rules.required]}>
                        <Input placeholder='Nhập tên tác giả' />
                    </Form.Item>
                    <Form.Item label='Danh mục' name='category' rules={[...rules.required]}>
                        <Select placeholder='Chọn danh mục'>
                            <Select.Option value='thi-cu'>Thi cử</Select.Option>
                            <Select.Option value='tuyen-sinh'>Tuyển sinh</Select.Option>
                            <Select.Option value='hoc-tap'>Học tập</Select.Option>
                            <Select.Option value='su-kien'>Sự kiện</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label='Nổi bật' name='featured' valuePropName='checked'>
                        <Switch checkedChildren='Nổi bật' unCheckedChildren='Thường' />
                    </Form.Item>
                    <Form.Item
                        label='Ảnh đại diện'
                        name='image'
                        valuePropName='fileList'
                        getValueFromEvent={normFile}
                        extra='Chỉ nhận file ảnh JPG, PNG'
                        rules={[...rules.required]}
                    >
                        <Upload
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            accept='.jpg,.jpeg,.png'
                            maxCount={1}
                            listType='picture'
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
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

export default TinTucForm;
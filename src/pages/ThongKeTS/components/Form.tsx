import React from 'react';
import { Button, Card, Form, InputNumber, DatePicker } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface ThongKeTSFormProps {
    title?: string;
}

const ThongKeTSForm: React.FC<ThongKeTSFormProps> = ({ title = 'Thống kê tuyển sinh' }) => {
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('thongkets');
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (!visibleForm) {
            resetFieldsForm(form);
        } else if (record?.id) {
            form.setFieldsValue({
                ...record,
                lastUpdated: record.lastUpdated ? moment(record.lastUpdated, 'DD/MM/YYYY') : null,
            });
        }
    }, [record?.id, visibleForm]);

    const onFinish = async (values: any) => {
        try {
            const submitValues = {
                ...values,
                lastUpdated: values.lastUpdated ? values.lastUpdated.format('DD/MM/YYYY') : '',
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
                    <Form.Item label='Năm' name='year' rules={[...rules.required]}>
                        <InputNumber min={2000} max={2100} style={{ width: '100%' }} placeholder='Nhập năm' />
                    </Form.Item>
                    <Form.Item label='Số trường ĐH' name='soTruongDaiHoc' rules={[...rules.required]}>
                        <InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số trường ĐH' />
                    </Form.Item>
                    <Form.Item label='Số ngành đào tạo' name='soNganhDaoTao' rules={[...rules.required]}>
                        <InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số ngành đào tạo' />
                    </Form.Item>
                    <Form.Item label='Số thí sinh đăng ký' name='soThiSinhDangKy' rules={[...rules.required]}>
                        <InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số thí sinh đăng ký' />
                    </Form.Item>
                    <Form.Item label='Tỷ lệ hồ sơ trực tuyến (%)' name='tyLeHoSoTrucTuyen' rules={[...rules.required]}>
                        <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder='Nhập tỷ lệ (%)' />
                    </Form.Item>
                    <Form.Item label='Cập nhật lần cuối' name='lastUpdated' rules={[...rules.required]}>
                        <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày cập nhật' />
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

export default ThongKeTSForm;
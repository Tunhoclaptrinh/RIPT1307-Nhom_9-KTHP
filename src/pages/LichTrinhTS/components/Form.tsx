import React from 'react';
import { Button, Card, Form, Input, DatePicker, Select } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface LichTrinhTSFormProps {
    title?: string;
}

const LichTrinhTSForm: React.FC<LichTrinhTSFormProps> = ({ title = 'Lịch trình tuyển sinh' }) => {
    const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('lichtrinhts');
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (!visibleForm) {
            resetFieldsForm(form);
        } else if (record?.id) {
            form.setFieldsValue({
                ...record,
                startDate: record.startDate ? moment(record.startDate, 'DD/MM/YYYY') : null,
                endDate: record.endDate ? moment(record.endDate, 'DD/MM/YYYY') : null,
            });
        }
    }, [record?.id, visibleForm]);

    // Thêm validation cho ngày tháng
    const validateEndDate = (_: any, value: any) => {
        const startDate = form.getFieldValue('startDate');
        if (value && startDate && value.isBefore(startDate)) {
            return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
        }
        return Promise.resolve();
    };

    const onFinish = async (values: any) => {
        try {
            const submitValues = {
                ...values,
                startDate: values.startDate ? values.startDate.format('DD/MM/YYYY') : '',
                endDate: values.endDate ? values.endDate.format('DD/MM/YYYY') : '',
                // Thêm field icon mặc định nếu không có
                icon: values.icon || 'calendar',
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
                    
                    <Form.Item label='Ngày bắt đầu' name='startDate' rules={[...rules.required]}>
                        <DatePicker 
                            format='DD/MM/YYYY' 
                            style={{ width: '100%' }} 
                            placeholder='Chọn ngày bắt đầu'
                            onChange={() => form.validateFields(['endDate'])} // Re-validate endDate khi startDate thay đổi
                        />
                    </Form.Item>
                    
                    <Form.Item 
                        label='Ngày kết thúc' 
                        name='endDate' 
                        rules={[...rules.required, { validator: validateEndDate }]}
                    >
                        <DatePicker 
                            format='DD/MM/YYYY' 
                            style={{ width: '100%' }} 
                            placeholder='Chọn ngày kết thúc' 
                        />
                    </Form.Item>
                    
                    <Form.Item label='Mô tả' name='description' rules={[...rules.required]}>
                        <Input.TextArea placeholder='Nhập mô tả' autoSize={{ minRows: 2 }} />
                    </Form.Item>
                    
                    <Form.Item label='Loại sự kiện' name='type' rules={[...rules.required]}>
                        <Select placeholder='Chọn loại sự kiện'>
                            <Select.Option value='dangky'>Đăng ký</Select.Option>
                            <Select.Option value='ketqua'>Kết quả</Select.Option>
                            <Select.Option value='nhaphoc'>Nhập học</Select.Option>
                        </Select>
                    </Form.Item>
                    
                    <Form.Item label='Trạng thái' name='status' rules={[...rules.required]}>
                        <Select placeholder='Chọn trạng thái'>
                            <Select.Option value='upcoming'>Sắp diễn ra</Select.Option>
                            <Select.Option value='ongoing'>Đang diễn ra</Select.Option>
                            <Select.Option value='completed'>Đã hoàn thành</Select.Option>
                        </Select>
                    </Form.Item>

                    {/* Thêm field icon (optional) */}
                    <Form.Item label='Icon' name='icon'>
                        <Select placeholder='Chọn icon (tùy chọn)' allowClear>
                            <Select.Option value='calendar'>Calendar</Select.Option>
                            <Select.Option value='check-circle'>Check Circle</Select.Option>
                            <Select.Option value='user'>User</Select.Option>
                            <Select.Option value='trophy'>Trophy</Select.Option>
                            <Select.Option value='book'>Book</Select.Option>
                        </Select>
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

export default LichTrinhTSForm;
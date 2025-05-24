import React from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

interface FAQFormProps {
	title?: string;
}

const FAQForm: React.FC<FAQFormProps> = ({ title = 'Câu hỏi thường gặp' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('faq');
	const [form] = Form.useForm();

	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?.id) {
			form.setFieldsValue({
				...record,
			});
		}
	}, [record?.id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			const submitValues = {
				...values,
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
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item label='Câu hỏi' name='question' rules={[...rules.required]}>
								<Input placeholder='Nhập câu hỏi' />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item label='Trả lời' name='answer' rules={[...rules.required]}>
								<Input.TextArea placeholder='Nhập câu trả lời' autoSize={{ minRows: 3 }} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item label='Danh mục' name='category' rules={[...rules.required]}>
								<Select placeholder='Chọn danh mục'>
									<Select.Option value='dangky'>Đăng ký</Select.Option>
									<Select.Option value='hoso'>Hồ sơ</Select.Option>
									<Select.Option value='thoihan'>Thời hạn</Select.Option>
									<Select.Option value='ketqua'>Kết quả</Select.Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item label='Trạng thái' name='isActive' valuePropName='checked'>
								<Switch checkedChildren='Hiển thị' unCheckedChildren='Ẩn' />
							</Form.Item>
						</Col>
					</Row>
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

export default FAQForm;

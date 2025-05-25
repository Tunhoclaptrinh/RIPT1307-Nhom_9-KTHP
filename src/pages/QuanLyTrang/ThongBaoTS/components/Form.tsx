import React from 'react';
import { Button, Card, Form, Input, DatePicker, Switch, InputNumber, Space, Row, Col } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface ThongBaoTSFormProps {
	title?: string;
}

const ThongBaoTSForm: React.FC<ThongBaoTSFormProps> = ({ title = 'Thông báo tuyển sinh' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('quanlytrang.thongbaots');
	const [form] = Form.useForm();
	const intl = useIntl();

	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?.id) {
			form.setFieldsValue({
				...record,
				date: record.date ? moment(record.date, 'DD/MM/YYYY') : null,
			});
		}
	}, [record?.id, visibleForm, form]);

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
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
			<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12}>
						<Form.Item label='Tiêu đề' name='title' rules={[...rules.required]}>
							<Input placeholder='Nhập tiêu đề' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item label='Ngày đăng' name='date' rules={[...rules.required]}>
							<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày đăng' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12}>
						<Form.Item label='Ưu tiên' name='priority' rules={[...rules.required]}>
							<InputNumber min={1} max={10} style={{ width: '100%' }} placeholder='Nhập mức ưu tiên' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item label='Trạng thái' name='isActive' valuePropName='checked'>
							<Switch />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label='Tóm tắt' name='summary' rules={[...rules.required]}>
					<Input.TextArea placeholder='Nhập tóm tắt' autoSize={{ minRows: 2 }} />
				</Form.Item>

				<Form.Item label='Nội dung' name='content' rules={[...rules.required]}>
					<Input.TextArea placeholder='Nhập nội dung' autoSize={{ minRows: 4 }} />
				</Form.Item>

				<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
					<Space>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'global.button.themmoi' })
								: intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</Space>
				</div>
			</Form>
		</Card>
	);
};

export default ThongBaoTSForm;

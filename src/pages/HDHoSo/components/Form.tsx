import React from 'react';
import { Button, Card, Form, Input, DatePicker, Select, Space, Row, Col } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';
import UploadFile from '../../../components/Upload/UploadFile'; // Import the UploadFile component

interface HuongDanHSFormProps {
	title?: string;
}

const HuongDanHSForm: React.FC<HuongDanHSFormProps> = ({ title = 'Hướng dẫn hồ sơ' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, ...rest } =
		useModel('huongdanhs');
	const categories: string[] = (rest as any).categories || [];
	const [form] = Form.useForm();
	const [fileList, setFileList] = React.useState<any[]>([]);
	const intl = useIntl();

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
						remote: true,
					},
				]);
			}
		}
	}, [record?.id, visibleForm, form]);

	const normFile = (e: any) => {
		if (e && e.fileList) {
			return e.fileList;
		}
		return [];
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
		<div style={{ padding: '16px' }}>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12}>
							<Form.Item label='Tiêu đề' name='title' rules={[...rules.required]}>
								<Input placeholder='Nhập tiêu đề' />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item label='Danh mục' name='category' rules={[...rules.required]}>
								<Select placeholder='Chọn danh mục'>
									{(categories || []).map((cat: string) => (
										<Select.Option key={cat} value={cat}>
											{cat}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={12}>
							<Form.Item label='Ngày đăng' name='date' rules={[...rules.required]}>
								<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày đăng' />
							</Form.Item>
						</Col>
						<Col xs={24} sm={12}>
							<Form.Item
								label='Tệp hướng dẫn'
								name='file'
								valuePropName='fileList'
								getValueFromEvent={normFile}
								rules={[...rules.required]}
								extra='Chỉ nhận file PDF, DOC, DOCX'
							>
								<UploadFile
									fileList={fileList}
									onChange={({ fileList }) => setFileList(fileList)}
									maxCount={1}
									accept='.pdf,.doc,.docx'
									buttonDescription='Chọn tệp'
									maxFileSize={5}
								/>
							</Form.Item>
						</Col>
					</Row>
					<Form.Item label='Tóm tắt' name='summary' rules={[...rules.required]}>
						<Input.TextArea placeholder='Nhập tóm tắt' autoSize={{ minRows: 2 }} />
					</Form.Item>

					<div style={{ textAlign: 'center', marginTop: '16px' }}>
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
		</div>
	);
};

export default HuongDanHSForm;

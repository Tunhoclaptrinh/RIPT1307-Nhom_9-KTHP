import React from 'react';
import { Button, Card, Form, Input, DatePicker, Select, Space, Row, Col, message } from 'antd';

import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';
import axios from 'axios';
import { ipLocal } from '@/utils/ip';
import { useIntl, useModel } from 'umi';

interface HuongDanHSFormProps {
	title?: string;
}

const HuongDanHSForm: React.FC<HuongDanHSFormProps> = ({ title = 'Hướng dẫn hồ sơ' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, ...rest } =
		useModel('quanlytrang.huongdanhs');
	const categories: string[] = (rest as any).categories || [];
	const [form] = Form.useForm();
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const userId = initialState?.currentUser?.id || 'admin'; // Lấy userId từ initialState hoặc mặc định

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

	// Chuyển đổi kích thước file sang định dạng MB
	const formatFileSize = (size: number): string => {
		const sizeInMB = size / (1024 * 1024);
		return `${sizeInMB.toFixed(1)}MB`;
	};

	// Hàm xử lý upload file
	const handleUploadFile = async (file: File) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('type', 'huongdan');
		formData.append('userId', userId); // Thêm userId vào request

		try {
			const response = await axios.post(`${ipLocal}/upload`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			return {
				fileUrl: response.data.fileUrl,
				fileSize: formatFileSize(file.size),
			};
		} catch (error) {
			console.error('Upload file error:', error);
			message.error('Không thể tải lên tệp, vui lòng thử lại.');
			throw new Error('Failed to upload file');
		}
	};

	const onFinish = async (values: any) => {
		try {
			let fileUrl = record?.fileUrl || '';
			let fileSize = record?.fileSize || '';

			// Xử lý file upload nếu có
			if (values.file?.fileList?.length) {
				const file = values.file.fileList[0].originFileObj;
				if (file) {
					const uploadResult = await handleUploadFile(file);
					fileUrl = uploadResult.fileUrl;
					fileSize = uploadResult.fileSize;
				}
			} else if (typeof values.file === 'string') {
				// Nếu nhập URL, giữ nguyên fileUrl và fileSize
				fileUrl = values.file;
				fileSize = record?.fileSize || '0MB';
			}

			const submitValues = {
				...values,
				date: values.date ? values.date.format('DD/MM/YYYY') : '',
				fileUrl,
				fileSize,
			};

			if (edit) {
				await putModel(record?.id ?? '', submitValues);
				message.success('Cập nhật hướng dẫn thành công!');
			} else {
				await postModel(submitValues);
				message.success('Thêm hướng dẫn thành công!');
			}
			setVisibleForm(false);
			form.resetFields();
		} catch (error) {
			console.error('Form submission error:', error);
			message.error('Có lỗi xảy ra, vui lòng thử lại.');
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
							<FormItemUrlOrUpload
								form={form}
								initValue={record?.fileUrl}
								field='file'
								accept='.pdf,.doc,.docx'
								isRequired={true}
								label='Tệp hướng dẫn'
								// maxFileSize={5}

								// extra='Chỉ nhận file PDF, DOC, DOCX'
							/>
						</Col>
					</Row>
					<Form.Item label='Tóm tắt' name='summary' rules={[...rules.required]}>
						<Input.TextArea placeholder='Nhập tóm tắt' autoSize={{ minRows: 2 }} />
					</Form.Item>

					<div style={{ textAlign: 'center', marginTop: '16px' }}>
						<Space>
							<Button loading={formSubmiting} htmlType='submit' type='primary'>
								{edit
									? intl.formatMessage({ id: 'global.button.luulai' })
									: intl.formatMessage({ id: 'global.button.themmoi' })}
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

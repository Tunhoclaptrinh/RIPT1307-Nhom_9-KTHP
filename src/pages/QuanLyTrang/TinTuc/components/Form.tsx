import React from 'react';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Switch, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface TinTucFormProps {
	title?: string;
}

const TinTucForm: React.FC<TinTucFormProps> = ({ title = 'Tin tức' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('quanlytrang.tintuc');
	const [form] = Form.useForm();
	const intl = useIntl();
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
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
			<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item label='Tiêu đề' name='title' rules={[...rules.required]}>
							<Input placeholder='Nhập tiêu đề' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Tác giả' name='author' rules={[...rules.required]}>
							<Input placeholder='Nhập tên tác giả' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item label='Danh mục' name='category' rules={[...rules.required]}>
							<Select placeholder='Chọn danh mục'>
								<Select.Option value='thi-cu'>Thi cử</Select.Option>
								<Select.Option value='tuyen-sinh'>Tuyển sinh</Select.Option>
								<Select.Option value='hoc-tap'>Học tập</Select.Option>
								<Select.Option value='su-kien'>Sự kiện</Select.Option>
							</Select>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Ngày đăng' name='date' rules={[...rules.required]}>
							<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày đăng' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item label='Nổi bật' name='featured' valuePropName='checked'>
							<Switch checkedChildren='Nổi bật' unCheckedChildren='Thường' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
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
								onChange={({ fileList: newFileList }) => setFileList(newFileList)}
								accept='.jpg,.jpeg,.png'
								maxCount={1}
								listType='picture'
							>
								<Button icon={<UploadOutlined />}>Chọn ảnh</Button>
							</Upload>
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24} md={24}>
						<Form.Item label='Tóm tắt' name='summary' rules={[...rules.required]}>
							<Input.TextArea placeholder='Nhập tóm tắt' autoSize={{ minRows: 2 }} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24} md={24}>
						<Form.Item label='Nội dung' name='content' rules={[...rules.required]}>
							<Input.TextArea placeholder='Nhập nội dung' autoSize={{ minRows: 4 }} />
						</Form.Item>
					</Col>
				</Row>
				<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
					<Space>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'global.button.themmoi', defaultMessage: 'Thêm mới' })
								: intl.formatMessage({ id: 'global.button.luulai', defaultMessage: 'Lưu lại' })}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>
							{intl.formatMessage({ id: 'global.button.huy', defaultMessage: 'Hủy' })}
						</Button>
					</Space>
				</div>
			</Form>
		</Card>
	);
};

export default TinTucForm;

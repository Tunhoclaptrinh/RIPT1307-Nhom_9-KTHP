import React from 'react';
import { Button, Card, Col, DatePicker, Form, InputNumber, Row, Space } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import moment from 'moment';

interface ThongKeTSFormProps {
	title?: string;
}

const ThongKeTSForm: React.FC<ThongKeTSFormProps> = ({ title = 'Thống kê tuyển sinh' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('quanlytrang.thongkets');
	const [form] = Form.useForm();
	const intl = useIntl();

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
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
			<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item label='Năm' name='year' rules={[...rules.required]}>
							<InputNumber min={2000} max={2100} style={{ width: '100%' }} placeholder='Nhập năm' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Cập nhật lần cuối' name='lastUpdated' rules={[...rules.required]}>
							<DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} placeholder='Chọn ngày cập nhật' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item label='Số trường ĐH' name='soTruongDaiHoc' rules={[...rules.required]}>
							<InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số trường ĐH' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Số ngành đào tạo' name='soNganhDaoTao' rules={[...rules.required]}>
							<InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số ngành đào tạo' />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={24} md={12}>
						<Form.Item label='Số thí sinh đăng ký' name='soThiSinhDangKy' rules={[...rules.required]}>
							<InputNumber min={0} style={{ width: '100%' }} placeholder='Nhập số thí sinh đăng ký' />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label='Tỷ lệ hồ sơ trực tuyến (%)' name='tyLeHoSoTrucTuyen' rules={[...rules.required]}>
							<InputNumber min={0} max={100} style={{ width: '100%' }} placeholder='Nhập tỷ lệ (%)' />
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

export default ThongKeTSForm;

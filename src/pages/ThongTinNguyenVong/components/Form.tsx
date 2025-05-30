import React from 'react';
import { Button, Card, Form, Input, InputNumber, Row, Col, Space } from 'antd';
import { useModel, useIntl } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import PhuongThucXTSelect from '@/pages/PhuongThucXT/components/Select';
import NganhDaoTaoSelect from '@/pages/NganhDaoTao/components/Select';

interface ThongTinNguyenVongFormProps {
	title?: string;
	hideFooter?: boolean;
}

const ThongTinNguyenVongForm: React.FC<ThongTinNguyenVongFormProps> = ({
	title = 'thông tin nguyện vọng',
	hideFooter,
	...props
}) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('thongtinnguyenvong');
	const [form] = Form.useForm();
	const intl = useIntl();

	// Reset form when closing/opening form
	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?.id) {
			form.setFieldsValue(record);
		}
	}, [record?.id, visibleForm, form]);

	const onFinish = async (values: ThongTinNguyenVong.IRecord) => {
		try {
			if (edit) {
				await putModel(record?.id ?? '', values);
			} else {
				await postModel(values);
			}
			setVisibleForm(false);
		} catch (error) {
			console.error('Form submission error:', error);
		}
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`} style={{ maxWidth: 1200, margin: '0 auto' }}>
			<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={24}>
						<Form.Item label='Tên nguyện vọng' name='ten' rules={[...rules.required]}>
							{/* <Input placeholder='Nhập tên nguyện vọng' /> */}
							<NganhDaoTaoSelect />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item label='Thứ tự nguyện vọng' name='thuTuNV' rules={[...rules.required]}>
							<InputNumber min={1} placeholder='Nhập thứ tự nguyện vọng' style={{ width: '100%' }} />
						</Form.Item>
					</Col>

					<Col xs={24} sm={12}>
						<Form.Item label='Phương thức xét tuyển' name='phuongThucId' rules={[...rules.required]}>
							<PhuongThucXTSelect placeholder='Chọn phương thức xét tuyển' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={8}>
						<Form.Item label='Điểm chưa ưu tiên' name='diemChuaUT' rules={[...rules.required]}>
							<InputNumber min={0} step={0.1} placeholder='Nhập điểm chưa ưu tiên' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={8}>
						<Form.Item label='Điểm có ưu tiên' name='diemCoUT' rules={[...rules.required]}>
							<InputNumber min={0} step={0.1} placeholder='Nhập điểm có ưu tiên' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={8}>
						<Form.Item label='Điểm đối tượng ưu tiên' name='diemDoiTuongUT'>
							<InputNumber
								min={0}
								step={0.1}
								placeholder='Nhập điểm đối tượng ưu tiên (tùy chọn)'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item label='Điểm khu vực ưu tiên' name='diemKhuVucUT'>
							<InputNumber
								min={0}
								step={0.1}
								placeholder='Nhập điểm khu vực ưu tiên (tùy chọn)'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item label='Tổng điểm' name='tongDiem' rules={[...rules.required]}>
							<InputNumber min={0} step={0.1} placeholder='Nhập tổng điểm' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>

				{!hideFooter && (
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
				)}
			</Form>
		</Card>
	);
};

export default ThongTinNguyenVongForm;

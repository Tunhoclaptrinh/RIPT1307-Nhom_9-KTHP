import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

interface NganhDaoTaoFormProps {
	title?: string;
}

const NganhDaoTaoForm: React.FC<NganhDaoTaoFormProps> = ({ title = 'ngành đào tạo' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('nganhdaotao');
	const [form] = Form.useForm();
	const intl = useIntl();

	// Reset form khi đóng/mở form
	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?.id) {
			form.setFieldsValue(record);
		}
	}, [record?.id, visibleForm]);

	const onFinish = async (values: NganhDaoTao.IRecord) => {
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
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					<Form.Item 
						label='Mã ngành đào tạo' 
						name='ma' 
						rules={[...rules.required]}
					>
						<Input 
							placeholder='Nhập mã ngành đào tạo' 
						/>
					</Form.Item>

					<Form.Item 
						label='Tên ngành đào tạo' 
						name='ten' 
						rules={[...rules.required]}
					>
						<Input placeholder='Nhập tên ngành đào tạo' />
					</Form.Item>

					<Form.Item 
						label='Mô tả ngành đào tạo' 
						name='moTa' 
						// rules={[...rules.required]}
					>
						<Input.TextArea 
							placeholder='Nhập mô tả ngành đào tạo'
							rows={4}
							showCount
							maxLength={500}
						/>
					</Form.Item>

					<Form.Item 
						label='Tổ hợp xét tuyển ID' 
						name='toHopXetTuyenId'
					>
						<Input placeholder='Nhập ID tổ hợp xét tuyển (tùy chọn)' />
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

export default NganhDaoTaoForm;
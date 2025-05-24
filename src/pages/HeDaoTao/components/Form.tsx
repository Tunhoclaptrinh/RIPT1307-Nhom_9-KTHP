import React from 'react';
import { Button, Card, Form, Input } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Space } from 'antd';

interface HeDaoTaoFormProps {
	title?: string;
}

const HeDaoTaoForm: React.FC<HeDaoTaoFormProps> = ({ title = 'hệ đào tạo' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('hedaotao');
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

	const onFinish = async (values: HeDaoTao.IRecord) => {
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
					<Form.Item label='Mã hệ đào tạo' name='id' rules={[...rules.required]}>
						<Input placeholder='Nhập mã hệ đào tạo' />
					</Form.Item>

					<Form.Item label='Tên hệ đào tạo' name='ten' rules={[...rules.required]}>
						<Input placeholder='Nhập tên hệ đào tạo' />
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
		</div>
	);
};

export default HeDaoTaoForm;
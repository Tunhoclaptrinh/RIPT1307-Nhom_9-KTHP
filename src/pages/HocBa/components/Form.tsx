import React from 'react';
import { Button, Card, Form, Input, Select, InputNumber, Space, Divider } from 'antd';
import { useIntl, useModel } from 'umi';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';

const { Option } = Select;
const { TextArea } = Input;

interface DiemHocSinhFormProps {
	title?: string;
}

const DiemHocSinhForm: React.FC<DiemHocSinhFormProps> = ({ title = 'điểm học sinh' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('hocba');
	const [form] = Form.useForm();
	const intl = useIntl();


	// Danh sách môn học có thể chọn
	const monHocOptions = [
		'Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học',
		'Lịch sử', 'Địa lý', 'GDCD', 'Tin học', 'Thể dục', 'Âm nhạc', 'Mỹ thuật'
	];

	// Danh sách học kỳ
	const hocKyOptions = ['1', '2'];

	// Reset form khi đóng/mở form
	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record) {
			form.setFieldsValue({
				...record,
				// Đảm bảo diemMonHoc có ít nhất 1 phần tử
				diemMonHoc: record.diemMonHoc && record.diemMonHoc.length > 0 
					? record.diemMonHoc 
					: [{ mon: '', hocKy: '1', diemTongKet: 0 }]
			});
		} else {
			// Khi tạo mới, khởi tạo với 1 môn học mặc định
			form.setFieldsValue({
				diemMonHoc: [{ mon: '', hocKy: '1', diemTongKet: 0 }]
			});
		}
	}, [record, visibleForm]);

	const onFinish = async (values: DiemHocSinh.IRecord) => {
		try {
			// Lọc bỏ các môn học trống
			const filteredValues = {
				...values,
				diemMonHoc: values.diemMonHoc.filter(item => 
					item.mon && item.hocKy && item.diemTongKet !== undefined
				)
			};

			if (edit) {
				await putModel(record?.id ?? '', filteredValues);
			} else {
				await postModel(filteredValues);
			}
			setVisibleForm(false);
		} catch (error) {
			console.error('Form submission error:', error);
		}
	};

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form 
					form={form} 
					layout='vertical' 
					onFinish={onFinish} 
					autoComplete='off'
					initialValues={{
						diemMonHoc: [{ mon: '', hocKy: '1', diemTongKet: 0 }],
						loaiHanhKiem: 'trung bình'
					}}
				>
					{edit && (
						<Form.Item label='ID Học Bạ' name='id'>
							<Input disabled />
						</Form.Item>
					)}

					{/* Điểm các môn học */}
					<Divider orientation="left">Điểm các môn học</Divider>
					<Form.List name="diemMonHoc">
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<div key={key} style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 6 }}>
										<Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
											<Form.Item
												{...restField}
												name={[name, 'mon']}
												label="Môn học"
												rules={[...rules.required]}
												style={{ minWidth: 180 }}
											>
												<Select placeholder="Chọn môn học">
													{monHocOptions.map(mon => (
														<Option key={mon} value={mon}>{mon}</Option>
													))}
												</Select>
											</Form.Item>

											<Form.Item
												{...restField}
												name={[name, 'hocKy']}
												label="Học kỳ"
												rules={[...rules.required]}
												style={{ minWidth: 120 }}
											>
												<Select placeholder="Chọn học kỳ">
													{hocKyOptions.map(hk => (
														<Option key={hk} value={hk}>Học kỳ {hk}</Option>
													))}
												</Select>
											</Form.Item>

											<Form.Item
												{...restField}
												name={[name, 'diemTongKet']}
												label="Điểm tổng kết"
												rules={[
													...rules.required,
													{
														type: 'number',
														min: 0,
														max: 10,
														message: 'Điểm phải từ 0 đến 10'
													}
												]}
												style={{ minWidth: 140 }}
											>
												<InputNumber
													min={0}
													max={10}
													step={0.1}
													precision={1}
													placeholder="0.0"
													style={{ width: '100%' }}
												/>
											</Form.Item>

											<MinusCircleOutlined 
												onClick={() => remove(name)}
												style={{ color: '#ff4d4f', fontSize: 18 }}
											/>
										</Space>
									</div>
								))}
								<Form.Item>
									<Button 
										type="dashed" 
										onClick={() => add({ mon: '', hocKy: '1', diemTongKet: 0 })} 
										block 
										icon={<PlusOutlined />}
									>
										Thêm môn học
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>

					{/* Loại hạnh kiểm */}
					<Form.Item 
						label='Loại hạnh kiểm' 
						name='loaiHanhKiem' 
						rules={[...rules.required]}
					>
						<Select placeholder='Chọn loại hạnh kiểm'>
							<Option value='tốt'>Tốt</Option>
							<Option value='khá'>Khá</Option>
							<Option value='trung bình'>Trung bình</Option>
							<Option value='yếu'>Yếu</Option>
							<Option value='kém'>Kém</Option>
						</Select>
					</Form.Item>

					{/* Minh chứng */}
					<Form.Item 
						label='Minh chứng' 
						name='minhChung' 
						rules={[...rules.required]}
					>
						<TextArea 
							placeholder='Nhập minh chứng, tài liệu đính kèm...'
							rows={4}
							showCount
							maxLength={1000}
						/>
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

export default DiemHocSinhForm;
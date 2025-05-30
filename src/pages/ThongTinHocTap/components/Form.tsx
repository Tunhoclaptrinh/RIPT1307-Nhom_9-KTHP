import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Select, Switch, DatePicker, InputNumber, Row, Col } from 'antd';
import { useModel, useIntl } from 'umi';
import { resetFieldsForm } from '@/utils/utils';
import rules from '@/utils/rules';
import moment from 'moment';
import { Space } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';

const { Option } = Select;

interface ThongTinHocTapFormProps {
	title?: string;
	hideFooter?: boolean;
}

const ThongTinHocTapForm: React.FC<ThongTinHocTapFormProps> = (
	{ title = 'thông tin học tập' },
	hideFooter,
	...props
) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('thongtinhoctap');
	const [form] = Form.useForm();
	const intl = useIntl();

	// State for address selection
	const [selectedProvince, setSelectedProvince] = useState<string>();
	const [selectedDistrict, setSelectedDistrict] = useState<string>();
	const [selectedWard, setSelectedWard] = useState<string>();

	// Reset form and update values when record changes
	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedProvince(undefined);
			setSelectedDistrict(undefined);
			setSelectedWard(undefined);
		} else if (record?.id) {
			const formData = {
				...record,
				thongTinTHPT: {
					...record.thongTinTHPT,
					namTotNghiep: record.thongTinTHPT.namTotNghiep ? moment(record.thongTinTHPT.namTotNghiep) : null,
				},
				hasDGTD: !!record.diemDGTD?.tongDiem || !!record.diemDGTD?.mon?.length,
				hasDGNL: !!record.diemDGNL?.tongDiem || !!record.diemDGNL?.mon?.length,
				hasGiaiHSG: !!record.giaiHSG,
				hasChungChi: !!record.chungChi?.length,
				giaiHSG: record.giaiHSG
					? {
							...record.giaiHSG,
							nam: record.giaiHSG.nam ? moment(record.giaiHSG.nam) : null,
					  }
					: undefined,
			};
			form.setFieldsValue(formData);

			// Update address state
			setSelectedProvince(record.thongTinTHPT?.tinh_ThanhPho);
			setSelectedDistrict(record.thongTinTHPT?.quanHuyen);
			setSelectedWard(record.thongTinTHPT?.xaPhuong);
		}
	}, [record?.id, visibleForm, form]);

	const onFinish = async (values: any) => {
		try {
			const formattedValues = {
				...values,
				thongTinTHPT: {
					...values.thongTinTHPT,
					namTotNghiep:
						values.thongTinTHPT.daTotNghiep && values.thongTinTHPT.namTotNghiep
							? moment(values.thongTinTHPT.namTotNghiep).format('YYYY')
							: '',
					tinh_ThanhPho: values.thongTinTHPT?.tinh_ThanhPho,
					quanHuyen: values.thongTinTHPT?.quanHuyen,
					xaPhuong: values.thongTinTHPT?.xaPhuong,
				},
				diemDGTD: values.hasDGTD ? values.diemDGTD : undefined,
				diemDGNL: values.hasDGNL ? values.diemDGNL : undefined,
				giaiHSG: values.hasGiaiHSG
					? {
							...values.giaiHSG,
							nam: values.giaiHSG?.nam ? moment(values.giaiHSG.nam).format('YYYY') : '',
					  }
					: undefined,
				chungChi: values.hasChungChi ? values.chungChi : [],
			};
			if (edit) {
				await putModel(record?.id ?? '', formattedValues);
			} else {
				await postModel(formattedValues);
			}
			setVisibleForm(false);
		} catch (error) {
			console.error('Form submission error:', error);
		}
	};

	// Handle address changes
	const handleProvinceChange = (value: string) => {
		setSelectedProvince(value);
		setSelectedDistrict(undefined);
		setSelectedWard(undefined);
		form.setFieldsValue({
			thongTinTHPT: {
				...form.getFieldValue('thongTinTHPT'),
				tinh_ThanhPho: value,
				quanHuyen: undefined,
				xaPhuong: undefined,
			},
		});
	};

	const handleDistrictChange = (value: string) => {
		setSelectedDistrict(value);
		setSelectedWard(undefined);
		form.setFieldsValue({
			thongTinTHPT: {
				...form.getFieldValue('thongTinTHPT'),
				quanHuyen: value,
				xaPhuong: undefined,
			},
		});
	};

	const handleWardChange = (value: string) => {
		setSelectedWard(value);
		form.setFieldsValue({
			thongTinTHPT: {
				...form.getFieldValue('thongTinTHPT'),
				xaPhuong: value,
			},
		});
	};

	// Watch switch states to apply conditional rules
	const hasDGTD = Form.useWatch('hasDGTD', form);
	const hasDGNL = Form.useWatch('hasDGNL', form);
	const hasGiaiHSG = Form.useWatch('hasGiaiHSG', form);
	const hasChungChi = Form.useWatch('hasChungChi', form);
	const daTotNghiep = Form.useWatch(['thongTinTHPT', 'daTotNghiep'], form);

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					{/* Thông tin THPT */}
					<Card type='inner' title='Thông tin trường THPT' style={{ marginBottom: 16 }}>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item label='Mã trường' name={['thongTinTHPT', 'maTruong']} rules={[...rules.required]}>
									<Input placeholder='Nhập mã trường' />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label='Mã tỉnh' name={['thongTinTHPT', 'maTinh']} rules={[...rules.required]}>
									<Input placeholder='Nhập mã tỉnh' />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label='Tỉnh/Thành phố' name={['thongTinTHPT', 'tinh_ThanhPho']} rules={[...rules.required]}>
									<ProvincesSelect
										placeholder='Chọn tỉnh/thành phố'
										onChange={handleProvinceChange}
										value={selectedProvince}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item label='Quận/Huyện' name={['thongTinTHPT', 'quanHuyen']} rules={[...rules.required]}>
									<DistrictsSelect
										provinceCode={selectedProvince}
										placeholder='Chọn quận/huyện'
										onChange={handleDistrictChange}
										value={selectedDistrict}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label='Xã/Phường' name={['thongTinTHPT', 'xaPhuong']} rules={[...rules.required]}>
									<WardsSelect
										districtCode={selectedDistrict}
										placeholder='Chọn xã/phường'
										onChange={handleWardChange}
										value={selectedWard}
									/>
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item label='Khu vực ưu tiên' name={['thongTinTHPT', 'khuVucUT']} rules={[...rules.required]}>
									<Select placeholder='Chọn khu vực ưu tiên'>
										<Option value='kv1'>KV1</Option>
										<Option value='kv2'>KV2</Option>
										<Option value='kv2NT'>KV2NT</Option>
										<Option value='kv3'>KV3</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label='Địa chỉ' name={['thongTinTHPT', 'diaChi']}>
									<Input placeholder='Nhập địa chỉ' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Đối tượng ưu tiên' name={['thongTinTHPT', 'doiTuongUT']}>
									<Select placeholder='Chọn đối tượng ưu tiên' allowClear>
										<Option value='hộ nghèo'>Hộ nghèo</Option>
										<Option value='cận nghèo'>Cận nghèo</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label='Đã tốt nghiệp' name={['thongTinTHPT', 'daTotNghiep']} valuePropName='checked'>
									<Switch />
								</Form.Item>
							</Col>
							{daTotNghiep && (
								<Col span={12}>
									<Form.Item label='Năm tốt nghiệp' name={['thongTinTHPT', 'namTotNghiep']} rules={[...rules.required]}>
										<DatePicker picker='year' placeholder='Chọn năm tốt nghiệp' style={{ width: '100%' }} />
									</Form.Item>
								</Col>
							)}
						</Row>
					</Card>

					{/* Điểm THPT */}
					<Card type='inner' title='Điểm THPT' style={{ marginBottom: 16 }}>
						<Form.List name='diemTHPT'>
							{(fields, { add, remove }) => (
								<>
									{fields.map(({ key, name, ...restField }) => (
										<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
											<Col span={10}>
												<Form.Item {...restField} name={[name, 'mon']} rules={[...rules.required]}>
													<Select placeholder='Chọn môn thi'>
														<Option value='toán'>Toán</Option>
														<Option value='văn'>Văn</Option>
														<Option value='anh'>Anh</Option>
													</Select>
												</Form.Item>
											</Col>
											<Col span={10}>
												<Form.Item
													{...restField}
													name={[name, 'diem']}
													rules={[...rules.required, { type: 'number', min: 0, max: 10 }]}
												>
													<InputNumber placeholder='Điểm' step={0.1} style={{ width: '100%' }} />
												</Form.Item>
											</Col>
											<Col span={4}>
												<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
											</Col>
										</Row>
									))}
									<Form.Item>
										<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
											Thêm điểm môn
										</Button>
									</Form.Item>
								</>
							)}
						</Form.List>
					</Card>

					{/* Điểm ĐGTD */}
					<Card
						type='inner'
						title={
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<span>Điểm đánh giá tư duy (ĐGTD)</span>
								<Form.Item name='hasDGTD' valuePropName='checked' style={{ margin: 0 }}>
									<Switch />
								</Form.Item>
							</div>
						}
						style={{ marginBottom: 16 }}
					>
						{hasDGTD && (
							<>
								<Form.Item label='Tổng điểm ĐGTD' name={['diemDGTD', 'tongDiem']} rules={[...rules.required]}>
									<InputNumber placeholder='Nhập tổng điểm' min={0} step={0.1} style={{ width: '100%' }} />
								</Form.Item>
								<Form.List name={['diemDGTD', 'mon']}>
									{(fields, { add, remove }) => (
										<>
											{fields.map(({ key, name, ...restField }) => (
												<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
													<Col span={10}>
														<Form.Item {...restField} name={[name, 'ten']} rules={[...rules.required]}>
															<Input placeholder='Tên môn' />
														</Form.Item>
													</Col>
													<Col span={10}>
														<Form.Item
															{...restField}
															name={[name, 'diem']}
															rules={[...rules.required, { type: 'number', min: 0 }]}
														>
															<InputNumber placeholder='Điểm' step={0.1} style={{ width: '100%' }} />
														</Form.Item>
													</Col>
													<Col span={4}>
														<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
													</Col>
												</Row>
											))}
											<Form.Item>
												<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
													Thêm môn ĐGTD
												</Button>
											</Form.Item>
										</>
									)}
								</Form.List>
							</>
						)}
					</Card>

					{/* Điểm ĐGNL */}
					<Card
						type='inner'
						title={
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<span>Điểm đánh giá năng lực (ĐGNL)</span>
								<Form.Item name='hasDGNL' valuePropName='checked' style={{ margin: 0 }}>
									<Switch />
								</Form.Item>
							</div>
						}
						style={{ marginBottom: 16 }}
					>
						{hasDGNL && (
							<>
								<Form.Item label='Tổng điểm ĐGNL' name={['diemDGNL', 'tongDiem']} rules={[...rules.required]}>
									<InputNumber placeholder='Nhập tổng điểm' min={0} step={0.1} style={{ width: '100%' }} />
								</Form.Item>
								<Form.List name={['diemDGNL', 'mon']}>
									{(fields, { add, remove }) => (
										<>
											{fields.map(({ key, name, ...restField }) => (
												<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
													<Col span={10}>
														<Form.Item {...restField} name={[name, 'ten']} rules={[...rules.required]}>
															<Input placeholder='Tên môn' />
														</Form.Item>
													</Col>
													<Col span={10}>
														<Form.Item
															{...restField}
															name={[name, 'diem']}
															rules={[...rules.required, { type: 'number', min: 0 }]}
														>
															<InputNumber placeholder='Điểm' step={0.1} style={{ width: '100%' }} />
														</Form.Item>
													</Col>
													<Col span={4}>
														<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
													</Col>
												</Row>
											))}
											<Form.Item>
												<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
													Thêm môn ĐGNL
												</Button>
											</Form.Item>
										</>
									)}
								</Form.List>
							</>
						)}
					</Card>

					{/* Giải HSG */}
					<Card
						type='inner'
						title={
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<span>Giải học sinh giỏi (HSG)</span>
								<Form.Item name='hasGiaiHSG' valuePropName='checked' style={{ margin: 0 }}>
									<Switch />
								</Form.Item>
							</div>
						}
						style={{ marginBottom: 16 }}
					>
						{hasGiaiHSG && (
							<Row gutter={16}>
								<Col span={12}>
									<Form.Item label='Loại giải' name={['giaiHSG', 'loaiGiai']} rules={[...rules.required]}>
										<Select placeholder='Chọn loại giải'>
											<Option value='nhất'>Nhất</Option>
											<Option value='nhì'>Nhì</Option>
											<Option value='ba'>Ba</Option>
											<Option value='khuyến khích'>Khuyến khích</Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label='Môn' name={['giaiHSG', 'mon']} rules={[...rules.required]}>
										<Select placeholder='Chọn môn thi'>
											<Option value='toán'>Toán</Option>
											<Option value='văn'>Văn</Option>
											<Option value='anh'>Anh</Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label='Cấp giải' name={['giaiHSG', 'giaiHsgCap']} rules={[...rules.required]}>
										<Select placeholder='Chọn cấp giải'>
											<Option value='thành phố'>Thành phố</Option>
											<Option value='tỉnh'>Tỉnh</Option>
											<Option value='quốc gia'>Quốc gia</Option>
											<Option value='quốc tế'>Quốc tế</Option>
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label='Năm' name={['giaiHSG', 'nam']} rules={[...rules.required]}>
										<DatePicker picker='year' placeholder='Chọn năm' style={{ width: '100%' }} />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label='Nơi cấp' name={['giaiHSG', 'noiCap']} rules={[...rules.required]}>
										<Input placeholder='Nhập nơi cấp' />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label='Minh chứng' name={['giaiHSG', 'minhChung']} rules={[...rules.required]}>
										<Input placeholder='Nhập minh chứng' />
									</Form.Item>
								</Col>
							</Row>
						)}
					</Card>

					{/* Chứng chỉ */}
					<Card
						type='inner'
						title={
							<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<span>Chứng chỉ</span>
								<Form.Item name='hasChungChi' valuePropName='checked' style={{ margin: 0 }}>
									<Switch />
								</Form.Item>
							</div>
						}
						style={{ marginBottom: 16 }}
					>
						{hasChungChi && (
							<Form.List name='chungChi'>
								{(fields, { add, remove }) => (
									<>
										{fields.map(({ key, name, ...restField }) => (
											<Row key={key} gutter={16} style={{ marginBottom: 8 }}>
												<Col span={7}>
													<Form.Item {...restField} name={[name, 'loaiCC']} rules={[...rules.required]}>
														<Select placeholder='Chọn loại chứng chỉ'>
															<Option value='tiếng anh'>Tiếng Anh</Option>
															<Option value='tin học'>Tin học</Option>
														</Select>
													</Form.Item>
												</Col>
												<Col span={7}>
													<Form.Item {...restField} name={[name, 'ketQua']} rules={[...rules.required]}>
														<Input placeholder='Kết quả' />
													</Form.Item>
												</Col>
												<Col span={7}>
													<Form.Item {...restField} name={[name, 'minhChung']} rules={[...rules.required]}>
														<Input placeholder='Minh chứng' />
													</Form.Item>
												</Col>
												<Col span={3}>
													<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />
												</Col>
											</Row>
										))}
										<Form.Item>
											<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
												Thêm chứng chỉ
											</Button>
										</Form.Item>
									</>
								)}
							</Form.List>
						)}
					</Card>

					{/* Học bạ THPT */}
					<Form.Item label='Học bạ THPT' name='hocBaTHPT'>
						<Input placeholder='Nhập ID học bạ' />
					</Form.Item>

					{/* Form actions */}
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
		</div>
	);
};

export default ThongTinHocTapForm;

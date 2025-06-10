import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Input, Row, Select, Modal, message } from 'antd';
import { useIntl, useModel } from 'umi';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { ProvincesSelect, DistrictsSelect, WardsSelect } from '@/components/Address';
import { HoSo } from '@/services/HoSo/typing';
import { Space } from 'antd';
import axios from 'axios';
const { Option } = Select;

interface HoSoFormProps {
	title?: string;
	[key: string]: any;
}

const HoSoForm: React.FC<HoSoFormProps> = ({ title = 'hồ sơ' }) => {
	const { record, setVisibleForm, edit, postModel, putModel, visibleForm } = useModel('hoso');
	const [form] = Form.useForm();
	const [resultForm] = Form.useForm();
	const intl = useIntl();

	// State for address selection
	const [selectedProvince, setSelectedProvince] = useState<string>();
	const [selectedDistrict, setSelectedDistrict] = useState<string>();
	const [selectedWard, setSelectedWard] = useState<string>();
	const [submitting, setSubmitting] = useState(false);
	const [resultModalVisible, setResultModalVisible] = useState(false);
	const [nguyenVongList, setNguyenVongList] = useState<any[]>([]);
	const [phuongThucList, setPhuongThucList] = useState<any[]>([]);

	// Fetch nguyenVong and phuongThucXetTuyen when record changes
	useEffect(() => {
		const fetchData = async () => {
			if (record?.thongTinCaNhanId) {
				try {
					// Fetch nguyenVong for the user
					const nguyenVongResponse = await axios.get(
						`http://localhost:3000/thongTinNguyenVong?userId=${record.thongTinCaNhanId}`,
					);
					setNguyenVongList(nguyenVongResponse.data);

					// Fetch all phuongThucXetTuyen
					const phuongThucResponse = await axios.get('http://localhost:3000/phuongThucXetTuyen');
					setPhuongThucList(phuongThucResponse.data);
				} catch (error) {
					message.error('Không thể tải dữ liệu nguyện vọng hoặc phương thức xét tuyển');
				}
			}
		};
		fetchData();
	}, [record?.thongTinCaNhanId]);

	// Reset form and update values when record changes
	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedProvince(undefined);
			setSelectedDistrict(undefined);
			setSelectedWard(undefined);
			setResultModalVisible(false);
			resetFieldsForm(resultForm);
		} else if (record?.id) {
			const formData = {
				...record,
				thongTinLienHe: {
					...record.thongTinLienHe,
					diaChi: record.thongTinLienHe?.diaChi || {},
				},
				thongTinBoSung: {
					...record.thongTinBoSung,
					noiSinh: record.thongTinBoSung?.noiSinh || {},
				},
				ketQua: record.ketQua || {},
			};
			form.setFieldsValue(formData);

			// Update address state
			setSelectedProvince(record.thongTinLienHe?.diaChi?.tinh_ThanhPho);
			setSelectedDistrict(record.thongTinLienHe?.diaChi?.quanHuyen);
			setSelectedWard(record.thongTinLienHe?.diaChi?.xaPhuong);

			// Set result form values if ketQua exists
			if (record.ketQua) {
				resultForm.setFieldsValue({
					ketQua: {
						succes: record.ketQua.succes,
						nguyenVongDo: record.ketQua.nguyenVongDo,
						phuongThucId: record.ketQua.phuongThucId,
						diem: record.ketQua.diem,
					},
				});
			}
		}
	}, [record?.id, visibleForm, form, resultForm]);

	// Handle form submission
	const onFinish = async (values: any) => {
		try {
			setSubmitting(true);
			const submitData: HoSo.IRecord = {
				...values,
				thongTinLienHe: {
					...values.thongTinLienHe,
					diaChi: {
						tinh_ThanhPho: values.thongTinLienHe?.diaChi?.tinh_ThanhPho,
						quanHuyen: values.thongTinLienHe?.diaChi?.quanHuyen,
						xaPhuong: values.thongTinLienHe?.diaChi?.xaPhuong,
						diaChiCuThe: values.thongTinLienHe?.diaChi?.diaChiCuThe,
					},
				},
				thongTinBoSung: {
					...values.thongTinBoSung,
					noiSinh: {
						trongNuoc: values.thongTinBoSung?.noiSinh?.trongNuoc,
						tinh_ThanhPho: values.thongTinBoSung?.noiSinh?.tinh_ThanhPho,
					},
				},
				nguyenVong: values.nguyenVong || [],
				tinhTrang: 'chờ duyệt',
				ketQua: values.ketQua || {},
			};

			if (edit) {
				await putModel(record?.id ?? '', submitData);
			} else {
				await postModel(submitData);
			}
			setVisibleForm(false);
		} catch (error) {
			console.error('Form submission error:', error);
			message.error('Lỗi khi gửi biểu mẫu');
		} finally {
			setSubmitting(false);
		}
	};

	// Handle result form submission
	const onResultFinish = async (values: any) => {
		try {
			setSubmitting(true);
			const updatedKetQua = {
				...record,
				ketQua: {
					succes: values.ketQua.succes,
					nguyenVongDo: values.ketQua.nguyenVongDo,
					phuongThucId: values.ketQua.phuongThucId,
					diem: parseFloat(values.ketQua.diem),
				},
			};

			if (edit) {
				await putModel(record?.id ?? '', updatedKetQua);
				message.success('Cập nhật kết quả thành công');
			}
			setResultModalVisible(false);
			setVisibleForm(false);
		} catch (error) {
			console.error('Result form submission error:', error);
			message.error('Lỗi khi cập nhật kết quả');
		} finally {
			setSubmitting(false);
		}
	};

	const handleProvinceChange = (value: string) => {
		setSelectedProvince(value);
		setSelectedDistrict(undefined);
		setSelectedWard(undefined);
		form.setFieldsValue({
			thongTinLienHe: {
				...form.getFieldValue('thongTinLienHe'),
				diaChi: {
					...form.getFieldValue('thongTinLienHe')?.diaChi,
					tinh_ThanhPho: value,
					quanHuyen: undefined,
					xaPhuong: undefined,
				},
			},
		});
	};

	const handleDistrictChange = (value: string) => {
		setSelectedDistrict(value);
		setSelectedWard(undefined);
		form.setFieldsValue({
			thongTinLienHe: {
				...form.getFieldValue('thongTinLienHe'),
				diaChi: {
					...form.getFieldValue('thongTinLienHe')?.diaChi,
					quanHuyen: value,
					xaPhuong: undefined,
				},
			},
		});
	};

	const handleWardChange = (value: string) => {
		setSelectedWard(value);
		form.setFieldsValue({
			thongTinLienHe: {
				...form.getFieldValue('thongTinLienHe'),
				diaChi: {
					...form.getFieldValue('thongTinLienHe')?.diaChi,
					xaPhuong: value,
				},
			},
		});
	};

	// Handle nguyenVongDo change to filter phuongThucId
	const handleNguyenVongDoChange = (value: string) => {
		const selectedNguyenVong = nguyenVongList.find((nv) => nv.id === value);
		if (selectedNguyenVong) {
			resultForm.setFieldsValue({
				ketQua: {
					...resultForm.getFieldValue('ketQua'),
					phuongThucId: selectedNguyenVong.phuongThucId,
				},
			});
		}
	};

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
					<Row gutter={[16, 0]} style={{ marginBottom: 16 }}>
						<Col span={24}>
							<Form.Item label='Họ và tên' name={['thongTinLienHe', 'ten']} rules={[...rules.required]}>
								<Input placeholder='Nhập họ và tên' />
							</Form.Item>
						</Col>
					</Row>

					<Card title='Thông tin bổ sung' style={{ marginTop: 16, border: 'none' }}>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label='Dân tộc' name={['thongTinBoSung', 'danToc']} rules={[...rules.required]}>
									<Select placeholder='Chọn dân tộc'>
										<Option value='kinh'>Kinh</Option>
										<Option value='mông'>Mông</Option>
										<Option value='mèo'>Mèo</Option>
										<Option value='khác'>Khác</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item label='Quốc tịch' name={['thongTinBoSung', 'quocTich']} rules={[...rules.required]}>
									<Select placeholder='Chọn quốc tịch'>
										<Option value='Việt Nam'>Việt Nam</Option>
										<Option value='Lào'>Lào</Option>
										<Option value='Campuchia'>Campuchia</Option>
										<Option value='khác'>Khác</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item label='Tôn giáo' name={['thongTinBoSung', 'tonGiao']} rules={[...rules.required]}>
									<Select placeholder='Chọn tôn giáo'>
										<Option value='không'>Không</Option>
										<Option value='Thiên Chúa giáo'>Thiên Chúa giáo</Option>
										<Option value='Phật giáo'>Phật giáo</Option>
										<Option value='khác'>Khác</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Nơi sinh (Trong nước)'
									name={['thongTinBoSung', 'noiSinh', 'trongNuoc']}
									rules={[...rules.required]}
								>
									<Select placeholder='Chọn nơi sinh'>
										<Option value={true}>Trong nước</Option>
										<Option value={false}>Nước ngoài</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>
						<Form.Item
							label='Tỉnh/Thành phố (Nơi sinh)'
							name={['thongTinBoSung', 'noiSinh', 'tinh_ThanhPho']}
							rules={[...rules.required]}
						>
							<Input placeholder='Nhập tỉnh/thành phố nơi sinh' />
						</Form.Item>
					</Card>

					<Card title='Địa chỉ liên hệ' style={{ marginTop: 16, border: 'none' }}>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label='Tỉnh/Thành phố'
									name={['thongTinLienHe', 'diaChi', 'tinh_ThanhPho']}
									rules={[...rules.required]}
								>
									<ProvincesSelect
										placeholder='Chọn tỉnh/thành phố'
										onChange={handleProvinceChange}
										value={selectedProvince}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Quận/Huyện'
									name={['thongTinLienHe', 'diaChi', 'quanHuyen']}
									// rules={[...rules.required]}
								>
									<DistrictsSelect
										provinceCode={selectedProvince}
										placeholder='Chọn quận/huyện'
										onChange={handleDistrictChange}
										value={selectedDistrict}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label='Xã/Phường'
									name={['thongTinLienHe', 'diaChi', 'xaPhuong']}
									// rules={[...rules.required]}
								>
									<WardsSelect
										districtCode={selectedDistrict}
										placeholder='Chọn xã/phường'
										onChange={handleWardChange}
										value={selectedWard}
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Địa chỉ cụ thể'
									name={['thongTinLienHe', 'diaChi', 'diaChiCuThe']}
									rules={[...rules.required]}
								>
									<Input placeholder='Nhập số nhà, tên đường...' />
								</Form.Item>
							</Col>
						</Row>
					</Card>

					<div style={{ marginTop: 16, marginBottom: 24 }}>
						<Button type='primary' onClick={() => setResultModalVisible(true)}>
							Cập nhật kết quả
						</Button>
					</div>

					<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
						<Space>
							<Button loading={submitting} htmlType='submit' type='primary'>
								{!edit
									? intl.formatMessage({ id: 'global.button.themmoi' })
									: intl.formatMessage({ id: 'global.button.luulai' })}
							</Button>
							<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
						</Space>
					</div>
				</Form>
			</Card>

			<Modal
				title='Cập nhật kết quả xét tuyển'
				visible={resultModalVisible}
				onCancel={() => setResultModalVisible(false)}
				footer={null}
				destroyOnClose
			>
				<Form form={resultForm} layout='vertical' onFinish={onResultFinish} autoComplete='off'>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Kết quả' name={['ketQua', 'succes']} rules={[...rules.required]}>
								<Select placeholder='Chọn kết quả'>
									<Option value={true}>Đỗ</Option>
									<Option value={false}>Trượt</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Nguyện vọng đỗ' name={['ketQua', 'nguyenVongDo']} rules={[...rules.required]}>
								<Select placeholder='Chọn nguyện vọng' onChange={handleNguyenVongDoChange}>
									{nguyenVongList.map((nv) => (
										<Option key={nv.id} value={nv.id}>
											{nv.ten} (Thứ tự: {nv.thuTuNV})
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Phương thức xét tuyển' name={['ketQua', 'phuongThucId']} rules={[...rules.required]}>
								<Select placeholder='Chọn phương thức xét tuyển' disabled>
									{phuongThucList.map((pt) => (
										<Option key={pt.id} value={pt.id}>
											{pt.ten}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label='Điểm' name={['ketQua', 'diem']} rules={[...rules.required, ...rules.number()]}>
								<Input placeholder='Nhập điểm' type='number' step='0.1' />
							</Form.Item>
						</Col>
					</Row>
					<div style={{ textAlign: 'center', marginTop: 24 }}>
						<Space>
							<Button loading={submitting} htmlType='submit' type='primary'>
								Lưu
							</Button>
							<Button onClick={() => setResultModalVisible(false)}>Hủy</Button>
						</Space>
					</div>
				</Form>
			</Modal>
		</div>
	);
};

export default HoSoForm;

import React from 'react';
import { Form, Button, Card, Select, InputNumber, Row, Col, Input } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import PhuongThucXTSelect from '@/pages/PhuongThucXT/components/Select';
import NganhDaoTaoSelect from '@/pages/NganhDaoTao/components/Select';

const { Option } = Select;

interface WishesFormProps {
	userId: string;
	initialData: { wishes?: ThongTinNguyenVong.IRecord[] };
	onNext: (data: { wishes: ThongTinNguyenVong.IRecord[] }) => void;
	phuongThucXetTuyenData: PhuongThucXT.IRecord[];
	nganhDaoTaoData: NganhDaoTao.IRecord[];
	toHopData: ToHop.IRecord[];
	existingNguyenVong: ThongTinNguyenVong.IRecord[];
}

const WishesForm: React.FC<WishesFormProps> = ({
	userId,
	initialData,
	onNext,
	phuongThucXetTuyenData,
	nganhDaoTaoData,
	toHopData,
}) => {
	const [form] = Form.useForm();

	// Hàm xử lý khi nhấn "Tiếp tục"
	const handleNext = async () => {
		try {
			const values = await form.validateFields();
			// Chuẩn hóa dữ liệu để gửi qua onNext
			const wishes: ThongTinNguyenVong.IRecord[] = values.nguyenVong.map((nv: any, index: number) => ({
				id: nv.id || `ttnv_${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
				userId,
				thuTuNV: index + 1,
				maNganh: nv.maNganh,
				ten: nganhDaoTaoData.find((nganh) => nganh.ma === nv.maNganh)?.ten || nv.ten || '',
				coSoDaoTao: nv.coSoDaoTao,
				phuongThucId: nv.phuongThucId,
				diemChuaUT: Number(nv.diemChuaUT) || 0,
				diemCoUT: Number(nv.diemCoUT) || 0,
				diemDoiTuongUT: Number(nv.diemDoiTuongUT) || 0, // Chuẩn hóa thành số
				diemKhuVucUT: Number(nv.diemKhuVucUT) || 0, // Chuẩn hóa thành số
				tongDiem: Number(nv.tongDiem) || 0,
				phuongThucXT: [phuongThucXetTuyenData.find((pt) => pt.id === nv.phuongThucId)?.ten || ''],
			}));
			onNext({ wishes });
		} catch (error) {
			console.error('Validation failed:', error);
		}
	};

	return (
		<Form form={form} layout='vertical' initialValues={{ nguyenVong: initialData.wishes || [] }}>
			<Card title='Nguyện vọng xét tuyển'>
				<Form.List name='nguyenVong'>
					{(fields, { add, remove }) => (
						<>
							{fields.map(({ key, name, ...restField }) => (
								<Card
									key={key}
									type='inner'
									title={`Nguyện vọng ${name + 1}`}
									style={{ marginBottom: 16 }}
									extra={<Button type='text' danger icon={<MinusCircleOutlined />} onClick={() => remove(name)} />}
								>
									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'maNganh']}
												label='Ngành đào tạo'
												rules={[{ required: true, message: 'Vui lòng chọn ngành!' }]}
											>
												<NganhDaoTaoSelect selectData={nganhDaoTaoData} placeholder='Chọn ngành đào tạo' />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'phuongThucId']}
												label='Phương thức xét tuyển'
												rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
											>
												<PhuongThucXTSelect
													selectData={phuongThucXetTuyenData}
													placeholder='Chọn phương thức xét tuyển'
												/>
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'diemChuaUT']}
												label='Điểm chưa ưu tiên'
												rules={[
													{ required: true, message: 'Vui lòng nhập điểm!' },
													{ type: 'number', min: 0, max: 30, message: 'Điểm phải từ 0 đến 30!' },
												]}
											>
												<InputNumber
													min={0}
													max={30}
													step={0.1}
													precision={2}
													placeholder='0.0'
													style={{ width: '100%' }}
												/>
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'diemCoUT']}
												label='Điểm có ưu tiên'
												rules={[
													{ required: true, message: 'Vui lòng nhập điểm!' },
													{ type: 'number', min: 0, max: 30, message: 'Điểm phải từ 0 đến 30!' },
												]}
											>
												<InputNumber
													min={0}
													max={30}
													step={0.1}
													precision={2}
													placeholder='0.0'
													style={{ width: '100%' }}
												/>
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item
												{...restField}
												name={[name, 'tongDiem']}
												label='Tổng điểm'
												rules={[
													{ required: true, message: 'Vui lòng nhập tổng điểm!' },
													{ type: 'number', min: 0, max: 30, message: 'Điểm phải từ 0 đến 30!' },
												]}
											>
												<InputNumber
													min={0}
													max={30}
													step={0.1}
													precision={2}
													placeholder='0.0'
													style={{ width: '100%' }}
												/>
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'diemDoiTuongUT']}
												label='Điểm ưu tiên đối tượng'
												rules={[{ type: 'number', min: 0, max: 5, message: 'Điểm phải từ 0 đến 5!' }]}
											>
												<InputNumber
													min={0}
													max={5}
													step={0.1}
													precision={2}
													placeholder='0.0'
													style={{ width: '100%' }}
												/>
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item
												{...restField}
												name={[name, 'diemKhuVucUT']}
												label='Điểm ưu tiên khu vực'
												rules={[{ type: 'number', min: 0, max: 5, message: 'Điểm phải từ 0 đến 5!' }]}
											>
												<InputNumber
													min={0}
													max={5}
													step={0.1}
													precision={2}
													placeholder='0.0'
													style={{ width: '100%' }}
												/>
											</Form.Item>
										</Col>
									</Row>

									<Form.Item
										{...restField}
										name={[name, 'coSoDaoTao']}
										label='Cơ sở đào tạo'
										rules={[{ required: true, message: 'Vui lòng chọn cơ sở đào tạo!' }]}
									>
										<Select placeholder='Chọn cơ sở đào tạo'>
											<Option value='Cơ sở chính'>Cơ sở chính</Option>
											<Option value='Cơ sở 2'>Cơ sở 2</Option>
											<Option value='Cơ sở 3'>Cơ sở 3</Option>
										</Select>
									</Form.Item>

									<Form.Item {...restField} name={[name, 'ghiChu']} label='Ghi chú (không bắt buộc)'>
										<Input.TextArea placeholder='Nhập ghi chú cho nguyện vọng này...' rows={2} />
									</Form.Item>
								</Card>
							))}
							<Form.Item>
								<Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
									Thêm nguyện vọng
								</Button>
							</Form.Item>
						</>
					)}
				</Form.List>
			</Card>

			<div style={{ textAlign: 'right', marginTop: 16 }}>
				<Button type='primary' onClick={handleNext}>
					Tiếp tục
				</Button>
			</div>
		</Form>
	);
};

export default WishesForm;

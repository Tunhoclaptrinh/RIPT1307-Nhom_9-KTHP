import React, { useEffect, useState } from 'react';
import { Form, Button, Card, Select, InputNumber, Row, Col, Input, Space, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import PhuongThucXTSelect from '@/pages/PhuongThucXT/components/Select';
import NganhDaoTaoSelect from '@/pages/NganhDaoTao/components/Select';
import { PhuongThucXT } from '@/services/PhuongThucXT/typing';
import { NganhDaoTao } from '@/services/NganhDaoTao/typing';
import axios from 'axios';
import { ipLocal } from '@/utils/ip';

const { Option } = Select;

interface WishesFormProps {
	userId: string;
	initialData: { wishes?: ThongTinNguyenVong.IRecord[] } | any;
	onNext: (data: { wishes: ThongTinNguyenVong.IRecord[] }) => void;
	onPrev: (data: any) => void;
	phuongThucXetTuyenData: PhuongThucXT.IRecord[];
	nganhDaoTaoData: NganhDaoTao.IRecord[];
	toHopData: ToHop.IRecord[];
	existingNguyenVong: ThongTinNguyenVong.IRecord[];
}

const WishesForm: React.FC<WishesFormProps> = ({
	userId,
	initialData,
	onNext,
	onPrev,
	phuongThucXetTuyenData,
	nganhDaoTaoData,
	toHopData,
}) => {
	const [form] = Form.useForm();
	const [priorityPoints, setPriorityPoints] = useState({
		diemDoiTuongUT: 0,
		diemKhuVucUT: 0,
	});

	// Lấy dữ liệu cần thiết và tính điểm ưu tiên khi component mount
	useEffect(() => {
		const fetchData = async () => {
			try {
				const [thongTinHocTapRes, hocBaRes] = await Promise.all([
					axios.get(`${ipLocal}/thongTinHocTap?userId=${userId}`),
					axios.get(`${ipLocal}/hocBa?userId=${userId}`),
				]);
				// const thongTinHocTap = thongTinHocTapRes.data[0];
				const thongTinHocTap = initialData.educationGrades;

				const hocBa = hocBaRes.data[0];

				if (!thongTinHocTap || !hocBa) {
					message.error('Không tìm thấy thông tin học tập hoặc học bạ!');
					return;
				}

				// Tính điểm ưu tiên một lần
				const doiTuongUT = (thongTinHocTap?.thongTinTHPT?.doiTuongUT || '').toLowerCase().trim();
				const khuVucUT = (thongTinHocTap?.thongTinTHPT?.khuVucUT || '').toLowerCase().trim();

				const validDoiTuongUT = ['hộ nghèo', 'cận nghèo', 'con liệt sĩ', 'dân tộc thiểu số'];
				const validKhuVucUT = ['kv1', 'kv2', 'kv2nt', 'kv3'];

				const diemDoiTuongUT = validDoiTuongUT.includes(doiTuongUT)
					? doiTuongUT === 'hộ nghèo'
						? 1
						: doiTuongUT === 'cận nghèo'
						? 0.5
						: doiTuongUT === 'con liệt sĩ'
						? 2
						: doiTuongUT === 'dân tộc thiểu số'
						? 1
						: 0
					: 0;

				const diemKhuVucUT = validKhuVucUT.includes(khuVucUT)
					? khuVucUT === 'kv1'
						? 0.75
						: khuVucUT === 'kv2'
						? 0.5
						: khuVucUT === 'kv2nt'
						? 0.25
						: khuVucUT === 'kv3'
						? 0
						: 0
					: 0;

				setPriorityPoints({ diemDoiTuongUT, diemKhuVucUT });

				// Cập nhật điểm cho các nguyện vọng ban đầu
				const wishes = form.getFieldValue('nguyenVong') || [];
				const updatedWishes = wishes.map((nv: any, index: number) =>
					calculateWishPoints(nv, index, thongTinHocTap, hocBa, diemDoiTuongUT, diemKhuVucUT),
				);
				form.setFieldsValue({ nguyenVong: updatedWishes });
			} catch (error) {
				console.error('Error fetching data:', error);
				message.error('Không thể tải dữ liệu học tập hoặc học bạ!');
			}
		};
		fetchData();
	}, [userId, form]);

	// Hàm tính điểm cho một nguyện vọng
	const calculateWishPoints = (
		nv: any,
		index: number,
		thongTinHocTap: any,
		hocBa: any,
		diemDoiTuongUT: number,
		diemKhuVucUT: number,
	) => {
		let diemChuaUT = 0;

		// Kiểm tra dữ liệu đầu vào
		if (!thongTinHocTap?.thongTinTHPT) {
			message.error('Thiếu thông tin học tập hoặc thông tin THPT!');
			return nv;
		}

		// Lấy ngành và tổ hợp xét tuyển
		const nganh = nganhDaoTaoData.find((n: any) => n.ma === nv.maNganh);
		const toHop = toHopData.find((t: any) => t.id === nganh?.toHopXetTuyenId);

		if (nv.phuongThucId && nganh && toHop) {
			// Tính điểm chưa ưu tiên
			if (nv.phuongThucId === 'ptxt_001') {
				toHop.monHoc.forEach((mon: string) => {
					const diemMon =
						thongTinHocTap?.diemTHPT?.find((d: any) => d.mon.toLowerCase() === mon.toLowerCase())?.diem || 0;
					diemChuaUT += diemMon;
				});
			} else if (nv.phuongThucId === 'ptxt_002') {
				toHop.monHoc.forEach((mon: string) => {
					const diemMonHoc = hocBa?.diemMonHoc?.filter((d: any) => d.mon.toLowerCase() === mon.toLowerCase()) || [];
					const avgDiem = diemMonHoc.length
						? diemMonHoc.reduce((sum: number, d: any) => sum + d.diemTongKet, 0) / diemMonHoc.length
						: 0;
					diemChuaUT += avgDiem;
				});
			} else if (nv.phuongThucId === 'ptxt_003') {
				diemChuaUT = thongTinHocTap?.diemDGNL?.tongDiem || 0;
			}
		}

		const diemCoUT = diemChuaUT + diemDoiTuongUT + diemKhuVucUT;
		const tongDiem = diemCoUT;

		return {
			...nv,
			diemChuaUT: Number(diemChuaUT.toFixed(2)),
			diemCoUT: Number(diemCoUT.toFixed(2)),
			diemDoiTuongUT: Number(diemDoiTuongUT.toFixed(2)),
			diemKhuVucUT: Number(diemKhuVucUT.toFixed(2)),
			tongDiem: Number(tongDiem.toFixed(2)),
		};
	};

	// Kiểm tra xem có đủ điểm hợp lệ cho các môn trong tổ hợp xét tuyển không
	const validateWishPoints = async (nv: any) => {
		const nganh = nganhDaoTaoData.find((n) => n.ma === nv.maNganh);
		const toHop = toHopData.find((t) => t.id === nganh?.toHopXetTuyenId);
		const thongTinHocTapRes = await axios.get(`${ipLocal}/thongTinHocTap?userId=${userId}`);
		const hocBaRes = await axios.get(`${ipLocal}/hocBa?userId=${userId}`);
		const thongTinHocTap = thongTinHocTapRes.data[0];
		const hocBa = hocBaRes.data[0];

		if (!thongTinHocTap || !hocBa) {
			return { valid: false, message: 'Không tìm thấy thông tin học tập hoặc học bạ!' };
		}

		if (!toHop || !nganh) {
			return { valid: false, message: 'Không tìm thấy ngành hoặc tổ hợp xét tuyển!' };
		}

		if (nv.phuongThucId == 'ptxt_001') {
			// Kiểm tra điểm THPT cho từng môn trong tổ hợp
			const missingMon = toHop.monHoc.find((mon: string) => {
				const diemMon = thongTinHocTap?.diemTHPT?.find((d: any) => d.mon.toLowerCase() == mon.toLowerCase());
				return !diemMon || diemMon.diem <= 0;
			});
			if (missingMon) {
				return { valid: false, message: `Thiếu điểm môn ${missingMon} trong tổ hợp xét tuyển!` };
			}
		} else if (nv.phuongThucId == 'ptxt_002') {
			// Kiểm tra điểm học bạ cho từng môn trong tổ hợp
			const missingMon = toHop.monHoc.find((mon: string) => {
				const diemMonHoc = hocBa?.diemMonHoc?.filter((d: any) => d.mon.toLowerCase() == mon.toLowerCase()) || [];
				const avgDiem = diemMonHoc.length
					? diemMonHoc.reduce((sum: number, d: any) => sum + d.diemTongKet, 0) / diemMonHoc.length
					: 0;
				return avgDiem <= 0;
			});
			if (missingMon) {
				return { valid: false, message: `Thiếu điểm môn ${missingMon} trong học bạ!` };
			}
		} else if (nv.phuongThucId == 'ptxt_003') {
			// Kiểm tra điểm đánh giá năng lực
			if (!thongTinHocTap?.diemDGNL?.tongDiem || thongTinHocTap?.diemDGNL?.tongDiem <= 0) {
				return { valid: false, message: 'Thiếu điểm đánh giá năng lực!' };
			}
		}

		return { valid: true };
	};

	// Xử lý khi nhấn "Tiếp tục"
	const handleNext = async () => {
		try {
			const values = await form.validateFields();

			// Kiểm tra điểm hợp lệ cho từng nguyện vọng
			for (let i = 0; i < values.nguyenVong.length; i++) {
				const validation = await validateWishPoints(values.nguyenVong[i]);
				if (!validation.valid) {
					message.error(validation.message);
					return;
				}
			}

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
				diemDoiTuongUT: Number(nv.diemDoiTuongUT) || 0,
				diemKhuVucUT: Number(nv.diemKhuVucUT) || 0,
				tongDiem: Number(nv.tongDiem) || 0,
				phuongThucXT: [phuongThucXetTuyenData.find((pt) => pt.id === nv.phuongThucId)?.ten || ''],
			}));

			onNext({ wishes });
		} catch (error) {
			console.error('Validation failed:', error);
			message.error('Vui lòng kiểm tra lại thông tin nguyện vọng!');
		}
	};

	// Cập nhật điểm khi thay đổi ngành hoặc phương thức
	const handleFieldChange = async (changedFields: any, allFields: any) => {
		try {
			if (!changedFields.nguyenVong) return; // Chỉ xử lý khi có thay đổi trong nguyenVong

			const wishes = allFields.nguyenVong || [];
			const thongTinHocTapRes = await axios.get(`${ipLocal}/thongTinHocTap?userId=${userId}`);
			const hocBaRes = await axios.get(`${ipLocal}/hocBa?userId=${userId}`);
			const thongTinHocTap = thongTinHocTapRes.data[0];
			const hocBa = hocBaRes.data[0];

			if (!thongTinHocTap || !hocBa) {
				message.error('Không tìm thấy thông tin học tập hoặc học bạ!');
				return;
			}

			// Chỉ cập nhật nguyện vọng có thay đổi
			const updatedWishes = wishes.map((nv: any, index: number) => {
				const changedWish = changedFields.nguyenVong?.[index];
				if (changedWish && (changedWish.maNganh || changedWish.phuongThucId)) {
					return calculateWishPoints(
						nv,
						index,
						thongTinHocTap,
						hocBa,
						priorityPoints.diemDoiTuongUT,
						priorityPoints.diemKhuVucUT,
					);
				}
				return nv; // Giữ nguyên nếu không có thay đổi
			});

			form.setFieldsValue({ nguyenVong: updatedWishes });
		} catch (error) {
			console.error('Error updating points:', error);
			message.error('Không thể cập nhật điểm!');
		}
	};

	return (
		<Form
			form={form}
			layout='vertical'
			initialValues={{ nguyenVong: initialData.wishes || [] }}
			onValuesChange={handleFieldChange}
		>
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
											<Form.Item {...restField} name={[name, 'diemChuaUT']} label='Điểm chưa ưu tiên'>
												<InputNumber readOnly min={0} max={30} step={0.1} precision={2} style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item {...restField} name={[name, 'diemCoUT']} label='Điểm có ưu tiên'>
												<InputNumber readOnly min={0} max={30} step={0.1} precision={2} style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={8}>
											<Form.Item {...restField} name={[name, 'tongDiem']} label='Tổng điểm'>
												<InputNumber readOnly min={0} max={30} step={0.1} precision={2} style={{ width: '100%' }} />
											</Form.Item>
										</Col>
									</Row>

									<Row gutter={16}>
										<Col span={12}>
											<Form.Item {...restField} name={[name, 'diemDoiTuongUT']} label='Điểm ưu tiên đối tượng'>
												<InputNumber readOnly min={0} max={5} step={0.1} precision={2} style={{ width: '100%' }} />
											</Form.Item>
										</Col>
										<Col span={12}>
											<Form.Item {...restField} name={[name, 'diemKhuVucUT']} label='Điểm ưu tiên khu vực'>
												<InputNumber readOnly min={0} max={5} step={0.1} precision={2} style={{ width: '100%' }} />
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

			<div style={{ textAlign: 'center' }}>
				<Space style={{ textAlign: 'center', marginTop: 16, gap: 16 }}>
					<Button onClick={onPrev}>Quay lại</Button>
					<Button type='primary' onClick={handleNext}>
						Tiếp tục
					</Button>
				</Space>
			</div>
		</Form>
	);
};

export default WishesForm;

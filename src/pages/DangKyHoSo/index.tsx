import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Steps, message, Space, Typography, Spin, Avatar } from 'antd';
import { UserOutlined, BookOutlined, HeartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { history } from 'umi';
import axios from 'axios';
import moment from 'moment';
import StepContent from './components/StepContent';
import Sidebar from './components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useAuth from '../../hooks/useAuth';
import { ipLocal } from '@/utils/ip';

const { Title, Text } = Typography;

interface ApiData {
	user: any;
	heDaoTao: any[];
	phuongThucXetTuyen: any[];
	toHop: any[];
	nganhDaoTao: any[];
	thongTinHocTap: any | null;
	hocBa: any | null;
	thongTinNguyenVong: any[];
	hoSo: any | null;
}

interface FormData {
	personalInfo?: any;
	educationGrades?: any;
	hocBa?: any;
	wishes?: any[];
	hoSoInfo: {
		thongTinBoSung: any;
		thongTinLienHe: any;
	};
}

const UniversityRegistrationForm: React.FC = () => {
	const { user, isAuthenticated, isLoading } = useAuth();
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState<FormData>({ hoSoInfo: { thongTinBoSung: {}, thongTinLienHe: {} } });
	const [showHocBa, setShowHocBa] = useState<boolean>(false);
	const [apiData, setApiData] = useState<ApiData>({
		user: null,
		heDaoTao: [],
		phuongThucXetTuyen: [],
		toHop: [],
		nganhDaoTao: [],
		thongTinHocTap: null,
		hocBa: null,
		thongTinNguyenVong: [],
		hoSo: null,
	});
	const [loading, setLoading] = useState<boolean>(false);

	// Kiểm tra đăng nhập
	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			message.warning('Vui lòng đăng nhập để nộp hồ sơ tuyển sinh.');
			history.push('/user/login');
		} else if (isAuthenticated && user?.id) {
			fetchApiData();
		}
	}, [isAuthenticated, isLoading, user]);

	const fetchApiData = async () => {
		setLoading(true);
		try {
			const [
				userResponse,
				heDaoTaoResponse,
				phuongThucResponse,
				toHopResponse,
				nganhResponse,
				thongTinHocTapResponse,
				hocBaResponse,
				nguyenVongResponse,
				hoSoResponse,
			] = await Promise.all([
				axios.get(`${ipLocal}/users/${user?.id}`),
				axios.get(`${ipLocal}/heDaoTao`),
				axios.get(`${ipLocal}/phuongThucXetTuyen`),
				axios.get(`${ipLocal}/toHop`),
				axios.get(`${ipLocal}/nganhDaoTao`),
				axios.get(`${ipLocal}/thongTinHocTap?userId=${user?.id}`),
				axios.get(`${ipLocal}/hocBa?userId=${user?.id}`),
				axios.get(`${ipLocal}/thongTinNguyenVong?userId=${user?.id}`),
				axios.get(`${ipLocal}/hoSo?thongTinCaNhanId=${user?.id}`),
			]);

			const normalizeHoKhauThuongTru = (data: any) => {
				if (!data) return { tinh_ThanhPho: '', quanHuyen: '', xaPhuong: '', diaChi: '' };
				if (typeof data === 'object' && data.tinh_ThanhPho) {
					return {
						tinh_ThanhPho: data.tinh_ThanhPho || '',
						quanHuyen: data.quanHuyen || '',
						xaPhuong: data.xaPhuong || '',
						diaChi: data.diaChi || '',
					};
				}
				return { tinh_ThanhPho: '', quanHuyen: '', xaPhuong: '', diaChi: String(data) || '' };
			};

			const normalizedUser = {
				...userResponse.data,
				hoKhauThuongTru: normalizeHoKhauThuongTru(userResponse.data.hoKhauThuongTru),
			};

			const newApiData: ApiData = {
				user: normalizedUser,
				heDaoTao: heDaoTaoResponse.data,
				phuongThucXetTuyen: phuongThucResponse.data,
				toHop: toHopResponse.data,
				nganhDaoTao: nganhResponse.data,
				thongTinHocTap: thongTinHocTapResponse.data[0] || null,
				hocBa: hocBaResponse.data[0] || null,
				thongTinNguyenVong: nguyenVongResponse.data || [],
				hoSo: hoSoResponse.data[0] || null,
			};

			setApiData(newApiData);
			setShowHocBa(!!hocBaResponse.data[0]);

			// In index.tsx
			const initialFormData: FormData = {
				personalInfo: normalizedUser || {},
				educationGrades: {
					...thongTinHocTapResponse.data[0],
					diemHocBa: Array.isArray(thongTinHocTapResponse.data[0]?.diemHocBa)
						? thongTinHocTapResponse.data[0].diemHocBa
						: [],
					diemDGNL_DGTD: Array.isArray(thongTinHocTapResponse.data[0]?.diemDGNL_DGTD)
						? thongTinHocTapResponse.data[0].diemDGNL_DGTD
						: [],
					giaiHSG: Array.isArray(thongTinHocTapResponse.data[0]?.giaiHSG) ? thongTinHocTapResponse.data[0].giaiHSG : [],
					chungChi: Array.isArray(thongTinHocTapResponse.data[0]?.chungChi)
						? thongTinHocTapResponse.data[0].chungChi
						: [],
				},
				hocBa: hocBaResponse.data[0] || {},
				wishes: nguyenVongResponse.data || [],
				hoSoInfo: {
					thongTinBoSung: hoSoResponse.data[0]?.thongTinBoSung || {
						danToc: '',
						quocTich: 'Việt Nam',
						tonGiao: '',
						noiSinh: {},
					},
					thongTinLienHe: hoSoResponse.data[0]?.thongTinLienHe || { ten: '', diaChi: {} },
				},
			};

			setFormData(initialFormData);
			form.setFieldsValue({
				hoTen: normalizedUser.fullName || `${normalizedUser.ho} ${normalizedUser.ten}`,
				soCCCD: normalizedUser.soCCCD,
				email: normalizedUser.email,
				soDienThoai: normalizedUser.soDT,
				gioiTinh: normalizedUser.gioiTinh,
				ngaySinh: normalizedUser.ngaySinh ? moment(normalizedUser.ngaySinh) : undefined,
				hoKhauThuongTru: normalizedUser.hoKhauThuongTru
					? `${normalizedUser.hoKhauThuongTru.tinh_ThanhPho}, ${normalizedUser.hoKhauThuongTru.quanHuyen}, ${normalizedUser.hoKhauThuongTru.xaPhuong}, ${normalizedUser.hoKhauThuongTru.diaChi}`
					: undefined,
				ngayCap: normalizedUser.ngayCap ? moment(normalizedUser.ngayCap) : undefined,
				noiCap: normalizedUser.noiCap,
				thongTinBoSung: initialFormData.hoSoInfo.thongTinBoSung,
				thongTinLienHe: initialFormData.hoSoInfo.thongTinLienHe,
				avatar: initialFormData.personalInfo.avatar,
			});
		} catch (error) {
			console.error('Error fetching data:', error);
			message.error('Không thể tải dữ liệu. Vui lòng thử lại!');
		} finally {
			setLoading(false);
		}
	};

	const handleNext = (stepData: Partial<FormData>) => {
		setFormData((prev) => ({ ...prev, ...stepData }));
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrev = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		try {
			if (!formData.personalInfo?.ho || !formData.personalInfo?.ten || !formData.personalInfo?.soCCCD) {
				message.error('Vui lòng điền đầy đủ thông tin cá nhân!');
				setLoading(false);
				return;
			}

			if (!formData.educationGrades?.thongTinTHPT?.ten || !formData.educationGrades?.thongTinTHPT?.namTotNghiep) {
				message.error('Vui lòng điền đầy đủ thông tin học tập!');
				setLoading(false);
				return;
			}

			if (!formData.wishes || formData.wishes.length === 0) {
				message.error('Vui lòng chọn ít nhất một nguyện vọng!');
				setLoading(false);
				return;
			}

			if (formData.personalInfo) {
				const userUpdateData = {
					...apiData.user,
					ho: formData.personalInfo.ho,
					ten: formData.personalInfo.ten,
					username: formData.personalInfo.username,
					ngaySinh: formData.personalInfo.ngaySinh,
					gioiTinh: formData.personalInfo.gioiTinh,
					email: formData.personalInfo.email,
					soDT: formData.personalInfo.soDT,
					soCCCD: formData.personalInfo.soCCCD,
					ngayCap: formData.personalInfo.ngayCap,
					noiCap: formData.personalInfo.noiCap,
					hoKhauThuongTru: formData.personalInfo.hoKhauThuongTru || {},
					avatar: formData.personalInfo.avatar,
				};
				await axios.put(`${ipLocal}/users/${user?.id}`, userUpdateData);
			}

			const submissionData = {
				thongTinCaNhanId: user?.id,
				thongTinHocTapId: apiData.thongTinHocTap?.id || '',
				thongTinBoSung: {
					danToc: formData?.hoSoInfo.thongTinBoSung?.danToc || 'none',
					quocTich: formData?.hoSoInfo.thongTinBoSung?.quocTich || 'Việt Nam',
					tonGiao: formData?.hoSoInfo.thongTinBoSung?.tonGiao || 'Không',
					noiSinh: formData?.hoSoInfo.thongTinBoSung?.noiSinh || {},
				},
				thongTinLienHe: {
					ten: `${formData.personalInfo?.ho || ''} ${formData.personalInfo?.ten || ''}`.trim(),
					diaChi: {
						tinh_ThanhPho: formData?.hoSoInfo.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
						quanHuyen: formData?.hoSoInfo.thongTinLienHe?.diaChi?.quanHuyen || '',
						xaPhuong: formData?.hoSoInfo.thongTinLienHe?.diaChi?.xaPhuong || '',
						diaChiCuThe: formData?.hoSoInfo.thongTinLienHe?.diaChi?.diaChiCuThe || '',
					},
				},
				nguyenVong: formData.wishes?.map((wish) => wish.id) || [],
				tinhTrang: 'chờ duyệt',
				ketQua: null,
			};

			if (formData.educationGrades) {
				const educationData = {
					...formData.educationGrades,
					userId: user?.id,
					thongTinTHPT: {
						...formData.educationGrades.thongTinTHPT,
						tinh_ThanhPho: formData.educationGrades.thongTinTHPT?.tinh_ThanhPho || '',
						quanHuyen: formData.educationGrades.thongTinTHPT?.quanHuyen || '',
						xaPhuong: formData.educationGrades.thongTinTHPT?.xaPhuong || '',
						diaChi: formData.educationGrades.thongTinTHPT?.diaChi || '',
						maTruong: formData.educationGrades.thongTinTHPT?.maTruong || '',
						doiTuongUT: formData.educationGrades.thongTinTHPT?.doiTuongUT || '',
						khuVucUT: formData.educationGrades.thongTinTHPT?.khuVucUT || '',
						daTotNghiep: formData.educationGrades.thongTinTHPT?.daTotNghiep || false,
						namTotNghiep: formData.educationGrades.thongTinTHPT?.namTotNghiep || '',
					},
				};
				if (apiData.thongTinHocTap) {
					await axios.put(`${ipLocal}/thongTinHocTap/${apiData.thongTinHocTap.id}`, educationData);
				} else {
					await axios.post(`${ipLocal}/thongTinHocTap`, educationData);
				}
			}

			if (formData.hocBa && showHocBa) {
				const hocBaData = {
					...formData.hocBa,
					userId: user?.id,
				};
				if (apiData.hocBa) {
					await axios.put(`${ipLocal}/hocBa/${apiData.hocBa.id}`, hocBaData);
				} else {
					await axios.post(`${ipLocal}/hocBa`, hocBaData);
				}
			}

			if (formData.wishes && formData.wishes.length > 0) {
				if (apiData.thongTinNguyenVong.length > 0) {
					await Promise.all(
						apiData.thongTinNguyenVong.map((wish) => axios.delete(`${ipLocal}/thongTinNguyenVong/${wish.id}`)),
					);
				}
				await Promise.all(
					formData.wishes.map((wish) =>
						axios.post(`${ipLocal}/thongTinNguyenVong`, {
							...wish,
							userId: user?.id,
						}),
					),
				);
			}

			if (apiData.hoSo) {
				await axios.put(`${ipLocal}/hoSo/${apiData.hoSo.id}`, submissionData);
			} else {
				const newHoSoId = `HOSO${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
				await axios.post(`${ipLocal}/hoSo`, {
					id: newHoSoId,
					...submissionData,
				});
			}

			message.success('Nộp hồ sơ thành công! Cảm ơn bạn đã đăng ký.');
			history.push('/public/dash-board');
		} catch (error) {
			console.error('Error submitting form:', error);
			message.error('Có lỗi xảy ra khi nộp hồ sơ!');
		} finally {
			setLoading(false);
		}
	};

	const steps = [
		{ title: 'Thông tin cá nhân', icon: <UserOutlined /> },
		{ title: 'Thông tin học tập', icon: <BookOutlined /> },
		{ title: 'Nguyện vọng', icon: <HeartOutlined /> },
		{ title: 'Hoàn tất', icon: <CheckCircleOutlined /> },
	];

	if (isLoading || loading) {
		return (
			<div style={{ textAlign: 'center', padding: '50px' }}>
				<Spin size='large' />
				<div style={{ marginTop: '16px' }}>Đang tải...</div>
			</div>
		);
	}

	return (
		<>
			<Header />
			<Row
				justify='center'
				style={{
					minHeight: '100vh',
					background: '#f5f5f5',
					padding: '20px',
					boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
				}}
			>
				<Col xs={24} lg={20}>
					<Row gutter={24} style={{ margin: '90px auto' }}>
						<Col xs={24} lg={6}>
							<Sidebar currentStep={currentStep} />
						</Col>
						<Col xs={24} lg={18}>
							<Card
								title={
									<div style={{ display: 'flex', alignItems: 'center' }}>
										{React.cloneElement(steps[currentStep].icon, {
											style: { marginRight: '8px', color: '#ff4d4f' },
										})}
										<Title level={4} style={{ margin: 0 }}>
											{steps[currentStep].title}
										</Title>
									</div>
								}
								extra={
									<Text type='secondary'>
										Bước {currentStep + 1} / {steps.length}
									</Text>
								}
							>
								<Form form={form} layout='vertical'>
									<StepContent
										currentStep={currentStep}
										formData={formData}
										setFormData={setFormData}
										showHocBa={showHocBa}
										setShowHocBa={setShowHocBa}
										apiData={apiData}
										userId={user?.id || ''}
										onNext={handleNext}
										onPrev={handlePrev}
										onSubmit={handleSubmit}
										loading={loading} // Truyền prop loading
									/>
								</Form>
							</Card>
						</Col>
					</Row>
				</Col>
			</Row>
			<Footer />
		</>
	);
};

export default UniversityRegistrationForm;

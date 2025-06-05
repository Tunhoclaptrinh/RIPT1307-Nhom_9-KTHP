import React, { useState, useEffect } from 'react';
import { Modal, Steps, Button, Space, message, Spin } from 'antd';
import { UserOutlined, BookOutlined, HeartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

import PersonalInfoForm from './PersonalInfor';
import EducationGradesForm from './EducationGrades';
import WishesForm from './Wishes';
import SummaryForm from './Summary';
import { ipLocal } from '@/utils/ip';

const { Step } = Steps;

// Type definitions based on your JSON structure
interface DiaChi {
	tinh_ThanhPho: string;
	quanHuyen: string;
	xaPhuong: string;
	diaChi?: string;
	diaChiCuThe?: string;
}

interface User {
	id: string;
	password: string;
	username: string;
	soCCCD: string;
	ngayCap: string;
	noiCap: string;
	ho: string;
	ten: string;
	hoKhauThuongTru: DiaChi;
	ngaySinh: string;
	gioiTinh: string;
	email: string;
	soDT: string;
	avatar?: string;
	role?: string;
	thongTinBoSung?: {
		danToc?: string;
		quocTich?: string;
		tonGiao?: string;
	};
	thongTinLienHe?: DiaChi;
}

interface HeDaoTao {
	id: string;
	ten: string;
}

interface PhuongThucXetTuyen {
	id: string;
	ten: string;
	nguyenTac: string;
}

interface ToHop {
	id: string;
	monHoc: string[];
}

interface NganhDaoTao {
	id: string;
	ma: string;
	ten: string;
	moTa: string;
	toHopXetTuyenId: string;
}

interface DiemMon {
	mon: string;
	diem: number;
}

interface DiemHocBa {
	mon: string;
	hocKy: string;
	diemTongKet: number;
}

interface HocBa {
	id: string;
	userId: string | null;
	thongTinHocTapId?: string;
	diemMonHoc: DiemHocBa[];
	loaiHanhKiem: string;
	minhChung: string;
}

interface DiemDanhGia {
	mon: { ten: string; diem: number }[];
	tongDiem: number;
	minhChung?: string;
}

interface GiaiHSG {
	giaiHsgCap: string;
	mon: string;
	loaiGiai: string;
	nam: string;
	noiCap: string;
	minhChung: string;
}

interface ChungChi {
	loaiCC: string;
	ketQua: string;
	minhChung: string;
}

interface ThongTinTHPT {
	tinh_ThanhPho: string;
	quanHuyen: string;
	xaPhuong: string;
	diaChi: string;
	maTruong: string;
	maTinh: string;
	doiTuongUT: string;
	khuVucUT: string;
	daTotNghiep: boolean;
	namTotNghiep: string;
}

interface ThongTinHocTap {
	id: string;
	userId: string | null;
	thongTinTHPT: ThongTinTHPT;
	hocBaId?: string;
	diemTHPT: DiemMon[];
	diemDGTD?: DiemDanhGia;
	diemDGNL?: DiemDanhGia;
	giaiHSG?: GiaiHSG;
	chungChi?: ChungChi[];
}

interface ThongTinNguyenVong {
	id: string;
	userId: string | null;
	thuTuNV: number;
	maNganh?: string;
	ten: string;
	coSoDaoTao?: string;
	phuongThucId: string;
	diemChuaUT: number;
	diemCoUT: number;
	diemDoiTuongUT: number;
	diemKhuVucUT: number;
	tongDiem: number;
	phuongThucXT?: string[];
}

interface HoSo {
	id: string;
	thongTinCaNhanId: string;
	thongTinHocTapId?: string;
	thongTinBoSung: {
		danToc: string;
		quocTich: string;
		tonGiao: string;
		noiSinh: {
			trongNuoc: boolean;
			tinh_ThanhPho: string;
		};
	};
	thongTinLienHe: {
		ten: string;
		diaChi: DiaChi;
	};
	nguyenVong: string[];
	tinhTrang: string;
	ketQua?: {
		success?: boolean;
		succes?: boolean; // Keep typo for backward compatibility
		nguyenVong?: string;
		nguyenVongDo?: string;
		phuongThucId: string;
		diem: number;
	} | null;
}

interface ApiData {
	user: User | null;
	heDaoTao: HeDaoTao[];
	phuongThucXetTuyen: PhuongThucXetTuyen[];
	toHop: ToHop[];
	nganhDaoTao: NganhDaoTao[];
	thongTinHocTap: ThongTinHocTap | null;
	hocBa: HocBa | null;
	thongTinNguyenVong: ThongTinNguyenVong[];
	hoSo: HoSo | null;
}

interface FormData {
	personalInfo?: Partial<User>;
	educationGrades?: Partial<ThongTinHocTap>;
	hocBa?: Partial<HocBa>;
	wishes?: ThongTinNguyenVong[];
}

interface StepInfo {
	title: string;
	icon: React.ReactNode;
	description: string;
}

interface AdmissionStepModalProps {
	userId: string;
	visible: boolean;
	onClose?: () => void;
}

const AdmissionStepModal: React.FC<AdmissionStepModalProps> = ({ userId, visible, onClose }) => {
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [formData, setFormData] = useState<FormData>({});
	const [showHocBa, setShowHocBa] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
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

	// Fetch data from API
	useEffect(() => {
		if (visible && userId) {
			fetchApiData();
		}
	}, [visible, userId]);

	const fetchApiData = async (): Promise<void> => {
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
				axios.get<User>(`${ipLocal}/users/${userId}`),
				axios.get<HeDaoTao[]>(`${ipLocal}/heDaoTao`),
				axios.get<PhuongThucXetTuyen[]>(`${ipLocal}/phuongThucXetTuyen`),
				axios.get<ToHop[]>(`${ipLocal}/toHop`),
				axios.get<NganhDaoTao[]>(`${ipLocal}/nganhDaoTao`),
				axios.get<ThongTinHocTap[]>(`${ipLocal}/thongTinHocTap?userId=${userId}`),
				axios.get<HocBa[]>(`${ipLocal}/hocBa?userId=${userId}`),
				axios.get<ThongTinNguyenVong[]>(`${ipLocal}/thongTinNguyenVong?userId=${userId}`),
				axios.get<HoSo[]>(`${ipLocal}/hoSo?thongTinCaNhanId=${userId}`),
			]);

			const newApiData: ApiData = {
				user: userResponse.data,
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

			// Pre-fill form data if user has existing data
			const initialFormData: FormData = {};

			if (userResponse.data) {
				initialFormData.personalInfo = userResponse.data;
			}

			if (thongTinHocTapResponse.data[0]) {
				initialFormData.educationGrades = thongTinHocTapResponse.data[0];
			}

			if (hocBaResponse.data[0]) {
				initialFormData.hocBa = hocBaResponse.data[0];
				setShowHocBa(true);
			}

			if (nguyenVongResponse.data && nguyenVongResponse.data.length > 0) {
				initialFormData.wishes = nguyenVongResponse.data;
			}

			setFormData(initialFormData);
		} catch (error) {
			console.error('Error fetching data:', error);
			message.error('Không thể tải dữ liệu. Vui lòng thử lại!');
		} finally {
			setLoading(false);
		}
	};

	const steps: StepInfo[] = [
		{
			title: 'Thông tin cá nhân',
			icon: <UserOutlined />,
			description: 'Cập nhật thông tin cá nhân',
		},
		{
			title: 'Điểm, Chứng chỉ & Học bạ',
			icon: <BookOutlined />,
			description: 'Thông tin trường THPT, điểm thi và học bạ',
		},
		{
			title: 'Nguyện vọng',
			icon: <HeartOutlined />,
			description: 'Chọn ngành và phương thức xét tuyển',
		},
		{
			title: 'Hoàn tất',
			icon: <CheckCircleOutlined />,
			description: 'Xem lại và nộp hồ sơ',
		},
	];

	const handleNext = (stepData: Partial<FormData>): void => {
		const updatedFormData: FormData = { ...formData, ...stepData };
		setFormData(updatedFormData);

		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handlePrev = (): void => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async (): Promise<void> => {
		setLoading(true);
		try {
			// Cập nhật thông tin user với thông tin bổ sung từ personalInfo
			if (formData.personalInfo) {
				const userUpdateData: Partial<User> = {
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
					hoKhauThuongTru: formData.personalInfo.thongTinLienHe || formData.personalInfo.hoKhauThuongTru,
					// Thêm thông tin bổ sung vào user record
					thongTinBoSung: formData.personalInfo.thongTinBoSung || {},
				};

				await axios.put(`${ipLocal}/users/${userId}`, userUpdateData);
			}

			// Prepare data for hoSo submission
			const submissionData: Partial<HoSo> = {
				thongTinCaNhanId: userId,
				thongTinBoSung: {
					// Lấy thông tin bổ sung từ personalInfo
					danToc: formData.personalInfo?.thongTinBoSung?.danToc || '',
					quocTich: formData.personalInfo?.thongTinBoSung?.quocTich || 'Việt Nam',
					tonGiao: formData.personalInfo?.thongTinBoSung?.tonGiao || '',
					// Thêm thông tin nơi sinh nếu cần
					noiSinh: {
						trongNuoc: true,
						tinh_ThanhPho:
							formData.personalInfo?.thongTinLienHe?.tinh_ThanhPho ||
							formData.personalInfo?.hoKhauThuongTru?.tinh_ThanhPho ||
							'',
					},
				},
				thongTinLienHe: {
					// Sử dụng thông tin liên hệ từ personalInfo
					ten: `${formData.personalInfo?.ho || ''} ${formData.personalInfo?.ten || ''}`.trim(),
					diaChi: {
						tinh_ThanhPho:
							formData.personalInfo?.thongTinLienHe?.tinh_ThanhPho ||
							formData.personalInfo?.hoKhauThuongTru?.tinh_ThanhPho ||
							'',
						quanHuyen:
							formData.personalInfo?.thongTinLienHe?.quanHuyen ||
							formData.personalInfo?.hoKhauThuongTru?.quanHuyen ||
							'',
						xaPhuong:
							formData.personalInfo?.thongTinLienHe?.xaPhuong || formData.personalInfo?.hoKhauThuongTru?.xaPhuong || '',
						diaChiCuThe:
							formData.personalInfo?.thongTinLienHe?.diaChi || formData.personalInfo?.hoKhauThuongTru?.diaChi || '',
					},
				},
				nguyenVong: formData.wishes?.map((wish) => wish.id) || [],
				tinhTrang: 'chờ duyệt',
				ketQua: null,
			};

			// Create or update thongTinHocTap if needed
			if (formData.educationGrades) {
				if (apiData.thongTinHocTap) {
					await axios.put(`${ipLocal}/thongTinHocTap/${apiData.thongTinHocTap.id}`, {
						...apiData.thongTinHocTap,
						...formData.educationGrades,
					});
				} else {
					await axios.post(`${ipLocal}/thongTinHocTap`, {
						userId: userId,
						...formData.educationGrades,
					});
				}
			}

			// Create or update hocBa if needed
			if (formData.hocBa && showHocBa) {
				if (apiData.hocBa) {
					await axios.put(`${ipLocal}/hocBa/${apiData.hocBa.id}`, {
						...apiData.hocBa,
						...formData.hocBa,
					});
				} else {
					await axios.post(`${ipLocal}/hocBa`, {
						userId: userId,
						...formData.hocBa,
					});
				}
			}

			// Create or update nguyenVong
			if (formData.wishes && formData.wishes.length > 0) {
				// Delete existing wishes
				const existingWishes = await axios.get<ThongTinNguyenVong[]>(`${ipLocal}/thongTinNguyenVong?userId=${userId}`);
				for (const wish of existingWishes.data) {
					await axios.delete(`${ipLocal}/thongTinNguyenVong/${wish.id}`);
				}

				// Create new wishes
				for (const wish of formData.wishes) {
					await axios.post(`${ipLocal}/thongTinNguyenVong`, {
						...wish,
						userId: userId,
					});
				}
			}

			// Create or update hoSo
			if (apiData.hoSo) {
				await axios.put(`${ipLocal}/hoSo/${apiData.hoSo.id}`, {
					...apiData.hoSo,
					...submissionData,
				});
			} else {
				const newHoSoId = `HOSO${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
				await axios.post(`${ipLocal}/hoSo`, {
					id: newHoSoId,
					...submissionData,
				});
			}

			message.success('Nộp hồ sơ thành công!');
			handleClose();
		} catch (error) {
			console.error('Error submitting form:', error);
			message.error('Có lỗi xảy ra khi nộp hồ sơ!');
		} finally {
			setLoading(false);
		}
	};

	const handleClose = (): void => {
		// Reset all states when closing
		setCurrentStep(0);
		setFormData({});
		setShowHocBa(false);
		setApiData({
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
		// Call parent's onClose function
		if (onClose) {
			onClose();
		}
	};

	const getStepContent = (): React.ReactNode => {
		if (loading) {
			return (
				<div style={{ textAlign: 'center', padding: '50px' }}>
					<Spin size='large' />
					<div style={{ marginTop: '16px' }}>Đang tải dữ liệu...</div>
				</div>
			);
		}

		switch (currentStep) {
			case 0:
				return (
					<PersonalInfoForm
						userId={userId}
						initialData={formData}
						onNext={handleNext}
						userData={apiData.user}
						existingHoSo={apiData.hoSo}
					/>
				);
			case 1:
				return (
					<EducationGradesForm
						userId={userId}
						initialData={formData}
						showHocBa={showHocBa}
						setShowHocBa={setShowHocBa}
						onNext={handleNext}
						heDaoTaoData={apiData.heDaoTao}
						toHopData={apiData.toHop}
						existingThongTinHocTap={apiData.thongTinHocTap}
						existingHocBa={apiData.hocBa}
					/>
				);
			case 2:
				return (
					<WishesForm
						userId={userId}
						initialData={formData}
						onNext={handleNext}
						phuongThucXetTuyenData={apiData.phuongThucXetTuyen}
						nganhDaoTaoData={apiData.nganhDaoTao}
						toHopData={apiData.toHop}
						existingNguyenVong={apiData.thongTinNguyenVong}
					/>
				);
			case 3:
				return <SummaryForm userId={userId} formData={formData} showHocBa={showHocBa} apiData={apiData} />;
			default:
				return null;
		}
	};

	return (
		<Modal
			title='Hồ sơ xét tuyển đại học'
			visible={visible}
			onCancel={handleClose}
			width={1000}
			footer={null}
			destroyOnClose
		>
			<Steps current={currentStep} style={{ marginBottom: 24 }}>
				{steps.map((step, index) => (
					<Step key={index} title={step.title} description={step.description} icon={step.icon} />
				))}
			</Steps>

			<div style={{ marginBottom: 24 }}>{getStepContent()}</div>

			<div style={{ textAlign: 'center' }}>
				<Space>
					{currentStep > 0 && <Button onClick={handlePrev}>Quay lại</Button>}

					{currentStep === steps.length - 1 && (
						<Button type='primary' onClick={handleSubmit}>
							Nộp hồ sơ
						</Button>
					)}
				</Space>
			</div>
		</Modal>
	);
};

export default AdmissionStepModal;

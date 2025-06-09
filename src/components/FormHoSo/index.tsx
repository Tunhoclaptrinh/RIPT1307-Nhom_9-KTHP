import React, { useState, useEffect } from 'react';
import { Modal, Steps, Button, Space, message, Spin } from 'antd';
import { UserOutlined, BookOutlined, HeartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

import PersonalInfoForm from './PersonalInfor';
import EducationGradesForm from './EducationGrades';
import WishesForm from './Wishes';
import SummaryForm from './Summary';
import { ipLocal } from '@/utils/ip';
import { HoSo } from '@/services/HoSo/typing';

const { Step } = Steps;

interface ApiData {
	user: User.IRecord | null;
	heDaoTao: HeDaoTao.IRecord[];
	phuongThucXetTuyen: PhuongThucXT.IRecord[];
	toHop: ToHop.IRecord[];
	nganhDaoTao: NganhDaoTao.IRecord[];
	thongTinHocTap: ThongTinHocTap.IRecord | null;
	hocBa: DiemHocSinh.IRecord | null;
	thongTinNguyenVong: ThongTinNguyenVong.IRecord[];
	hoSo: HoSo.IRecord | null;
}

interface FormData {
	personalInfo?: Partial<User.IRecord>;
	educationGrades?: Partial<ThongTinHocTap.IRecord>;
	hocBa?: Partial<DiemHocSinh.IRecord>;
	wishes?: ThongTinNguyenVong.IRecord[];
	hoSoInfo: {
		thongTinBoSung: Partial<HoSo.IThongTinBoSung>;
		thongTinLienHe: Partial<HoSo.IThongTinLienHe>;
	};
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
	withDrawer?: string | number;
}

const AdmissionStepModal: React.FC<AdmissionStepModalProps> = ({ userId, visible, onClose, withDrawer = 1000 }) => {
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
				axios.get<User.IRecord>(`${ipLocal}/users/${userId}`),
				axios.get<HeDaoTao.IRecord[]>(`${ipLocal}/heDaoTao`),
				axios.get<PhuongThucXT.IRecord[]>(`${ipLocal}/phuongThucXetTuyen`),
				axios.get<ToHop.IRecord[]>(`${ipLocal}/toHop`),
				axios.get<NganhDaoTao.IRecord[]>(`${ipLocal}/nganhDaoTao`),
				axios.get<ThongTinHocTap.IRecord[]>(`${ipLocal}/thongTinHocTap?userId=${userId}`),
				axios.get<DiemHocSinh.IRecord[]>(`${ipLocal}/hocBa?userId=${userId}`),
				axios.get<ThongTinNguyenVong.IRecord[]>(`${ipLocal}/thongTinNguyenVong?userId=${userId}`),
				axios.get<HoSo.IRecord[]>(`${ipLocal}/hoSo?thongTinCaNhanId=${userId}`),
			]);

			// Normalize hoKhauThuongTru to handle inconsistent data
			const normalizeHoKhauThuongTru = (data: any) => {
				if (!data) {
					return { tinh_ThanhPho: '', quanHuyen: '', xaPhuong: '', diaChi: '' };
				}
				if (typeof data === 'object' && data.tinh_ThanhPho) {
					return {
						tinh_ThanhPho: data.tinh_ThanhPho || '',
						quanHuyen: data.quanHuyen || '',
						xaPhuong: data.xaPhuong || '',
						diaChi: data.diaChi || '',
					};
				}
				// Handle cases where hoKhauThuongTru is a string, number, or other non-object type
				return {
					tinh_ThanhPho: '',
					quanHuyen: '',
					xaPhuong: '',
					diaChi: String(data) || '',
				};
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

			// Pre-fill form data if user has existing data
			const initialFormData: FormData = {
				personalInfo: normalizedUser || {},
				educationGrades: thongTinHocTapResponse.data[0] || {},
				hocBa: hocBaResponse.data[0] || {},
				wishes: nguyenVongResponse.data || [],
				hoSoInfo: {
					thongTinBoSung: hoSoResponse.data[0].thongTinBoSung || {},
					thongTinLienHe: hoSoResponse.data[0].thongTinLienHe || {},
				},
			};

			setFormData(initialFormData);
			setShowHocBa(!!hocBaResponse.data[0]);
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
		setFormData((prev) => ({ ...prev, ...stepData }));
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
			// Validate required fields
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

			// Update user info
			if (formData.personalInfo) {
				const userUpdateData: Partial<User.IRecord> = {
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
				};
				await axios.put(`${ipLocal}/users/${userId}`, userUpdateData);
			}

			// Prepare data for hoSo submission
			const submissionData: Partial<HoSo.IRecord> = {
				thongTinCaNhanId: userId,
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
						quanHuyen: formData.hoSoInfo.thongTinLienHe?.diaChi?.quanHuyen || '',
						xaPhuong: formData.hoSoInfo.thongTinLienHe?.diaChi?.xaPhuong || '',
						diaChiCuThe:
							formData?.hoSoInfo.thongTinLienHe?.diaChi?.diaChiCuThe ||
							// formData.personalInfo?.thongTinLienHe?.diaChi ||
							// formData.personalInfo?.hoKhauThuongTru?.diaChi ||
							'',
					},
				},
				nguyenVong: formData.wishes?.map((wish) => wish.id) || [],
				tinhTrang: 'chờ duyệt',
				ketQua: null,
			};

			// Create or update thongTinHocTap
			// if (formData.educationGrades) {
			// 	const educationData = {
			// 		...formData.educationGrades,
			// 		userId: userId,
			// 	};
			// 	if (apiData.thongTinHocTap) {
			// 		await axios.put(`${ipLocal}/thongTinHocTap/${apiData.thongTinHocTap.id}`, educationData);
			// 	} else {
			// 		await axios.post(`${ipLocal}/thongTinHocTap`, educationData);
			// 	}
			// }
			// Create or update thongTinHocTap
			if (formData.educationGrades) {
				const educationData = {
					...formData.educationGrades,
					userId: userId,
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

			// Create or update hocBa
			if (formData.hocBa && showHocBa) {
				const hocBaData = {
					...formData.hocBa,
					userId: userId,
				};
				if (apiData.hocBa) {
					await axios.put(`${ipLocal}/hocBa/${apiData.hocBa.id}`, hocBaData);
				} else {
					await axios.post(`${ipLocal}/hocBa`, hocBaData);
				}
			}

			// Create or update nguyenVong
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
							userId: userId,
						}),
					),
				);
			}

			// Create or update hoSo
			if (apiData.hoSo) {
				await axios.put(`${ipLocal}/hoSo/${apiData.hoSo.id}`, submissionData);
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
		onClose?.();
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
						onPrev={handlePrev}
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
						onPrev={handlePrev}
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
						onPrev={handlePrev}
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
			// width={withDrawer}
			className={withDrawer}
			width={withDrawer}
			height={'100%'}
			footer={null}
			destroyOnClose
			style={{ background: '#fff' }}
		>
			<Steps current={currentStep} style={{ marginBottom: 24, background: '#fff' }}>
				{steps.map((step, index) => (
					<Step
						key={index}
						title={step.title}
						description={step.description}
						icon={step.icon}
						style={{ background: '#fff' }}
					/>
				))}
			</Steps>

			<div style={{ marginBottom: 24 }}>{getStepContent()}</div>

			<div style={{ textAlign: 'center' }}>
				{currentStep === steps.length - 1 && (
					<Space>
						{currentStep > 0 && <Button onClick={handlePrev}>Quay lại</Button>}

						<Button type='primary' onClick={handleSubmit} loading={loading}>
							Nộp hồ sơ
						</Button>
					</Space>
				)}
			</div>
		</Modal>
	);
};

export default AdmissionStepModal;

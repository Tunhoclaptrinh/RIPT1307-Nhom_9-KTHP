import React from 'react';
import { Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import PersonalInfo from './TTCaNhan';
import EducationInfo from './TTHocTap';
import WishList from './NguyenVong';
import Summary from './Summary';

const { Title, Text } = Typography;

interface StepContentProps {
	currentStep: number;
	formData: any;
	setFormData: (data: any) => void;
	showHocBa: boolean;
	setShowHocBa: (value: boolean) => void;
	apiData: any;
	userId: string;
	onNext: (data: any) => void;
	onPrev: () => void;
	onSubmit: () => void;
}

const StepContent: React.FC<StepContentProps> = ({
	currentStep,
	formData,
	setFormData,
	showHocBa,
	setShowHocBa,
	apiData,
	userId,
	onNext,
	onPrev,
	onSubmit,
}) => {
	switch (currentStep) {
		case 0:
			return (
				<PersonalInfo
					userId={userId}
					initialData={formData}
					onNext={onNext}
					onPrev={onPrev}
					userData={apiData.user}
					existingHoSo={apiData.hoSo}
				/>
			);
		case 1:
			return (
				<EducationInfo
					userId={userId}
					initialData={formData}
					showHocBa={showHocBa}
					setShowHocBa={setShowHocBa}
					onNext={onNext}
					onPrev={onPrev}
					heDaoTaoData={apiData.heDaoTao}
					toHopData={apiData.toHop}
					existingThongTinHocTap={apiData.thongTinHocTap}
					existingHocBa={apiData.hocBa}
				/>
			);
		case 2:
			return (
				<WishList
					userId={userId}
					initialData={formData}
					onNext={onNext}
					onPrev={onPrev}
					phuongThucXetTuyenData={apiData.phuongThucXetTuyen}
					nganhDaoTaoData={apiData.nganhDaoTao}
					toHopData={apiData.toHop}
					existingNguyenVong={apiData.thongTinNguyenVong}
				/>
			);
		case 3:
			return (
				<Summary
					userId={userId}
					formData={formData}
					showHocBa={showHocBa}
					apiData={apiData}
					onSubmit={onSubmit}
					onPrev={onPrev}
				/>
			);
		default:
			return null;
	}
};

export default StepContent;

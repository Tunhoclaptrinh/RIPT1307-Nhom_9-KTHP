import React from 'react';
import Summary from './Summary';
import PersonalInfo from './TTCaNhan';
import EducationInfo from './TTHocTap';
import WishList from './NguyenVong';
import { Button, Space } from 'antd';

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
	loading: boolean;
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
	loading,
}) => {
	const steps = [
		{
			component: (
				<PersonalInfo
					key='personal'
					userId={userId}
					initialData={formData}
					onNext={onNext}
					onPrev={onPrev}
					userData={apiData.user}
					existingHoSo={apiData.hoSo}
				/>
			),
		},
		{
			component: (
				<EducationInfo
					key='education'
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
			),
		},
		{
			component: (
				<WishList
					key='wishes'
					userId={userId}
					initialData={formData}
					onNext={onNext}
					onPrev={onPrev}
					phuongThucXetTuyenData={apiData.phuongThucXetTuyen}
					nganhDaoTaoData={apiData.nganhDaoTao}
					toHopData={apiData.toHop}
					existingNguyenVong={apiData.thongTinNguyenVong}
				/>
			),
		},
		{
			component: <Summary key='summary' userId={userId} formData={formData} showHocBa={showHocBa} apiData={apiData} />,
		},
	];

	return (
		<div>
			{steps[currentStep]?.component || null}
			<div style={{ textAlign: 'center', marginTop: 16 }}>
				<Space>
					{currentStep == steps.length - 1 && (
						<Button onClick={onPrev} disabled={loading}>
							Quay lại
						</Button>
					)}
					{currentStep < steps.length - 1 ? (
						// <Button type='primary' onClick={() => onNext(formData)} loading={loading}>
						// 	Tiếp tục
						// </Button>
						<></>
					) : (
						<Button type='primary' onClick={onSubmit} loading={loading}>
							Nộp hồ sơ
						</Button>
					)}
				</Space>
			</div>
		</div>
	);
};

export default StepContent;

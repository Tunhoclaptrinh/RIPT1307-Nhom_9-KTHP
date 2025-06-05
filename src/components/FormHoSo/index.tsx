import React, { useState } from 'react';
import { Modal, Steps, Button, Space, message } from 'antd';
import { UserOutlined, BookOutlined, HeartOutlined, CheckCircleOutlined } from '@ant-design/icons';

import PersonalInfoForm from './PersonalInfor';
import EducationGradesForm from './EducationGrades';
import WishesForm from './Wishes';
import SummaryForm from './Summary';

const { Step } = Steps;

const AdmissionStepModal = ({ userId }) => {
	const [visible, setVisible] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] = useState({});
	const [showHocBa, setShowHocBa] = useState(false);

	const steps = [
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

	const handleNext = (stepData) => {
		const updatedFormData = { ...formData, ...stepData };
		setFormData(updatedFormData);

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
		try {
			// Here you would submit all data to your API
			console.log('Final form data:', formData);
			console.log('User ID:', userId);
			message.success('Nộp hồ sơ thành công!');
			setVisible(false);
			setCurrentStep(0);
			setFormData({});
			setShowHocBa(false);
		} catch (error) {
			message.error('Có lỗi xảy ra khi nộp hồ sơ!');
		}
	};

	const handleClose = () => {
		setVisible(false);
		setCurrentStep(0);
		setFormData({});
		setShowHocBa(false);
	};

	const getStepContent = () => {
		switch (currentStep) {
			case 0:
				return <PersonalInfoForm userId={userId} initialData={formData} onNext={handleNext} />;
			case 1:
				return (
					<EducationGradesForm
						userId={userId}
						initialData={formData}
						showHocBa={showHocBa}
						setShowHocBa={setShowHocBa}
						onNext={handleNext}
					/>
				);
			case 2:
				return <WishesForm userId={userId} initialData={formData} onNext={handleNext} />;
			case 3:
				return <SummaryForm userId={userId} formData={formData} showHocBa={showHocBa} />;
			default:
				return null;
		}
	};

	return (
		<>
			<Button type='primary' onClick={() => setVisible(true)}>
				Mở form đăng ký xét tuyển
			</Button>

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

				<div style={{ textAlign: 'right' }}>
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
		</>
	);
};

export default AdmissionStepModal;

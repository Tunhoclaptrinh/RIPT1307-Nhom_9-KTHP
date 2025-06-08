import React from 'react';
import { Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import PersonalInfo from './TTCaNhan';
import EducationInfo from './TTHocTap';
import WishList from './NguyenVong';

const { Title, Text } = Typography;


interface StepContentProps {
	currentStep: number;
}

const StepContent: React.FC<StepContentProps> = ({ currentStep }) => {
	switch (currentStep) {
		case 0:
			return <PersonalInfo />;
		case 1:
			return <EducationInfo />;
		case 2:
			return <WishList />;
		case 3:
			return (
				<div style={{ textAlign: 'center', padding: '40px 0' }}>
					<CheckCircleOutlined style={{ fontSize: '64px', color: '#52c41a', marginBottom: '16px' }} />
					<Title level={3}>Hoàn tất đăng ký!</Title>
					<Text type='secondary'>Hồ sơ của bạn đã được nộp thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất.</Text>
				</div>
			);
		default:
			return null;
	}
};

export default StepContent;
import React from 'react';
import { Card, Avatar, Badge, Typography, Timeline, Button, Tag } from 'antd';
import { EditOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'umi';
import useAuth from '../../../hooks/useAuth';
import { ipLocal } from '@/utils/ip';

const { Title, Text } = Typography;

const Sidebar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
	const { user, isAuthenticated } = useAuth();
	const currentDate = moment('2025-06-01T16:59:00+07:00');

	const timelineItems = [
		{
			color: 'green',
			dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
			children: (
				<div>
					<Text strong style={{ color: '#52c41a' }}>
						00:00 01/03/2024
					</Text>
					<br />
					<Text type='secondary'>Mở đăng ký hồ sơ tuyển sinh</Text>
					<br />
					<Tag color='success'>Hoàn thành</Tag>
				</div>
			),
		},
		{
			color: moment('2024-05-26T23:59:00+07:00').isBefore(currentDate) ? 'gray' : 'blue',
			dot: moment('2024-05-26T23:59:00+07:00').isBefore(currentDate) ? null : (
				<ClockCircleOutlined style={{ fontSize: '16px' }} />
			),
			children: (
				<div>
					<Text
						strong
						style={{
							color: moment('2024-05-26T23:59:00+07:00').isBefore(currentDate) ? '#000' : '#1890ff',
						}}
					>
						23:59 26/05/2024
					</Text>
					<br />
					<Text type='secondary'>Kết thúc nộp hồ sơ</Text>
					<br />
					<Tag color={moment('2024-05-26T23:59:00+07:00').isBefore(currentDate) ? 'default' : 'processing'}>
						{moment('2024-05-26T23:59:00+07:00').isBefore(currentDate) ? 'Đã kết thúc' : 'Đang diễn ra'}
					</Tag>
				</div>
			),
		},
		{
			color: moment('2024-06-30T17:00:00+07:00').isBefore(currentDate) ? 'green' : 'gray',
			children: (
				<div>
					<Text
						strong
						style={{
							color: moment('2024-06-30T17:00:00+07:00').isBefore(currentDate) ? '#52c41a' : '#000',
						}}
					>
						17:00 30/06/2024
					</Text>
					<br />
					<Text type='secondary'>Công bố kết quả</Text>
					<br />
					<Tag color={moment('2024-06-30T17:00:00+07:00').isBefore(currentDate) ? 'success' : 'default'}>
						{moment('2024-06-30T17:00:00+07:00').isBefore(currentDate) ? 'Hoàn thành' : 'Chưa bắt đầu'}
					</Tag>
				</div>
			),
		},
	];

	const registrationId = `PTT${user?.id ? user.id.replace('user_', '') : '2400009'}`;

	return (
		<Card style={{ marginBottom: '20px', position: 'sticky', top: '20px' }}>
			<div style={{ textAlign: 'center', marginBottom: '16px' }}>
				<Badge count={currentStep + 1} showZero color='#ff4d4f'>
					<Avatar size={64} style={{ backgroundColor: '#ff4d4f' }} src={`${ipLocal}${user?.avatar}`}>
						{user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
					</Avatar>
				</Badge>
				<Title level={5} style={{ marginTop: '8px', marginBottom: '4px' }}>
					{user?.fullName || 'Người dùng chưa đăng nhập'}
				</Title>
				<Text type='secondary'>Mã hồ sơ: {registrationId}</Text>
				<br />
				<Text type='secondary'>CCCD: {user?.soCCCD || 'Chưa cung cấp'}</Text>
				<br />
				<Text type='secondary'>Email: {user?.email || 'Chưa cung cấp'}</Text>
				<br />
				<Badge
					status={isAuthenticated ? 'processing' : 'default'}
					text={isAuthenticated ? 'Đang hoàn thiện' : 'Chưa đăng nhập'}
				/>
			</div>

			<div style={{ marginBottom: '16px' }}>
				<Text strong>Trạng thái hồ sơ:</Text>
				<br />
				<Text type='secondary'>
					{currentStep < 3
						? `Bước ${currentStep + 1}: ${
								['Thông tin cá nhân', 'Thông tin học tập', 'Nguyện vọng', 'Hoàn tất'][currentStep]
						  }`
						: 'Đã hoàn tất'}
				</Text>
			</div>

			<Timeline items={timelineItems} />

			<Button
				type='primary'
				block
				size='large'
				style={{ marginTop: '16px' }}
				icon={<EditOutlined />}
				onClick={() => history.push('/edit-registration')}
				disabled={!isAuthenticated}
			>
				Bổ sung hồ sơ trực tuyến
			</Button>
		</Card>
	);
};

export default Sidebar;

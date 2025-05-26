import React from 'react';
import { Card, Avatar, Badge, Typography, Timeline, Button, Progress, Tag, message } from 'antd';
import { EditOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Sidebar = ({ currentStep }) => {
	const currentDate = new Date('2025-05-26T01:28:00+07:00');

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
					<Tag color='success' size='small'>
						Hoàn thành
					</Tag>
				</div>
			),
		},
		{
			color: new Date('2024-05-26T23:59:00+07:00') < currentDate ? 'gray' : 'blue',
			dot:
				new Date('2024-05-26T23:59:00+07:00') < currentDate ? null : (
					<ClockCircleOutlined style={{ fontSize: '16px' }} />
				),
			children: (
				<div>
					<Text strong style={{ color: new Date('2024-05-26T23:59:00+07:00') < currentDate ? '#000' : '#1890ff' }}>
						23:59 26/05/2024
					</Text>
					<br />
					<Text type='secondary'>Kết thúc nộp hồ sơ</Text>
					<br />
					<Tag color={new Date('2024-05-26T23:59:00+07:00') < currentDate ? 'default' : 'processing'} size='small'>
						{new Date('2024-05-26T23:59:00+07:00') < currentDate ? 'Đã kết thúc' : 'Đang diễn ra'}
					</Tag>
				</div>
			),
		},
		{
			color: new Date('2024-06-30T17:00:00+07:00') < currentDate ? 'green' : 'gray',
			children: (
				<div>
					<Text strong style={{ color: new Date('2024-06-30T17:00:00+07:00') < currentDate ? '#52c41a' : '#000' }}>
						17:00 30/06/2024
					</Text>
					<br />
					<Text type='secondary'>Công bố kết quả</Text>
					<br />
					<Tag color={new Date('2024-06-30T17:00:00+07:00') < currentDate ? 'success' : 'default'} size='small'>
						{new Date('2024-06-30T17:00:00+07:00') < currentDate ? 'Hoàn thành' : 'Chưa bắt đầu'}
					</Tag>
				</div>
			),
		},
	];

	return (
		<Card style={{ marginBottom: '20px', position: 'sticky', top: '20px' }}>
			<div style={{ textAlign: 'center', marginBottom: '16px' }}>
				<Badge count={currentStep + 1} showZero color='#ff4d4f'>
					<Avatar size={64} style={{ backgroundColor: '#ff4d4f' }}>
						TL
					</Avatar>
				</Badge>
				<Title level={5} style={{ marginTop: '8px', marginBottom: '4px' }}>
					Nguyễn Thị Thảo Linh
				</Title>
				<Text type='secondary'>Mã hồ sơ: PTT2400009</Text>
				<br />
				<Text type='secondary'>CCCD: 036019018233</Text>
				<br />
				<Badge status='processing' text='Đang hoàn thiện' />
			</div>

			<div style={{ marginBottom: '16px' }}>
				<Text strong>Tiến độ hoàn thành:</Text>
				<Progress
					percent={Math.round(((currentStep + 1) / 4) * 100)}
					strokeColor={{
						'0%': '#ff4d4f',
						'100%': '#52c41a',
					}}
					style={{ marginTop: '8px' }}
				/>
			</div>

			<Timeline items={timelineItems} size='small' />

			<Button
				type='primary'
				danger
				block
				size='large'
				style={{ marginTop: '16px' }}
				icon={<EditOutlined />}
				onClick={() => message.info('Tính năng sẽ được cập nhật sớm')}
			>
				Bổ sung hồ sơ trực tuyến
			</Button>
		</Card>
	);
};

export default Sidebar;

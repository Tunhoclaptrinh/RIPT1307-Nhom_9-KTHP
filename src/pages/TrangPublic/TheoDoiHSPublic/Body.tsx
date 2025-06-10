import React, { useState, useEffect } from 'react';
import {
	Card,
	Row,
	Col,
	Spin,
	message,
	Badge,
	Steps,
	Timeline,
	Descriptions,
	Button,
	Space,
	Typography,
	Alert,
	Tag,
} from 'antd';
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	UserOutlined,
	CalendarOutlined,
	TrophyOutlined,
	ReloadOutlined,
	EyeOutlined,
	EditOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { format, addDays } from 'date-fns'; // Replace moment with date-fns
import { ipLocal } from '@/utils/ip';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { history } from 'umi';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

// Define specific TypeScript interfaces
interface User {
	id?: string;
	ho?: string;
	ten?: string;
	email?: string;
	soDT?: string;
	soCCCD?: string;
}

interface HoSo {
	id?: string;
	tinhTrang?: string;
	ketQua?: {
		success?: boolean;
		succes?: boolean; // Handle typo in API
		diem?: number | string;
		phuongThucId?: string;
		nguyenVong?: string;
		nguyenVongDo?: string;
	};
}

interface NguyenVong {
	id?: string;
	ten?: string;
	phuongThucId?: string;
	coSoDaoTao?: string;
	diemChuaUT?: number | string;
	diemCoUT?: number | string;
	tongDiem?: number | string;
}

interface ThongTinHocTap {
	[key: string]: any; // Can be refined based on actual structure
}

interface PhuongThucXetTuyen {
	id?: string;
	ten?: string;
}

interface HoSoData {
	user: User;
	hoSo: HoSo | null;
	nguyenVong: NguyenVong[];
	thongTinHocTap: ThongTinHocTap;
	phuongThucXetTuyen: PhuongThucXetTuyen[];
}

const TheoDoiHoSo = () => {
	const [loading, setLoading] = useState(true);
	const [hoSoData, setHoSoData] = useState<HoSoData | null>(null);
	const [userId, setUserId] = useState<string | null>(null);

	useEffect(() => {
		const storedUserId = localStorage.getItem('userId');
		if (storedUserId) {
			setUserId(storedUserId);
			fetchHoSoData(storedUserId);
		} else {
			message.error('Vui lòng đăng nhập để theo dõi hồ sơ');
			setLoading(false);
		}
	}, []);

	const fetchHoSoData = async (userId: string) => {
		try {
			setLoading(true);

			const [userResult, hoSoResult, nguyenVongResult, thongTinHocTapResult, phuongThucResult] =
				await Promise.allSettled([
					axios.get(`${ipLocal}/users/${userId}`, { timeout: 10000 }), // 10s timeout
					axios.get(`${ipLocal}/hoSo?thongTinCaNhanId=${userId}`, { timeout: 10000 }),
					axios.get(`${ipLocal}/thongTinNguyenVong?userId=${userId}`, { timeout: 10000 }),
					axios.get(`${ipLocal}/thongTinHocTap?userId=${userId}`, { timeout: 10000 }),
					axios.get(`${ipLocal}/phuongThucXetTuyen`, { timeout: 10000 }),
				]);

			const user = userResult.status === 'fulfilled' ? userResult.value.data : null;
			const hoSoList = hoSoResult.status === 'fulfilled' ? hoSoResult.value.data || [] : [];
			const hoSo = hoSoList[0] || null;
			const nguyenVongResponse = nguyenVongResult.status === 'fulfilled' ? nguyenVongResult.value.data || [] : [];
			const thongTinHocTap =
				thongTinHocTapResult.status === 'fulfilled' ? thongTinHocTapResult.value.data?.[0] || {} : {};
			const phuongThucXetTuyen = phuongThucResult.status === 'fulfilled' ? phuongThucResult.value.data || [] : [];

			let nguyenVongDetails: NguyenVong[] = [];
			if (hoSo?.ketQua?.nguyenVongDo) {
				try {
					const nguyenVongDetailResult = await axios.get(`${ipLocal}/thongTinNguyenVong/${hoSo.ketQua.nguyenVongDo}`, {
						timeout: 10000,
					});
					nguyenVongDetails = [nguyenVongDetailResult.data];
				} catch (error) {
					console.warn('Không thể lấy chi tiết nguyện vọng:', error);
					nguyenVongDetails = nguyenVongResponse;
				}
			} else {
				nguyenVongDetails = nguyenVongResponse;
			}

			setHoSoData({
				user: user || {},
				hoSo,
				nguyenVong: nguyenVongDetails,
				thongTinHocTap,
				phuongThucXetTuyen,
			});

			if (userResult.status === 'rejected') message.error('Không thể tải thông tin người dùng');
			if (hoSoResult.status === 'rejected') message.error('Không thể tải thông tin hồ sơ');
			if (nguyenVongResult.status === 'rejected') message.error('Không thể tải thông tin nguyện vọng');
			if (thongTinHocTapResult.status === 'rejected') message.error('Không thể tải thông tin học tập');
			if (phuongThucResult.status === 'rejected') message.error('Không thể tải phương thức xét tuyển');
		} catch (error) {
			console.error('Lỗi khi tải dữ liệu hồ sơ:', error);
			message.error('Có lỗi xảy ra khi tải thông tin hồ sơ. Vui lòng thử lại sau.');
		} finally {
			setLoading(false);
		}
	};

	const getStatusBadge = (status?: string) => {
		switch (status?.toLowerCase()) {
			case 'đã nộp':
			case 'da_nop':
				return <Badge status='processing' text='Đã nộp hồ sơ' />;
			case 'đang xử lý':
			case 'dang_xu_ly':
				return <Badge status='processing' text='Đang xử lý' />;
			case 'đã duyệt':
			case 'da_duyet':
				return <Badge status='success' text='Đã duyệt' />;
			case 'đã trúng tuyển':
			case 'da_trung_tuyen':
				return <Badge status='success' text='Đã trúng tuyển' />;
			case 'không đạt':
			case 'khong_dat':
				return <Badge status='error' text='Không đạt' />;
			case 'chưa nộp':
			case 'chua_nop':
			default:
				return <Badge status='default' text='Chưa nộp hồ sơ' />;
		}
	};

	const getCurrentStep = (status?: string, ketQua?: HoSo['ketQua']) => {
		if (!status || status.toLowerCase() === 'chưa nộp' || status.toLowerCase() === 'chua_nop') return 0;
		if (status.toLowerCase() === 'đã nộp' || status.toLowerCase() === 'da_nop') return 1;
		if (status.toLowerCase() === 'đang xử lý' || status.toLowerCase() === 'dang_xu_ly') return 2;
		if (status.toLowerCase() === 'đã duyệt' || status.toLowerCase() === 'da_duyet') return 3;
		if (ketQua?.success || ketQua?.succes) return 4;
		return 3;
	};

	const getStepStatus = (currentStep: number, stepIndex: number, ketQua?: HoSo['ketQua']) => {
		if (stepIndex < currentStep) return 'finish';
		if (stepIndex === currentStep) {
			if (stepIndex === 4 && (ketQua?.success || ketQua?.succes)) return 'finish';
			if (stepIndex === 4 && ketQua && !(ketQua?.success || ketQua?.succes)) return 'error';
			return 'process';
		}
		return 'wait';
	};

	const renderTimelineEvents = (hoSo?: HoSo) => {
		if (!hoSo) return [];

		// Note: Replace these with actual API timestamps if available
		const events = [
			{
				time: format(new Date(), 'dd/MM/yyyy HH:mm'), // Placeholder, replace with API data
				title: 'Tạo hồ sơ',
				description: 'Hồ sơ được tạo trong hệ thống',
				icon: <UserOutlined />,
				color: 'blue',
			},
		];

		if (hoSo.tinhTrang?.toLowerCase() !== 'chưa nộp' && hoSo.tinhTrang?.toLowerCase() !== 'chua_nop') {
			events.push({
				time: format(new Date(), 'dd/MM/yyyy HH:mm'), // Placeholder, replace with API data
				title: 'Nộp hồ sơ',
				description: 'Hồ sơ đã được nộp thành công',
				icon: <FileTextOutlined />,
				color: 'green',
			});
		}

		if (
			hoSo.tinhTrang?.toLowerCase() === 'đang xử lý' ||
			hoSo.tinhTrang?.toLowerCase() === 'dang_xu_ly' ||
			hoSo.tinhTrang?.toLowerCase() === 'đã duyệt' ||
			hoSo.tinhTrang?.toLowerCase() === 'da_duyet'
		) {
			events.push({
				time: format(addDays(new Date(), 1), 'dd/MM/yyyy HH:mm'), // Placeholder, replace with API data
				title: 'Bắt đầu xét duyệt',
				description: 'Hồ sơ đang được xem xét và đánh giá',
				icon: <ClockCircleOutlined />,
				color: 'orange',
			});
		}

		if (hoSo.ketQua) {
			events.push({
				time: format(addDays(new Date(), 7), 'dd/MM/yyyy HH:mm'), // Placeholder, replace with API data
				title: hoSo.ketQua.success || hoSo.ketQua.succes ? 'Trúng tuyển' : 'Không trúng tuyển',
				description:
					hoSo.ketQua.success || hoSo.ketQua.succes
						? 'Chúc mừng! Bạn đã trúng tuyển'
						: 'Rất tiếc, bạn chưa đạt yêu cầu xét tuyển',
				icon: hoSo.ketQua.success || hoSo.ketQua.succes ? <TrophyOutlined /> : <ExclamationCircleOutlined />,
				color: hoSo.ketQua.success || hoSo.ketQua.succes ? 'green' : 'red',
			});
		}

		return events.reverse();
	};

	const handleRefresh = () => {
		if (userId) {
			fetchHoSoData(userId);
		} else {
			message.error('Vui lòng đăng nhập để làm mới dữ liệu');
		}
	};

	if (loading) {
		return (
			<>
				<Header subTitle='Theo dõi hồ sơ xét tuyển' />
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: '50vh',
						marginTop: 90,
						flexDirection: 'column',
					}}
				>
					<Spin size='large' />
					<Text style={{ marginTop: 16 }}>Đang tải thông tin hồ sơ...</Text>
				</div>
				<Footer />
			</>
		);
	}

	if (!hoSoData || !hoSoData.user) {
		return (
			<>
				<Header subTitle='Theo dõi hồ sơ xét tuyển' />
				<div style={{ marginTop: 90, padding: '40px 20px', minHeight: '50vh' }}>
					<Row justify='center'>
						<Col xs={24} md={12}>
							<Alert
								message='Không tìm thấy thông tin hồ sơ'
								description='Vui lòng đăng nhập hoặc tạo hồ sơ xét tuyển để theo dõi trạng thái.'
								type='warning'
								showIcon
							/>
						</Col>
					</Row>
				</div>
				<Footer />
			</>
		);
	}

	const { user, hoSo, nguyenVong, thongTinHocTap, phuongThucXetTuyen } = hoSoData;
	const currentStep = getCurrentStep(hoSo?.tinhTrang, hoSo?.ketQua);
	const timelineEvents = renderTimelineEvents(hoSo);

	return (
		<>
			<Row justify='center'>
				<Col xs={24} lg={20} style={{ margin: 0, background: '#fff' }}>
					<Col>
						{/* Header với thông tin cơ bản */}
						<Card style={{ marginBottom: 20 }}>
							<Row>
								<Col xs={24} md={16}>
									<Title level={3} style={{ margin: 0, color: '#1890ff' }}>
										Hồ sơ xét tuyển của {user?.ho || ''} {user?.ten || ''}
									</Title>
									<Paragraph style={{ margin: '8px 0 0 0', fontSize: 16 }}>
										ID hồ sơ: <Text code>{hoSo?.id || 'Chưa có'}</Text>
									</Paragraph>
									<Space style={{ marginTop: 12 }}>
										{getStatusBadge(hoSo?.tinhTrang)}
										{hoSo?.ketQua?.success || hoSo?.ketQua?.succes ? (
											<Tag color='success' icon={<TrophyOutlined />}>
												TRÚNG TUYỂN
											</Tag>
										) : hoSo?.ketQua && !(hoSo?.ketQua?.success || hoSo?.ketQua?.succes) ? (
											<Tag color='error'>KHÔNG TRÚNG TUYỂN</Tag>
										) : null}
									</Space>
								</Col>
								<Col xs={24} md={8} style={{ textAlign: 'right' }}>
									<Space>
										<Button
											icon={<ReloadOutlined />}
											onClick={handleRefresh}
											size='large'
											aria-label='Làm mới thông tin hồ sơ'
										>
											Làm mới
										</Button>
										<Button
											icon={<EditOutlined />}
											onClick={() => history.push('/public/dang-ky-tuyen-sinh')}
											size='large'
											type='primary'
											aria-label='Làm mới thông tin hồ sơ'
										>
											Chỉnh sửa
										</Button>
									</Space>
								</Col>
							</Row>
						</Card>

						{/* Quy trình xét tuyển */}
						<Card title='Quy trình xét tuyển' style={{ marginBottom: 20 }}>
							<Steps current={currentStep} style={{ marginBottom: 20 }} responsive={false}>
								<Step
									title='Tạo hồ sơ'
									description='Hoàn thiện thông tin'
									status={getStepStatus(currentStep, 0, hoSo?.ketQua)}
								/>
								<Step
									title='Nộp hồ sơ'
									description='Gửi hồ sơ xét tuyển'
									status={getStepStatus(currentStep, 1, hoSo?.ketQua)}
								/>
								<Step
									title='Xem xét'
									description='Đang được xử lý'
									status={getStepStatus(currentStep, 2, hoSo?.ketQua)}
								/>
								<Step
									title='Đánh giá'
									description='Chấm điểm hồ sơ'
									status={getStepStatus(currentStep, 3, hoSo?.ketQua)}
								/>
								<Step
									title='Kết quả'
									description='Công bố kết quả'
									status={getStepStatus(currentStep, 4, hoSo?.ketQua)}
								/>
							</Steps>

							{/* Thông báo trạng thái hiện tại */}
							{currentStep === 0 && (
								<Alert
									message='Hồ sơ chưa được nộp'
									description='Vui lòng hoàn thiện và nộp hồ sơ để bắt đầu quá trình xét tuyển.'
									type='info'
									showIcon
								/>
							)}
							{currentStep === 1 && (
								<Alert
									message='Hồ sơ đã được nộp thành công'
									description='Hồ sơ của bạn đang chờ được xem xét. Chúng tôi sẽ thông báo kết quả sớm nhất có thể.'
									type='success'
									showIcon
								/>
							)}
							{currentStep >= 2 && currentStep < 4 && (
								<Alert
									message='Hồ sơ đang được xử lý'
									description='Hồ sơ của bạn đang trong quá trình xem xét và đánh giá. Vui lòng theo dõi để cập nhật kết quả.'
									type='info'
									showIcon
								/>
							)}
							{currentStep === 4 && (hoSo?.ketQua?.success || hoSo?.ketQua?.succes) && (
								<Alert
									message='Chúc mừng! Bạn đã trúng tuyển'
									description='Hồ sơ của bạn đã được duyệt và bạn đã trúng tuyển. Vui lòng theo dõi thông báo tiếp theo.'
									type='success'
									showIcon
								/>
							)}
							{currentStep === 4 && hoSo?.ketQua && !(hoSo?.ketQua?.success || hoSo?.ketQua?.succes) && (
								<Alert
									message='Rất tiếc, bạn chưa trúng tuyển'
									description='Hồ sơ của bạn chưa đạt yêu cầu xét tuyển. Bạn có thể tham khảo các nguyện vọng khác.'
									type='error'
									showIcon
								/>
							)}
						</Card>

						<Row gutter={[20, 20]}>
							{/* Thông tin hồ sơ */}
							<Col xs={24} lg={12}>
								<Card title='Thông tin hồ sơ' extra={<FileTextOutlined />}>
									<Descriptions column={1} size='small'>
										<Descriptions.Item label='Họ và tên'>
											{user?.ho || ''} {user?.ten || ''}
										</Descriptions.Item>
										<Descriptions.Item label='Email'>{user?.email || 'Chưa có'}</Descriptions.Item>
										<Descriptions.Item label='Số điện thoại'>{user?.soDT || 'Chưa có'}</Descriptions.Item>
										<Descriptions.Item label='Số CCCD'>{user?.soCCCD || 'Chưa có'}</Descriptions.Item>
										<Descriptions.Item label='Trạng thái hồ sơ'>{getStatusBadge(hoSo?.tinhTrang)}</Descriptions.Item>
									</Descriptions>
								</Card>

								{/* Kết quả xét tuyển */}
								{hoSo?.ketQua && (
									<Card title='Kết quả xét tuyển' style={{ marginTop: 20 }} extra={<TrophyOutlined />}>
										<Descriptions column={1} size='small'>
											<Descriptions.Item label='Kết quả'>
												{hoSo.ketQua.success || hoSo.ketQua.succes ? (
													<Tag color='success'>TRÚNG TUYỂN</Tag>
												) : (
													<Tag color='error'>KHÔNG TRÚNG TUYỂN</Tag>
												)}
											</Descriptions.Item>
											<Descriptions.Item label='Điểm trúng tuyển'>{hoSo.ketQua.diem ?? 'Chưa có'}</Descriptions.Item>
											<Descriptions.Item label='Phương thức xét tuyển'>
												{phuongThucXetTuyen.find((pt) => pt.id === hoSo.ketQua?.phuongThucId)?.ten || 'Chưa xác định'}
											</Descriptions.Item>
											{(hoSo.ketQua.nguyenVong || hoSo.ketQua.nguyenVongDo) && nguyenVong.length > 0 && (
												<Descriptions.Item label='Ngành trúng tuyển'>
													{nguyenVong[0]?.ten || 'Chưa xác định'}
												</Descriptions.Item>
											)}
										</Descriptions>
									</Card>
								)}
							</Col>

							{/* Lịch sử xử lý */}
							<Col xs={24} lg={12}>
								<Card title='Lịch sử xử lý' extra={<CalendarOutlined />}>
									<Timeline>
										{timelineEvents.map((event, index) => (
											<Timeline.Item key={index} dot={event.icon} color={event.color}>
												<div>
													<Text strong>{event.title}</Text>
													<br />
													<Text type='secondary' style={{ fontSize: 12 }}>
														{event.time}
													</Text>
													<br />
													<Text>{event.description}</Text>
												</div>
											</Timeline.Item>
										))}
									</Timeline>
								</Card>
							</Col>
						</Row>

						{/* Nguyện vọng đã đăng ký */}
						{nguyenVong.length > 0 && (
							<Card title='Nguyện vọng đã đăng ký' style={{ marginTop: 20 }} extra={<EyeOutlined />}>
								{nguyenVong.map((nv, index) => (
									<Card key={index} style={{ marginBottom: 12 }}>
										<Descriptions column={2} size='small'>
											<Descriptions.Item label='Ngành đào tạo' span={2}>
												<Text strong>{nv.ten || 'Chưa xác định'}</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Phương thức'>
												{phuongThucXetTuyen.find((pt) => pt.id === nv.phuongThucId)?.ten || 'Chưa xác định'}
											</Descriptions.Item>
											<Descriptions.Item label='Cơ sở đào tạo'>{nv.coSoDaoTao || 'Chưa có'}</Descriptions.Item>
											<Descriptions.Item label='Điểm chưa ưu tiên'>{nv.diemChuaUT ?? 'Chưa có'}</Descriptions.Item>
											<Descriptions.Item label='Điểm có ưu tiên'>{nv.diemCoUT ?? 'Chưa có'}</Descriptions.Item>
											<Descriptions.Item label='Tổng điểm'>
												<Text strong style={{ color: '#1890ff' }}>
													{nv.tongDiem ?? 'Chưa có'}
												</Text>
											</Descriptions.Item>
											<Descriptions.Item label='Trạng thái'>
												{hoSo?.ketQua?.nguyenVongDo === nv.id ? (
													<Tag color='success'>Trúng tuyển</Tag>
												) : (
													<Tag color='default'>Chờ kết quả</Tag>
												)}
											</Descriptions.Item>
										</Descriptions>
									</Card>
								))}
							</Card>
						)}

						{/* Lưu ý quan trọng */}
						<Card title='Lưu ý quan trọng' style={{ marginTop: 20 }}>
							<ul style={{ paddingLeft: 20, marginBottom: 0 }}>
								<li>Vui lòng thường xuyên kiểm tra trạng thái hồ sơ để cập nhật thông tin mới nhất.</li>
								<li>Nếu có thay đổi thông tin, vui lòng liên hệ với bộ phận tuyển sinh.</li>
								<li>Kết quả chính thức sẽ được thông báo qua email và hệ thống.</li>
								<li>Trong trường hợp có thắc mắc, vui lòng liên hệ hotline hỗ trợ.</li>
							</ul>
						</Card>
					</Col>
				</Col>
			</Row>
		</>
	);
};

export default TheoDoiHoSo;

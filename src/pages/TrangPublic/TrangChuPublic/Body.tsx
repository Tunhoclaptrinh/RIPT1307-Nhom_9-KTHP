import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Card, Tabs, Typography, Statistic, List, Space, Timeline, Spin, message } from 'antd';
import {
	SearchOutlined,
	CalendarOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
	QuestionCircleOutlined,
	InfoCircleOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { primaryColor } from '@/services/base/constant';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

type ThongTinTuyenSinhItem = {
	id?: string | number;
	title: string;
	date?: string;
	summary?: string;
	[key: string]: any;
};

type HuongDanHoSoItem = {
	id?: string | number;
	title?: string;
	date?: string;
	summary?: string;
	[key: string]: any;
};

const TrangChuBody = () => {
	const [thongTinTuyenSinh, setThongTinTuyenSinh] = useState<ThongTinTuyenSinhItem[]>([]);
	const [huongDanHoSo, setHuongDanHoSo] = useState<HuongDanHoSoItem[]>([]);
	const [faqItems, setFaqItems] = useState<any[]>([]);
	const [lichTrinhTuyenSinh, setLichTrinhTuyenSinh] = useState<any[]>([]);
	const [thongKeTuyenSinh, setThongKeTuyenSinh] = useState<any>({});

	const [loading, setLoading] = useState(true);

	const BASE_API_URL = 'http://localhost:3000';

	// Fetch data from APIs
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				const [thongTinRes, huongDanRes, faqRes, lichTrinhRes, thongKeRes] = await Promise.all([
					fetch(`${BASE_API_URL}/thongBaoTuyenSinh`),
					fetch(`${BASE_API_URL}/huongDanHoSo`),
					fetch(`${BASE_API_URL}/faq`),
					fetch(`${BASE_API_URL}/lichTrinhTuyenSinh`),
					fetch(`${BASE_API_URL}/thongKeTuyenSinh`),
				]);

				const thongTinData = await thongTinRes.json();
				const huongDanData = await huongDanRes.json();
				const faqData = await faqRes.json();
				const lichTrinhData = await lichTrinhRes.json();
				const thongKeData = await thongKeRes.json();

				setThongTinTuyenSinh(thongTinData.filter((item: any) => item.isActive));
				setHuongDanHoSo(huongDanData);
				setFaqItems(faqData.filter((item: any) => item.isActive));
				setLichTrinhTuyenSinh(lichTrinhData);
				setThongKeTuyenSinh(thongKeData[0] || {});
			} catch (error) {
				console.error('Error fetching data:', error);
				message.error('Có lỗi xảy ra khi tải dữ liệu');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const getTimelineIcon = (iconType: any) => {
		switch (iconType) {
			case 'calendar':
				return <CalendarOutlined style={{ fontSize: 16, color: primaryColor }} />;
			case 'check-circle':
				return <CheckCircleOutlined style={{ fontSize: 16, color: primaryColor }} />;
			case 'user':
				return <UserOutlined style={{ fontSize: 16, color: primaryColor }} />;
			default:
				return <CalendarOutlined style={{ fontSize: 16, color: primaryColor }} />;
		}
	};

	const formatFileSize = (size: any) => {
		return size || 'N/A';
	};

	if (loading) {
		return (
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
				<Spin size='large' />
			</div>
		);
	}

	return (
		<div>
			{/* Banner section */}
			<div
				className='elementor-element elementor-element-4aa2163 e-con-full e-flex e-con e-child'
				style={{ background: '#f0f7ff', padding: '40px 0' }}
			>
				<div style={{ margin: '0 20px' }}>
					<Row justify='center'>
						<Col xs={24} lg={20}>
							<Row gutter={[32, 32]} align='middle'>
								<Col xs={24} md={12}>
									<Title level={2} style={{ color: primaryColor }}>
										Hệ Thống Tuyển Sinh Đại Học Trực Tuyến
									</Title>
									<Paragraph style={{ fontSize: 16 }}>
										Nền tảng đăng ký xét tuyển đại học toàn diện, hiện đại và tiện lợi. Đăng ký, theo dõi và quản lý hồ
										sơ tuyển sinh của bạn mọi lúc, mọi nơi.
									</Paragraph>
									<Space>
										<Button type='primary' size='large'>
											Đăng Ký Xét Tuyển
										</Button>
										<Link
											to={'/public/tra-cuu-public'}
											key='detail'
											style={{ color: 'inherit', textDecoration: 'none' }}
										>
											<Button size='large'>Tra Cứu Thông Tin</Button>{' '}
										</Link>
									</Space>
								</Col>
								<Col xs={24} md={12} style={{ textAlign: 'center' }}>
									<img
										src='https://tuyensinh.ptit.edu.vn/wp-content/uploads/sites/4/2024/08/image-banner-3-1.png'
										alt='Tuyển sinh đại học'
										style={{ maxWidth: '100%', borderRadius: 8 }}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</div>

			{/* Key features */}
			<div
				style={{
					padding: '40px 0',
					boxShadow: '0 8px 24px rgba(255, 182, 193, 0.3)',
				}}
			>
				<div style={{ margin: '0 20px' }}>
					<Row justify='center'>
						<Col xs={24} lg={20}>
							<Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
								Tính Năng Nổi Bật
							</Title>
							<Row gutter={[32, 32]}>
								<Col xs={24} md={8}>
									<Card
										style={{ height: '100%' }}
										bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
									>
										<FileTextOutlined style={{ fontSize: 48, color: primaryColor, marginBottom: 16 }} />
										<Title level={4}>Đăng Ký Xét Tuyển</Title>
										<Paragraph>
											Đăng ký xét tuyển trực tuyến nhanh chóng và đơn giản, tiết kiệm thời gian và chi phí.
										</Paragraph>
									</Card>
								</Col>
								<Col xs={24} md={8}>
									<Link to={'/public/tra-cuu-public'} key='detail'>
										<Card
											style={{ height: '100%' }}
											bodyStyle={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												textAlign: 'center',
											}}
										>
											<SearchOutlined style={{ fontSize: 48, color: primaryColor, marginBottom: 16 }} />

											<Title level={4}>Tra Cứu Thông Tin</Title>
											<Paragraph>
												Tra cứu thông tin tuyển sinh, ngành học, điểm chuẩn các năm nhanh chóng và chính xác.
											</Paragraph>
										</Card>
									</Link>
								</Col>
								<Col xs={24} md={8}>
									<Card
										style={{ height: '100%' }}
										bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
									>
										<CheckCircleOutlined style={{ fontSize: 48, color: primaryColor, marginBottom: 16 }} />
										<Title level={4}>Theo Dõi Hồ Sơ</Title>
										<Paragraph>
											Theo dõi trạng thái hồ sơ xét tuyển và nhận thông báo kết quả trực tiếp qua hệ thống.
										</Paragraph>
									</Card>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</div>

			{/* Statistics */}
			<div style={{ background: primaryColor, padding: '40px 0', color: '#fff' }}>
				<div style={{ margin: '0 20px' }}>
					<Row justify='center'>
						<Col xs={24} lg={20}>
							<Title level={2} style={{ textAlign: 'center', color: '#fff', marginBottom: 40 }}>
								Thống Kê Tuyển Sinh
							</Title>
							<Row gutter={[32, 32]} justify='space-around'>
								<Col xs={12} md={6}>
									<Statistic
										title={<span style={{ color: '#fff' }}>Trường đại học</span>}
										value={thongKeTuyenSinh?.soTruongDaiHoc || 150}
										suffix='+'
										valueStyle={{ color: '#fff', fontSize: 36 }}
										style={{ textAlign: 'center' }}
									/>
								</Col>
								<Col xs={12} md={6}>
									<Statistic
										title={<span style={{ color: '#fff' }}>Ngành đào tạo</span>}
										value={thongKeTuyenSinh?.soNganhDaoTao || 2500}
										suffix='+'
										valueStyle={{ color: '#fff', fontSize: 36 }}
										style={{ textAlign: 'center' }}
									/>
								</Col>
								<Col xs={12} md={6}>
									<Statistic
										title={<span style={{ color: '#fff' }}>Thí sinh đăng ký</span>}
										value={
											thongKeTuyenSinh?.soThiSinhDangKy ? Math.floor(thongKeTuyenSinh.soThiSinhDangKy / 1000) : 500
										}
										suffix='K+'
										valueStyle={{ color: '#fff', fontSize: 36 }}
										style={{ textAlign: 'center' }}
									/>
								</Col>
								<Col xs={12} md={6}>
									<Statistic
										title={<span style={{ color: '#fff' }}>Hồ sơ trực tuyến</span>}
										value={thongKeTuyenSinh?.tyLeHoSoTrucTuyen || 98}
										suffix='%'
										valueStyle={{ color: '#fff', fontSize: 36 }}
										style={{ textAlign: 'center' }}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</div>
			</div>

			{/* Information Tabs */}
			<div style={{ padding: '40px 0', background: '#f5f5f5' }}>
				<div style={{ margin: '0 20px' }}>
					<Row justify='center'>
						<Col xs={24} lg={20}>
							<Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
								Thông Tin Tuyển Sinh
							</Title>
							<Tabs defaultActiveKey='thongbao' centered size='large'>
								<TabPane tab='Thông Báo Tuyển Sinh' key='thongbao'>
									<List
										itemLayout='horizontal'
										dataSource={thongTinTuyenSinh}
										renderItem={(item) => (
											<List.Item actions={[<Button type='link'>Xem chi tiết</Button>]}>
												<List.Item.Meta
													title={
														<Text strong style={{ color: primaryColor, fontSize: 16 }}>
															{item.title}
														</Text>
													}
													description={
														<>
															<Text type='secondary'>Ngày đăng: {item.date}</Text>
															<br />
															<Text>{item.summary}</Text>
														</>
													}
												/>
											</List.Item>
										)}
									/>
								</TabPane>
								<TabPane tab='Hướng Dẫn Hồ Sơ' key='huongdan'>
									<List
										itemLayout='horizontal'
										dataSource={huongDanHoSo}
										renderItem={(item) => (
											<List.Item actions={[<Button type='link'>Tải xuống</Button>]}>
												<List.Item.Meta
													title={
														<Text strong style={{ color: primaryColor, fontSize: 16 }}>
															{item.title || 'No title'}
														</Text>
													}
													description={
														<>
															<Text type='secondary'>Cập nhật: {item.date}</Text>
															<br />
															<Text>{item.summary}</Text>
														</>
													}
												/>
											</List.Item>
										)}
									/>
								</TabPane>
							</Tabs>
						</Col>
					</Row>
				</div>
			</div>

			{/* Timeline */}
			<div style={{ padding: '40px 0', background: '#fff' }}>
				<div style={{ margin: '0 20px' }}>
					<Row justify='center'>
						<Col xs={24} lg={20}>
							<Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
								Lịch Trình Tuyển Sinh 2025
							</Title>
							<Timeline mode='alternate'>
								{lichTrinhTuyenSinh.map((item, index) => (
									<Timeline.Item key={item.id || index} dot={getTimelineIcon(item.icon)} color={primaryColor}>
										<Title level={4} style={{ color: primaryColor }}>
											{item.title}
										</Title>
										<Paragraph>
											{item.startDate} {item.endDate && `- ${item.endDate}`}
										</Paragraph>
										<Paragraph>{item.description}</Paragraph>
									</Timeline.Item>
								))}
							</Timeline>
						</Col>
					</Row>
				</div>
			</div>

			{/* FAQ Section */}
			<div style={{ padding: '40px 0', background: '#f5f5f5' }}>
				<div style={{ margin: '0 20px' }}>
					<Row justify='center'>
						<Col xs={24} lg={20}>
							<Title level={2} style={{ textAlign: 'center', marginBottom: 40 }}>
								Câu Hỏi Thường Gặp
							</Title>
							<Row gutter={[24, 24]}>
								{faqItems.slice(0, 4).map((item) => (
									<Col xs={24} md={12} key={item.id}>
										<Card>
											<Space align='start'>
												<QuestionCircleOutlined style={{ color: primaryColor, fontSize: 20, marginTop: 4 }} />
												<div>
													<Title level={4}>{item.question}</Title>
													<Paragraph>{item.answer}</Paragraph>
												</div>
											</Space>
										</Card>
									</Col>
								))}
							</Row>
							<div style={{ textAlign: 'center', marginTop: 24 }}>
								<Button type='link' icon={<InfoCircleOutlined />}>
									Xem thêm câu hỏi thường gặp
								</Button>
							</div>
						</Col>
					</Row>
				</div>
			</div>

			{/* CTA Section */}
			<div style={{ background: primaryColor, padding: '60px 0', color: '#fff' }}>
				<div style={{ margin: '0 20px' }}>
					<Row justify='center'>
						<Col xs={24} lg={20} style={{ textAlign: 'center' }}>
							<Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
								Bắt Đầu Hành Trình Đại Học Của Bạn Ngay Hôm Nay
							</Title>
							<Paragraph style={{ color: '#fff', fontSize: 16, maxWidth: 800, margin: '0 auto 24px' }}>
								Đăng ký tài khoản để sử dụng đầy đủ các tính năng của hệ thống tuyển sinh trực tuyến và bắt đầu quá
								trình đăng ký xét tuyển đại học.
							</Paragraph>
							<Space size='large'>
								<Button size='large' style={{ borderRadius: 4 }}>
									Đăng Ký Ngay
								</Button>
								<Button size='large' ghost style={{ borderRadius: 4 }}>
									Tìm Hiểu Thêm
								</Button>
							</Space>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	);
};

export default TrangChuBody;

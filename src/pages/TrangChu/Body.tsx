import { Row, Col, Button, Card, Tabs, Typography, Statistic, List, Space, Timeline } from 'antd';
import {
	SearchOutlined,
	CalendarOutlined,
	FileTextOutlined,
	CheckCircleOutlined,
	QuestionCircleOutlined,
	InfoCircleOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { primaryColor } from '@/services/base/constant';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const TrangChuBody = () => {
	const thongTinTuyenSinh = [
		{
			id: 1,
			title: 'Thông báo tuyển sinh năm học 2025-2026',
			date: '15/05/2025',
			summary: 'Các thông tin chi tiết về kỳ tuyển sinh đại học năm học 2025-2026.',
		},
		{
			id: 2,
			title: 'Hướng dẫn đăng ký xét tuyển trực tuyến',
			date: '10/05/2025',
			summary: 'Cách thức đăng ký xét tuyển trực tuyến và các bước cần thực hiện.',
		},
		{
			id: 3,
			title: 'Danh sách các ngành tuyển sinh mới',
			date: '05/05/2025',
			summary: 'Cập nhật thông tin về các ngành học mới được mở trong năm học 2025-2026.',
		},
		{
			id: 4,
			title: 'Lịch thi và xét tuyển chi tiết',
			date: '01/05/2025',
			summary: 'Thời gian biểu chi tiết cho các đợt thi và xét tuyển trong năm 2025.',
		},
	];

	const huongDanHoSo = [
		{
			id: 1,
			title: 'Hồ sơ đăng ký xét tuyển đại học',
			date: '12/05/2025',
			summary: 'Danh sách giấy tờ cần thiết và cách thức chuẩn bị hồ sơ xét tuyển đại học.',
		},
		{
			id: 2,
			title: 'Hướng dẫn xác nhận nhập học trực tuyến',
			date: '08/05/2025',
			summary: 'Các bước cần thiết để xác nhận nhập học sau khi trúng tuyển.',
		},
		{
			id: 3,
			title: 'Quy định về lệ phí xét tuyển',
			date: '05/05/2025',
			summary: 'Thông tin về mức phí và phương thức nộp lệ phí xét tuyển.',
		},
	];

	const faqItems = [
		{
			question: 'Tôi có thể đăng ký xét tuyển vào nhiều trường cùng lúc không?',
			answer:
				'Có, bạn có thể đăng ký xét tuyển vào nhiều trường trong cùng một đợt xét tuyển, tuy nhiên cần tuân thủ quy định về số nguyện vọng tối đa.',
		},
		{
			question: 'Tôi cần chuẩn bị những giấy tờ gì khi đăng ký xét tuyển?',
			answer:
				'Bạn cần chuẩn bị: Phiếu đăng ký xét tuyển, bản sao công chứng học bạ THPT, bản sao công chứng bằng tốt nghiệp THPT hoặc giấy chứng nhận tốt nghiệp tạm thời, các minh chứng ưu tiên (nếu có).',
		},
		{
			question: 'Thời hạn đăng ký xét tuyển năm 2025 là khi nào?',
			answer:
				'Thời hạn đăng ký xét tuyển đợt 1 năm 2025 là từ ngày 01/06/2025 đến hết ngày 30/06/2025. Các đợt bổ sung sẽ được thông báo sau trên hệ thống.',
		},
		{
			question: 'Làm thế nào để tôi biết được kết quả xét tuyển?',
			answer:
				'Kết quả xét tuyển sẽ được công bố trên hệ thống này. Bạn có thể đăng nhập vào tài khoản cá nhân để kiểm tra kết quả hoặc đăng ký nhận thông báo qua email/SMS.',
		},
	];

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
										<Button size='large'>Tra Cứu Thông Tin</Button>
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
			<div style={{ padding: '40px 0', background: '#fff' }}>
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
									<Card
										style={{ height: '100%' }}
										bodyStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
									>
										<SearchOutlined style={{ fontSize: 48, color: primaryColor, marginBottom: 16 }} />
										<Title level={4}>Tra Cứu Thông Tin</Title>
										<Paragraph>
											Tra cứu thông tin tuyển sinh, ngành học, điểm chuẩn các năm nhanh chóng và chính xác.
										</Paragraph>
									</Card>
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
										value={150}
										suffix='+'
										valueStyle={{ color: '#fff', fontSize: 36 }}
										style={{ textAlign: 'center' }}
									/>
								</Col>
								<Col xs={12} md={6}>
									<Statistic
										title={<span style={{ color: '#fff' }}>Ngành đào tạo</span>}
										value={2500}
										suffix='+'
										valueStyle={{ color: '#fff', fontSize: 36 }}
										style={{ textAlign: 'center' }}
									/>
								</Col>
								<Col xs={12} md={6}>
									<Statistic
										title={<span style={{ color: '#fff' }}>Thí sinh đăng ký</span>}
										value={500}
										suffix='K+'
										valueStyle={{ color: '#fff', fontSize: 36 }}
										style={{ textAlign: 'center' }}
									/>
								</Col>
								<Col xs={12} md={6}>
									<Statistic
										title={<span style={{ color: '#fff' }}>Hồ sơ trực tuyến</span>}
										value={98}
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
															{item.title}
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
								<Timeline.Item
									dot={<CalendarOutlined style={{ fontSize: 16, color: primaryColor }} />}
									color={primaryColor}
								>
									<Title level={4} style={{ color: primaryColor }}>
										Đăng ký xét tuyển đợt 1
									</Title>
									<Paragraph>01/06/2025 - 30/06/2025</Paragraph>
									<Paragraph>
										Thí sinh đăng ký xét tuyển đợt 1 trên hệ thống, hoàn thiện hồ sơ và nộp lệ phí xét tuyển.
									</Paragraph>
								</Timeline.Item>
								<Timeline.Item
									dot={<CheckCircleOutlined style={{ fontSize: 16, color: primaryColor }} />}
									color={primaryColor}
								>
									<Title level={4} style={{ color: primaryColor }}>
										Công bố kết quả đợt 1
									</Title>
									<Paragraph>15/07/2025 - 20/07/2025</Paragraph>
									<Paragraph>
										Thí sinh nhận kết quả xét tuyển đợt 1 và tiến hành xác nhận nhập học nếu trúng tuyển.
									</Paragraph>
								</Timeline.Item>
								<Timeline.Item
									dot={<CalendarOutlined style={{ fontSize: 16, color: primaryColor }} />}
									color={primaryColor}
								>
									<Title level={4} style={{ color: primaryColor }}>
										Đăng ký xét tuyển đợt bổ sung
									</Title>
									<Paragraph>01/08/2025 - 15/08/2025</Paragraph>
									<Paragraph>
										Đăng ký xét tuyển đợt bổ sung cho các trường còn chỉ tiêu và các thí sinh chưa trúng tuyển đợt 1.
									</Paragraph>
								</Timeline.Item>
								<Timeline.Item
									dot={<UserOutlined style={{ fontSize: 16, color: primaryColor }} />}
									color={primaryColor}
								>
									<Title level={4} style={{ color: primaryColor }}>
										Nhập học
									</Title>
									<Paragraph>01/09/2025 - 15/09/2025</Paragraph>
									<Paragraph>
										Thí sinh nhận kết quả và làm thủ tục nhập học chính thức tại các trường đại học.
									</Paragraph>
								</Timeline.Item>
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
								{faqItems.map((item, index) => (
									<Col xs={24} md={12} key={index}>
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

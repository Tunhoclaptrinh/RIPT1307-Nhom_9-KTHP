import { useEffect, useState } from 'react';
import { coQuanChuQuan, primaryColor, unitName } from '@/services/base/constant';
import { HeaderProps } from './typing';
import { Button, Col, Drawer, Dropdown, Menu, Row, Space } from 'antd';
import { UserOutlined, MenuOutlined, DownOutlined, CloseOutlined, AppstoreOutlined } from '@ant-design/icons';

const Header = (props: HeaderProps) => {
	const { subTitle = 'Hệ thống Tuyển sinh Đại học Trực tuyến', button = [], menu = [] } = props;
	const [isMobile, setIsMobile] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);

	// Xử lý responsive
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		// Thiết lập trạng thái ban đầu
		handleResize();

		// Thêm event listener
		window.addEventListener('resize', handleResize);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Danh mục dropdown cho desktop
	const dropdownMenu = (
		<Menu>
			{menu.map((item, index) => (
				<Menu.Item key={index}>{item}</Menu.Item>
			))}
		</Menu>
	);

	// Xử lý đóng drawer khi click vào menu item
	const handleMenuClick = () => {
		setDrawerVisible(false);
	};

	// Menu cho mobile drawer
	const mobileMenu = (
		<Menu mode='vertical'>
			{/* Menu items */}
			{menu.length > 0 && (
				<Menu.ItemGroup title='Danh mục'>
					{menu.map((item, index) => (
						<Menu.Item key={`menu-${index}`} onClick={handleMenuClick}>
							{item}
						</Menu.Item>
					))}
				</Menu.ItemGroup>
			)}

			{/* Button items transformd to menu items */}
			{button.length > 0 && (
				<Menu.ItemGroup title='Tác vụ'>
					{button.map((btn, index) => (
						<Menu.Item key={`btn-${index}`} onClick={handleMenuClick}>
							{btn}
						</Menu.Item>
					))}
				</Menu.ItemGroup>
			)}

			{/* Default login button if no buttons provided */}
			{button.length === 0 && (
				<Menu.Item key='default-register' onClick={handleMenuClick}>
					<Button type='primary' icon={<UserOutlined />} block>
						Đăng ký tài khoản
					</Button>
				</Menu.Item>
			)}
		</Menu>
	);

	return (
		<Row justify='center'>
			<Col xs={24} lg={20}>
				<header
					style={{
						width: '100%',
						// boxShadow: 'rgba(43, 83, 135, 0.08) 0px 2px 6px 0px',
						background: '#fff',
						position: 'sticky',
						top: 0,
						zIndex: 1000,
					}}
				>
					<div
						style={{
							padding: '10px 0',
							// maxWidth: '1200px',
							// margin: 'auto',
							margin: '0 20px',
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
							}}
						>
							{/* Logo và tiêu đề */}
							<div
								style={{
									width: '100%',
									height: 70,
								}}
							>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										maxWidth: isMobile ? 'calc(100% - 50px)' : '60%',
										paddingLeft: 5,
										height: 70,
									}}
								>
									<div style={{ flexShrink: 0, marginRight: isMobile ? 10 : 20 }}>
										<img
											style={{
												width: 50,
												height: 'auto',
											}}
											src='/logo.png'
											alt='logo'
										/>
									</div>
									<div
									// style={{ overflow: 'hidden' }}
									>
										<b
											style={{
												// fontSize: isMobile ? 'calc(0.7vw + 6px)' : 'calc(0.9vw + 6px)',
												fontSize: 'clamp(12px, 0.8vw, 18px)',
												color: primaryColor,

												display: 'block',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
										>
											{coQuanChuQuan.toUpperCase()}
										</b>
										<b
											style={{
												// fontSize: isMobile ? 'calc(0.8vw + 7px)' : 'calc(1vw + 7px)',
												fontSize: 'clamp(12px, 0.8vw, 18px)',
												color: 'rgb(17, 94, 171)',
												display: 'block',
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
										>
											{unitName.toUpperCase()}
										</b>
										{subTitle && (
											<b
												style={{
													// fontSize: isMobile ? 'calc(0.7vw + 6px)' : 'calc(0.9vw + 6px)',
													fontSize: 'clamp(12px, 0.8vw, 18px)',
													// color: primaryColor,
													margin: '5px 0 0 0',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis',
												}}
											>
												{subTitle?.toUpperCase()}
											</b>
										)}
									</div>
								</div>
							</div>

							{/* Desktop Navigation */}
							{!isMobile && (
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'flex-end',
										gap: '15px',
									}}
								>
									{/* Hiển thị menu dropdown nếu có */}
									{menu.length > 0 && (
										<Dropdown
											overlay={dropdownMenu}
											placement='bottomRight'
											// trigger={['click']}
											overlayStyle={{
												minWidth: '200px',
												padding: '4px',
												borderRadius: '8px',
											}}
										>
											<Button
												style={{
													display: 'flex',
													alignItems: 'center',
													borderRadius: '6px',
													padding: '4px 16px',
													height: '38px',
												}}
											>
												<AppstoreOutlined style={{ marginRight: 6 }} />
												<span style={{ marginRight: 4 }}>Danh mục</span>
												<DownOutlined style={{ fontSize: '12px' }} />
											</Button>
										</Dropdown>
									)}

									{/* Hiển thị các nút tùy chỉnh nếu có */}
									{button.length > 0 && (
										<Space size='small' style={{ margin: '0 10px' }}>
											{button.map((btn, index) => (
												<span key={index}>{btn}</span>
											))}
										</Space>
									)}

									{/* Mặc định hiển thị nút đăng ký nếu không có button nào được truyền vào */}
									{button.length === 0 && (
										<Button
											style={{
												display: 'flex',
												alignItems: 'center',
												borderRadius: '6px',
												padding: '4px 16px',
												height: '38px',
												margin: '0 10px',
											}}
											type='primary'
											icon={<UserOutlined />}
										>
											Đăng ký tài khoản
										</Button>
									)}
								</div>
							)}

							{/* Mobile Hamburger Icon */}
							{isMobile && (
								<Button
									type='text'
									icon={<MenuOutlined style={{ fontSize: '20px' }} />}
									onClick={() => setDrawerVisible(true)}
								/>
							)}
						</div>
					</div>

					{/* Mobile Drawer */}
					<Drawer
						title='Menu'
						onClose={() => setDrawerVisible(false)}
						visible={drawerVisible}
						closable={false}
						bodyStyle={{ padding: '10px 0' }}
						// width='66.67%' // Chiếm 2/3 màn hình
						placement='right'
						style={{ backgroundColor: 'rgba(255,255,255, 0.67)' }}
					>
						<Button
							type='text'
							icon={<CloseOutlined />}
							onClick={() => setDrawerVisible(false)}
							style={{ position: 'absolute', right: 16, top: 16 }}
						/>
						{mobileMenu}
					</Drawer>
				</header>
			</Col>
		</Row>
	);
};

export default Header;

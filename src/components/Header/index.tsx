import { useEffect, useState } from 'react';
import { coQuanChuQuan, primaryColor, unitName } from '@/services/base/constant';
import { HeaderProps } from './typing';
import { Button, Col, Drawer, Dropdown, Menu, Row, Space } from 'antd';
import { UserOutlined, MenuOutlined, DownOutlined, CloseOutlined, AppstoreOutlined } from '@ant-design/icons';
import { history } from 'umi';

const Header = (props: HeaderProps) => {
	const { subTitle = 'Hệ thống Tuyển sinh Đại học Trực tuyến', button = [], menu = [] } = props;
	const [isMobile, setIsMobile] = useState(false);
	const [drawerVisible, setDrawerVisible] = useState(false);

	// Xử lý responsive
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const dropdownMenu = (
		<Menu>
			{menu.map((item, index) => (
				<Menu.Item key={index}>{item}</Menu.Item>
			))}
		</Menu>
	);

	const handleMenuClick = () => {
		setDrawerVisible(false);
	};

	const mobileMenu = (
		<Menu mode='vertical'>
			{menu.length > 0 && (
				<Menu.ItemGroup title='Danh mục'>
					{menu.map((item, index) => (
						<Menu.Item key={`menu-${index}`} onClick={handleMenuClick}>
							{item}
						</Menu.Item>
					))}
				</Menu.ItemGroup>
			)}
			{button.length > 0 && (
				<Menu.ItemGroup title='Tác vụ'>
					{button.map((btn, index) => (
						<Menu.Item key={`btn-${index}`} onClick={handleMenuClick}>
							{btn}
						</Menu.Item>
					))}
				</Menu.ItemGroup>
			)}
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
		<div
			style={{
				backgroundColor: '#fff',
				width: '100%',
				position: 'fixed',
				top: 0,
				zIndex: 1000,
				boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
			}}
		>
			<Row justify='center'>
				<Col xs={24} lg={20}>
					<header>
						<div
							style={{
								padding: '10px 0',
								backgroundColor: '#fff',
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<div style={{ width: '100%', height: 70 }}>
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											maxWidth: isMobile ? 'calc(100% - 50px)' : '60%',
											paddingLeft: 5,
											height: 70,
										}}
									>
										<div
											style={{ flexShrink: 0, marginRight: isMobile ? 10 : 20, cursor: 'pointer' }}
											onClick={() => history.push('/public/trang-chu')}
										>
											<img
												style={{
													width: 50,
													height: 'auto',
												}}
												src='/logo.png'
												alt='logo'
											/>
										</div>
										<div>
											<b
												style={{
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
														fontSize: 'clamp(12px, 0.8vw, 18px)',
														margin: '5px 0 0 0',
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													{subTitle.toUpperCase()}
												</b>
											)}
										</div>
									</div>
								</div>
								{!isMobile && (
									<div
										style={{
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'flex-end',
											gap: '15px',
										}}
									>
										{menu.length > 0 && (
											<Dropdown
												overlay={dropdownMenu}
												placement='bottomRight'
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
										{button.length > 0 && (
											<Space size='small' style={{ margin: '0 10px' }}>
												{button.map((btn, index) => (
													<span key={index}>{btn}</span>
												))}
											</Space>
										)}
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
								{isMobile && (
									<Button
										type='text'
										icon={<MenuOutlined style={{ fontSize: '20px' }} />}
										onClick={() => setDrawerVisible(true)}
									/>
								)}
							</div>
						</div>
						<Drawer
							title='Menu'
							onClose={() => setDrawerVisible(false)}
							visible={drawerVisible}
							closable={false}
							bodyStyle={{ padding: '10px 0' }}
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
		</div>
	);
};

export default Header;

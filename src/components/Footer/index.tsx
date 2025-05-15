import { Col, Row } from 'antd';
import './style.less';

const Footer = () => {
	return (
		<div
			className='box-wrapper'
			style={{
				maxWidth: '1200px',
				margin: 'auto',
				marginTop: 70,
			}}
		>
			<div className='container'>
				<div className='header'>
					<img className='logo' src='/logo.png' alt='PTIT Logo' />
					<h1 className='title'>{APP_CONFIG_TEN_TRUONG}</h1>
				</div>
				<Row gutter={[12, 0]}>
					<Col span={24} md={16}>
						<div className='contact-info'>
							<div className='contact-item'>
								<svg
									className='icon'
									xmlns='http://www.w3.org/2000/svg'
									fill='red'
									viewBox='0 0 16 20'
									width='16'
									height='20'
								>
									<path d='M8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10ZM14 8.2C14 4.57 11.35 2 8 2C4.65 2 2 4.57 2 8.2C2 10.54 3.95 13.64 8 17.34C12.05 13.64 14 10.54 14 8.2ZM8 0C12.2 0 16 3.22 16 8.2C16 11.52 13.33 15.45 8 20C2.67 15.45 0 11.52 0 8.2C0 3.22 3.8 0 8 0Z' />
								</svg>

								<a
									className='link'
									href='https://www.google.com/maps?ll=20.98088,105.788911&amp;z=15&amp;t=m&amp;hl=vi&amp;gl=US&amp;mapclient=embed&amp;cid=13503165275738789766'
									target='_blank'
									rel='noopener noreferrer'
								>
									Phòng Đào tạo - Học viện CN BCVT
								</a>
							</div>
							<div className='contact-item'>
								<svg
									className='icon'
									xmlns='http://www.w3.org/2000/svg'
									fill='red'
									viewBox='0 0 19 19'
									width='19'
									height='19'
								>
									<path d='M16.1723 18.25H16.0547C2.45081 17.4677 0.51927 5.98923 0.24927 2.48615C0.227514 2.21379 0.259716 1.9398 0.344029 1.6799C0.428343 1.42 0.563111 1.17929 0.740613 0.971559C0.918114 0.763831 1.13486 0.593168 1.37843 0.46935C1.622 0.345532 1.88761 0.270992 2.16004 0.250001H5.97465C6.25196 0.249732 6.52296 0.332738 6.75255 0.488266C6.98214 0.643795 7.15974 0.864679 7.26235 1.12231L8.31465 3.71154C8.41597 3.96323 8.44112 4.23913 8.38696 4.50499C8.33281 4.77084 8.20174 5.01493 8.01004 5.20692L6.53542 6.69539C6.76577 8.00436 7.39263 9.211 8.3312 10.152C9.26977 11.0931 10.4747 11.7231 11.7831 11.9569L13.2854 10.4685C13.4803 10.2789 13.7267 10.1509 13.9938 10.1004C14.261 10.0499 14.5371 10.0792 14.7877 10.1846L17.3977 11.23C17.6515 11.3358 17.868 11.5148 18.0196 11.7442C18.1713 11.9735 18.2512 12.2428 18.2493 12.5177V16.1731C18.2493 16.7239 18.0304 17.2522 17.641 17.6417C17.2515 18.0312 16.7232 18.25 16.1723 18.25ZM2.32619 1.63462C2.14258 1.63462 1.96649 1.70756 1.83666 1.83739C1.70682 1.96722 1.63389 2.14331 1.63389 2.32692V2.38231C1.95235 6.48077 3.99465 16.1731 16.1308 16.8654C16.2218 16.871 16.3129 16.8586 16.3991 16.8289C16.4852 16.7992 16.5647 16.7528 16.6329 16.6924C16.701 16.6319 16.7566 16.5586 16.7964 16.4766C16.8362 16.3946 16.8594 16.3056 16.8647 16.2146V12.5177L14.2547 11.4723L12.2677 13.4454L11.9354 13.4038C5.91235 12.6492 5.09542 6.62615 5.09542 6.56385L5.05388 6.23154L7.02004 4.24462L5.98158 1.63462H2.32619Z' />
								</svg>
								<a className='link' href='tel:02433528122'>
									(024) 33528122
								</a>
							</div>
							<div className='contact-item'>
								<svg
									className='icon'
									xmlns='http://www.w3.org/2000/svg'
									fill='red'
									viewBox='0 0 20 16'
									width='20'
									height='16'
								>
									<path d='M2.75 1H16.75C17.7125 1 18.5 1.7875 18.5 2.75V13.25C18.5 14.2125 17.7125 15 16.75 15H2.75C1.7875 15 1 14.2125 1 13.25V2.75C1 1.7875 1.7875 1 2.75 1Z' />
								</svg>
								<a className='link' href='mailto:daotao@ptit.edu.vn'>
									daotao@ptit.edu.vn
								</a>
							</div>
						</div>

						<div className='address'>
							<div className='address-item'>
								<h3 className='address-title'>Trụ sở chính:</h3>
								<p>122 Hoàng Quốc Việt, Q.Cầu Giấy, Hà Nội.</p>
							</div>
							<div className='address-item'>
								<h3 className='address-title'>Học viện cơ sở tại TP. Hồ Chí Minh:</h3>
								<p>11 Nguyễn Đình Chiểu, P. Đa Kao, Q.1 TP Hồ Chí Minh</p>
							</div>
							<div className='address-item'>
								<h3 className='address-title'>Cơ sở đào tạo tại Hà Nội:</h3>
								<p>Km10, Đường Nguyễn Trãi, Q.Hà Đông, Hà Nội</p>
							</div>
							<div className='address-item'>
								<h3 className='address-title'>Cơ sở đào tạo tại TP Hồ Chí Minh:</h3>
								<p>Đường Man Thiện, P. Hiệp Phú, Q.9 TP Hồ Chí Minh</p>
							</div>
						</div>
					</Col>

					<Col span={24} md={8} className='map-wrapper'>
						<iframe
							src='https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12553.462060862032!2d105.788911!3d20.98088!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acce762c2bb9%3A0xbb64e14683ccd786!2zSOG7jWMgVmnhu4duIENOIELGsHUgQ2jDrW5oIFZp4buFbiBUaMO0bmcgLSBIw6AgxJDDtG5n!5e1!3m2!1svi!2sus!4v1736841314794!5m2!1svi!2sus'
							width='300'
							height='200'
							style={{ border: 0 }}
							allowFullScreen
							loading='lazy'
							title='Google Map'
						/>
					</Col>
				</Row>

				<footer className='footer'>
					<a className='link' href='https://aisoft.com.vn/' target='_blank' rel='noreferrer'>
						<b>© 2024 Designed and Developed by A.I-SOFT</b>
					</a>
				</footer>
			</div>
		</div>
	);
};

export default Footer;

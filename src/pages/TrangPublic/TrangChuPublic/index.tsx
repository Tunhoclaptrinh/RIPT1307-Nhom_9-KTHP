import './components/style.less';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrangChuBody from './Body';
import { Button } from 'antd';

const TrangChu = () => {
	return (
		<>
			<Header
				subTitle='Hệ thống Tuyển sinh Đại học Trực tuyến'
				button={[
					<Button
						key='login'
						type='primary'
						style={{
							display: 'flex',
							alignItems: 'center',
							borderRadius: '6px',
							padding: '4px 16px',
							height: '38px',
						}}
					>
						Đăng nhập
					</Button>,
				]}
				menu={[
					<a key='news' href='/news'>
						Tin tức
					</a>,
					<a key='guide' href='/guide'>
						Hướng dẫn
					</a>,
					<a key='contact' href='/contact'>
						Liên hệ
					</a>,
				]}
			/>

			<TrangChuBody />

			<Footer />
		</>
	);
};

export default TrangChu;

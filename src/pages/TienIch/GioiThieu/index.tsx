import { Card } from 'antd';
import '../../TrangChuPublic/components/style.less';
import { unitName } from '@/services/base/constant';

const AboutPage = () => {
	return (
		<Card bodyStyle={{ height: '100%' }}>
			<div className='home-welcome'>
				<h1 className='title'>GIỚI THIỆU {unitName.toUpperCase()}</h1>
				<h2 className='sub-title'>HỆ THỐNG CHUYỂN ĐỔI SỐ - {unitName.toUpperCase()}</h2>
			</div>
		</Card>
	);
};

export default AboutPage;

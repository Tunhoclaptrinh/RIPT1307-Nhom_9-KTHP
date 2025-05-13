import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
	pwa?: boolean;
	logo?: string;
	borderRadiusBase: string;
	siderWidth: number;
} = {
	navTheme: 'dark',
	primaryColor: process.env.APP_CONFIG_PRIMARY_COLOR,
	borderRadiusBase: '2px',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: false,
	fixSiderbar: true,
	colorWeak: false,
	title: 'LẬP TRÌNH WEB - RIPT',
	pwa: false,
	logo: '/logo.png',
	iconfontUrl: '',
	headerTheme: 'dark',
	headerHeight: 60,
	siderWidth: 220,
};

export default Settings;

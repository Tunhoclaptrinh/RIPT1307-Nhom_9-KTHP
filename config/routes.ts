import { icons } from 'antd/lib/image/PreviewGroup';
import route from 'mock/route';

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
			{
				path: '/user/signup',
				layout: false,
				name: 'signup',
				component: './user/SignUp',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU

	{
		path: '/gioi-thieu',
		name: 'Giới thiệu',
		component: './TienIch/GioiThieu',
		icon: 'InfoCircleOutlined',
	},
	{
		path: '/trang-chu',
		name: 'Trang chủ',
		component: './TrangChuPublic',
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/tra-cuu-public',
		name: 'Tra cứu tuyển sinh',
		component: './TraCuuPublic',
		icon: 'SearchOutlined',
		layout: false,
	},
	{
		path: '/dash-board',
		name: 'Trang cá nhân', // Tramg cá nhân thí sinh
		component: './ThiSinh/DashBoard',
		icon: 'UserOutlined',
		layout: false,
	},
	{
		path: '/users',
		name: 'Người dùng',
		component: './Users',
		icon: 'TeamOutlined',
	},
	{
		path: '/he-dao-tao',
		name: 'Hệ đào tạo',
		component: './HeDaoTao',
		icon: 'AppstoreOutlined',
	},
	{
<<<<<<< HEAD
		path: '/nganh-dao-tao',
		name: 'Ngành đào tạo',
		component: './NganhDaoTao',
		icon: 'AppstoreOutlined',
	},
	{
		path: '/hoc-ba',
		name: 'Học bạ ',
		component: './HocBa',
		icon: 'AppstoreOutlined',
	},
	{
		path: '/thong-tin-hoc-tap',
		name: 'Thông tin học tập ',
		component: './ThongTinHocTap',
		icon: 'AppstoreOutlined',
	},
	{
		path: '/thong-tin-nguyen-vong',
		name: 'Thông tin nguyện vọng ',
		component: './ThongTinNguyenVong',
		icon: 'AppstoreOutlined',
	},
	{
		path: '/ho-so',
		name: 'Ho So ',
		component: './HoSo',
		icon: 'AppstoreOutlined',
	},

=======
		path: '/phuong-thuc-xet-tuyen',
		name: 'Phương thức xét tuyển',
		component: './PhuongThucXT',
		icon: 'ProfileOutlined',
	},
	{
		path: '/to-hop',
		name: 'Tổ hợp môn học',
		component: './ToHop',
		icon: 'ReadOutlined',
	},
	{
		path: '/thong-bao-tuyen-sinh',
		name: 'Thông báo tuyển sinh',
		component: './ThongBaoTS',
		icon: 'NotificationOutlined',
	},
	{
		path: '/huong-dan-ho-so',
		name: 'Hướng dẫn hồ sơ',
		component: './HuongDanHS',
		icon: 'FileTextOutlined',
	},
	{
		path: '/hoi-dap',
		name: 'Hỏi đáp',
		component: './FAQ',
		icon: 'QuestionCircleOutlined',
	},
	{
		path: '/lich-trinh-tuyen-sinh',
		name: 'Lịch trình tuyển sinh',
		component: './LichTrinhTS',
		icon: 'CalendarOutlined',
	},
	{
		path: '/thong-ke-tuyen-sinh',
		name: 'Thống kê tuyển sinh',
		component: './ThongKeTS',
		icon: 'BarChartOutlined',
	},
	{
		path: '/tin-tuc',
		name: 'Tin tức',
		component: './TinTuc',
		icon: 'FileSearchOutlined',
	},
>>>>>>> 485bd9cf5f9a306e12c901110fb5272df82f161c

	// {
	// 	name: 'Public',
	// 	// path: '/public',
	// 	icon: 'GlobalOutlined',
	// 	routes: [],
	// },

	// {
	// 	name: 'Manager',
	// 	icon: 'SettingOutlined',
	// 	routes: [],
	// },

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];

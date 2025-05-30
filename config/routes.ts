﻿import { icons } from 'antd/lib/image/PreviewGroup';
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
			// {
			// 	path: '/user',
			// 	redirect: '/user/login',
			// },
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
		path: '/public',
		name: 'Trang thông tin',
		icon: 'GlobalOutlined',
		routes: [
			{
				path: '/public/trang-chu',
				name: 'Trang chủ',
				component: './TrangPublic/TrangChuPublic',
				icon: 'HomeOutlined',
				layout: false,
			},
			{
				path: '/public/tra-cuu-public',
				name: 'Tra cứu tuyển sinh',
				component: './TrangPublic/TraCuuPublic',
				icon: 'SearchOutlined',
				layout: false,
			},
			{
				path: '/public/dash-board',
				name: 'Trang cá nhân', // Tramg cá nhân thí sinh
				component: './TrangPublic/ThiSinh/DashBoard',
				icon: 'UserOutlined',
				layout: false,
			},
		],
	},
	{
		path: '/public-manage',
		name: 'Quản lý trang',
		icon: 'LayoutOutlined',
		routes: [
			{
				path: '/public-manage/thong-bao-tuyen-sinh',
				name: 'Thông báo tuyển sinh',
				component: './QuanLyTrang/ThongBaoTS',
				icon: 'NotificationOutlined',
			},
			{
				path: '/public-manage/huong-dan-ho-so',
				name: 'Hướng dẫn hồ sơ',
				component: './QuanLyTrang/HDHoSo',
				icon: 'FileTextOutlined',
			},
			{
				path: '/public-manage/hoi-dap',
				name: 'Hỏi đáp',
				component: './QuanLyTrang/FAQ',
				icon: 'QuestionCircleOutlined',
			},
			{
				path: '/public-manage/lich-trinh-tuyen-sinh',
				name: 'Lịch trình tuyển sinh',
				component: './QuanLyTrang/LichTrinhTS',
				icon: 'CalendarOutlined',
			},
			{
				path: '/public-manage/thong-ke-tuyen-sinh',
				name: 'Thống kê tuyển sinh',
				component: './QuanLyTrang/ThongKeTS',
				icon: 'BarChartOutlined',
			},
			{
				path: '/public-manage/tin-tuc',
				name: 'Tin tức',
				component: './QuanLyTrang/TinTuc',
				icon: 'FileSearchOutlined',
			},
		],
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
		path: '/nganh-dao-tao',
		name: 'Ngành đào tạo',
		component: './NganhDaoTao',
		icon: 'BulbOutlined',
	},
	{
		path: '/hoc-ba',
		name: 'Học bạ ',
		component: './HocBa',
		icon: 'ProfileOutlined',
	},
	{
		path: '/thong-tin-hoc-tap',
		name: 'Thông tin học tập ',
		component: './ThongTinHocTap',
		icon: 'TableOutlined',
	},
	{
		path: '/thong-tin-nguyen-vong',
		name: 'Thông tin nguyện vọng ',
		component: './ThongTinNguyenVong',
		icon: 'HeartOutlined',
	},
	{
		path: '/ho-so',
		name: 'Hồ sơ',
		component: './HoSo',
		icon: 'IdcardOutlined',
	},
	{
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
		path: '/dang-ky-tuyen-sinh',
		name: 'Đăng ký tuyển sinh',
		component: './DangKyHoSo',
		icon: 'ReadOutlined',
		layout: false,
	},

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

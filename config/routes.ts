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
				layout: false,
			},
			{
				path: '/public/tra-cuu-public',
				name: 'Tra cứu tuyển sinh',
				component: './TrangPublic/TraCuuPublic',
				layout: false,
			},
			{
				path: '/public/dash-board',
				name: 'Trang cá nhân', // Trang cá nhân thí sinh
				component: './TrangPublic/ThiSinh/DashBoard',
				layout: false,
			},
			{
				path: '/public/dang-ky-tuyen-sinh',
				name: 'Đăng ký tuyển sinh',
				component: './DangKyHoSo',
				icon: 'ReadOutlined',
				layout: false,
			},
			{
				path: '/public/theo-doi-ho-so',
				name: 'Theo dõi hồ sơ',
				component: './TrangPublic/TheoDoiHSPublic',
				// icon: 'CheckOutlined',
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
			},
			{
				path: '/public-manage/huong-dan-ho-so',
				name: 'Hướng dẫn hồ sơ',
				component: './QuanLyTrang/HDHoSo',
			},
			{
				path: '/public-manage/hoi-dap',
				name: 'Hỏi đáp',
				component: './QuanLyTrang/FAQ',
			},
			{
				path: '/public-manage/lich-trinh-tuyen-sinh',
				name: 'Lịch trình tuyển sinh',
				component: './QuanLyTrang/LichTrinhTS',
			},
			{
				path: '/public-manage/thong-ke-tuyen-sinh',
				name: 'Thống kê tuyển sinh',
				component: './QuanLyTrang/ThongKeTS',
			},
			{
				path: '/public-manage/tin-tuc',
				name: 'Tin tức',
				component: './QuanLyTrang/TinTuc',
			},
		],
	},

	{
		path: '/qldt',
		name: 'Quản lý đào tạo',
		icon: 'AppstoreOutlined',
		routes: [
			{
				path: '/qldt/he-dao-tao',
				name: 'Hệ đào tạo',
				component: './HeDaoTao',
			},
			{
				path: '/qldt/nganh-dao-tao',
				name: 'Ngành đào tạo',
				component: './NganhDaoTao',
			},
			{
				path: '/qldt/phuong-thuc-xet-tuyen',
				name: 'Phương thức xét tuyển',
				component: './PhuongThucXT',
			},
			{
				path: '/qldt/to-hop',
				name: 'Tổ hợp môn',
				component: './ToHop',
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
		path: '/thong-ke',
		name: 'Thống kê',
		component: './ThongKe',
		icon: 'BarChartOutlined',
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

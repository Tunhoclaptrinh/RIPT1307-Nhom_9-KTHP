export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './ThiSinh',
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
		icon: 'HomeOutlined',
		layout: false,
	},
	{
		path: '/users',
		name: 'Người dùng',
		component: './Users',
		icon: 'UserOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},

	{
		path: '/dash-board',
		name: 'Trang này là của người dùng',
		component: './ThiSinh/DashBoard',
		icon: 'HomeOutlined',
		// hideInMenu: true,
		layout: false,
	},

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

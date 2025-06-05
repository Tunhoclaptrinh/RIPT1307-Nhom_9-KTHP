import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { EModuleKey, EScopeFile, ESettingKey, EStorageFile } from './constant';

declare module Login {
	// export interface IUser {
	// 	sub: string; // SsoId 'b323b6c8-2f1e-4a9b-941b-f1e466b9ba40';
	// 	id: string;
	// 	ssoId: string;
	// 	email: string;
	// 	email_verified: boolean; // true;
	// 	realm_access: {
	// 		roles: string[];
	// 		//  [
	// 		// 	'QUAN_TRI_VIEN',
	// 		// 	'strapi.super_admin',
	// 		// 	'strapi.Editor',
	// 		// 	'offline_access',
	// 		// 	'admin',
	// 		// 	'uma_authorization',
	// 		// 	'default-roles-vwa',
	// 		// ];
	// 	};
	// 	name: string; // 'Administrator';
	// 	preferred_username: string; // 'admin';
	// 	given_name: string; // 'Administrator';
	// 	family_name: string; // '';
	// 	picture: string; // 'https://images2.thanhnien.vn/528068263637045248/2023/10/14/ronaldo-1697254043939678025874.jpeg';
	// }

	export interface IUser {
		id: string; // ID duy nhất của người dùng, ví dụ: 'user_003'
		email: string; // Email của người dùng, ví dụ: 'leminhc@email.com'
		email_verified?: boolean; // Trạng thái xác thực email (tùy chọn, giữ từ interface gốc)
		password?: string; // Mật khẩu (tùy chọn, chỉ dùng trong quá trình đăng nhập, không nên lưu lâu dài)
		ho: string; // Họ của người dùng, ví dụ: 'Lê Minh'
		ten: string; // Tên của người dùng, ví dụ: 'Châu'
		fullName?: string; // Tên đầy đủ, kết hợp từ ho và ten, ví dụ: 'Lê Minh Châu'
		soCCCD: string; // Số CMND/CCCD, ví dụ: '001234567892'
		ngayCap?: string; // Ngày cấp CCCD, ví dụ: '2021-03-22'
		noiCap?: string; // Nơi cấp CCCD, ví dụ: 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư'
		hoKhauThuongTru?: {
			tinh_ThanhPho: string; // Tỉnh/Thành phố, ví dụ: 'Đà Nẵng'
			quanHuyen: string; // Quận/Huyện, ví dụ: 'Quận Hải Châu'
			xaPhuong: string; // Xã/Phường, ví dụ: 'Phường Hòa Cường Bắc'
			diaChi: string; // Địa chỉ chi tiết, ví dụ: 'Số 78, Đường Nguyễn Văn Linh'
		};
		ngaySinh?: string; // Ngày sinh, ví dụ: '2004-07-05'
		gioiTinh?: string; // Giới tính, ví dụ: 'nam'
		soDT?: string; // Số điện thoại, ví dụ: '0935123456'
		preferred_username?: string; // Tên người dùng ưa thích, ví dụ: 'leminhc' (tùy chọn, giữ từ interface gốc)
		avatar?: string; // URL ảnh đại diện, ví dụ: 'https://images2.thanhnien.vn/...' (tùy chọn)
		realm_access?: {
			roles: string[]; // Danh sách vai trò, ví dụ: ['QUAN_TRI_VIEN', 'admin', ...] (tùy chọn)
		};
	}

	export interface IPermission {
		scopes: string[]; //['cong-tac-sinh-vien:ho-so'];
		rsid: string; // '8f2c194a-fdfc-49e2-a3ba-a0af0325ecd4';
		rsname: EModuleKey; // 'cong-tac-sinh-vien';
	}

	export type TModule = {
		title: string;
		clientId: string;
		url?: string;
		icon?: string;
	};
}

export interface IInitialState {
	settings?: Partial<LayoutSettings>;
	currentUser?: Login.IUser;
	authorizedPermissions?: Login.IPermission[];
	permissionLoading?: boolean;
}

export interface ISetting {
	key: ESettingKey;
	value: any;
}

export interface IFile {
	file: {
		_id: string;
		author: string;
		authorName: string;
		mimetype: string;
		name: string;
		scope: EScopeFile;
		size: number;
		storageType: EStorageFile;

		updatedAt: Date;
		createdAt: Date;
	};
	url: string;
}

//  Address //  Province, District, Ward

export interface ApiResponse<T> {
	code: string;
	data: T[];
	total: number;
}

export interface BaseLocation {
	code: string;
	id?: string; // Thêm id để tương thích
	name: string;
	type?: number; // Optional vì API không trả về field này
	typeText?: string; // Tên loại địa phương (Tỉnh, Thành phố, Quận, Huyện, Phường, Xã)
	division_type?: string; // Field từ API
}

export interface Province extends BaseLocation {
	slug?: string; // Optional vì API không trả về field này
	// Thêm các field từ API response
	codename?: string;
	phone_code?: number;
	districts?: District[]; // Khi gọi với depth=2
}

export interface District extends BaseLocation {
	provinceId?: string; // Optional vì không dùng
	province_code?: string; // Field từ API
	codename?: string;
	wards?: Ward[]; // Khi gọi với depth=2
}

export interface Ward extends BaseLocation {
	districtId?: string; // Optional vì không dùng
	district_code?: string; // Field từ API
	codename?: string;
}

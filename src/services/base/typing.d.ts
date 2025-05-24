import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import type { EModuleKey, EScopeFile, ESettingKey, EStorageFile } from './constant';

declare module Login {
	export interface IUser {
		sub: string; // SsoId 'b323b6c8-2f1e-4a9b-941b-f1e466b9ba40';
		ssoId: string;
		email: string;
		email_verified: boolean; // true;
		realm_access: {
			roles: string[];
			//  [
			// 	'QUAN_TRI_VIEN',
			// 	'strapi.super_admin',
			// 	'strapi.Editor',
			// 	'offline_access',
			// 	'admin',
			// 	'uma_authorization',
			// 	'default-roles-vwa',
			// ];
		};
		name: string; // 'Administrator';
		preferred_username: string; // 'admin';
		given_name: string; // 'Administrator';
		family_name: string; // '';
		picture: string; // 'https://images2.thanhnien.vn/528068263637045248/2023/10/14/ronaldo-1697254043939678025874.jpeg';
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

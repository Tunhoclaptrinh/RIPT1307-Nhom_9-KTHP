import { useState, useEffect } from 'react';
import { useModel, history } from 'umi';
import { message } from 'antd';
import { Login } from '@/services/base/typing';
import { ipLocal } from '@/utils/ip';

interface AuthState {
	user: Login.IUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}

const useAuth = () => {
	const { initialState, setInitialState } = useModel('@@initialState');
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
	});

	// Kiểm tra trạng thái đăng nhập khi hook được khởi tạo
	useEffect(() => {
		const checkAuth = async () => {
			try {
				// Lấy user từ localStorage hoặc initialState
				const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
				const userId = localStorage.getItem('userId');
				let user: Login.IUser | null = initialState?.currentUser || storedUser;

				// Nếu có userId nhưng không có user, gọi API để lấy thông tin
				if (userId && !user?.id) {
					const response = await fetch(`${ipLocal}/users/${userId}`);
					if (!response.ok) {
						throw new Error('Không thể lấy thông tin người dùng');
					}
					const userData: Login.IUser = await response.json();
					user = {
						id: userData.id,
						ho: userData.ho,
						ten: userData.ten,
						fullName: `${userData.ho} ${userData.ten}`,
						email: userData.email,
						soCCCD: userData.soCCCD,
						ngaySinh: userData.ngaySinh,
						gioiTinh: userData.gioiTinh,
						soDT: userData.soDT,
						hoKhauThuongTru: userData.hoKhauThuongTru,
						ngayCap: userData.ngayCap,
						noiCap: userData.noiCap,
						preferred_username: userData.preferred_username,
						avatar: userData.avatar,
						email_verified: userData.email_verified,
						realm_access: userData.realm_access,
					};
					localStorage.setItem('currentUser', JSON.stringify(user));
					await setInitialState({ currentUser: user });
				}

				setAuthState({
					user,
					isAuthenticated: !!user?.id,
					isLoading: false,
				});
			} catch (error) {
				setAuthState({
					user: null,
					isAuthenticated: false,
					isLoading: false,
				});
			}
		};

		checkAuth();
	}, [initialState, setInitialState]);

	// Hàm đăng nhập
	const login = async (login: string, password: string) => {
		try {
			setAuthState((prev) => ({ ...prev, isLoading: true }));

			// Gọi API để lấy danh sách người dùng
			const response = await fetch(`${ipLocal}/users`);
			if (!response.ok) {
				throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
			}
			const users: Login.IUser[] = await response.json();

			// Tìm user với email hoặc soCCCD khớp
			const user = users.find((u: Login.IUser) => (u.email === login || u.soCCCD === login) && u.password === password);

			if (!user) {
				throw new Error('Thông tin đăng nhập không đúng');
			}

			// Lưu thông tin user vào localStorage và initialState
			const userData: Login.IUser = {
				id: user.id,
				ho: user.ho,
				ten: user.ten,
				fullName: `${user.ho} ${user.ten}`,
				email: user.email,
				soCCCD: user.soCCCD,
				ngaySinh: user.ngaySinh,
				gioiTinh: user.gioiTinh,
				soDT: user.soDT,
				hoKhauThuongTru: user.hoKhauThuongTru,
				ngayCap: user.ngayCap,
				noiCap: user.noiCap,
				preferred_username: user.preferred_username,
				avatar: user.avatar,
				email_verified: user.email_verified,
				realm_access: user.realm_access,
			};

			localStorage.setItem('userId', user.id);
			localStorage.setItem('currentUser', JSON.stringify(userData));
			await setInitialState({ currentUser: userData });

			setAuthState({
				user: userData,
				isAuthenticated: true,
				isLoading: false,
			});

			message.success('Đăng nhập thành công! Chào mừng bạn đến với hệ thống.');
			history.push('/public/dash-board');
		} catch (error: any) {
			setAuthState((prev) => ({ ...prev, isLoading: false }));
			message.error(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
			throw error;
		}
	};

	// Hàm đăng xuất
	const logout = async () => {
		try {
			setAuthState({ user: null, isAuthenticated: false, isLoading: true });

			// Xóa thông tin khỏi localStorage
			localStorage.removeItem('userId');
			localStorage.removeItem('currentUser');

			// Xóa thông tin khỏi initialState
			await setInitialState({ currentUser: null });

			message.success('Đăng xuất thành công');
			history.push('/user/login');
		} catch (error: any) {
			message.error('Đăng xuất thất bại. Vui lòng thử lại.');
		} finally {
			setAuthState((prev) => ({ ...prev, isLoading: false }));
		}
	};

	return {
		user: authState.user,
		isAuthenticated: authState.isAuthenticated,
		isLoading: authState.isLoading,
		login,
		logout,
	};
};

export default useAuth;

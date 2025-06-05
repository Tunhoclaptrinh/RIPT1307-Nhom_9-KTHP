import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ipLocal } from '@/utils/ip';

// Interface cho UserMap để tra cứu nhanh
interface IUserMap {
	[userId: string]: {
		fullName: string;
		username?: string;
		email: string;
		avatar?: string;
		ho: string;
		ten: string;
	};
}

const useUsers = () => {
	const [users, setUsers] = useState<User.IRecord[]>([]);
	const [userMap, setUserMap] = useState<IUserMap>({});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Hàm fetch users từ API
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			// Thay thế URL API của bạn ở đây
			const response = await axios.get<User.IRecord[]>(`${ipLocal}/users`);
			const userData = response.data;

			setUsers(userData);

			// Tạo userMap để tra cứu nhanh
			const newUserMap = userData.reduce((acc: IUserMap, user: User.IRecord) => {
				acc[user.id] = {
					fullName: `${user.ho} ${user.ten}`,
					username: user.username,
					email: user.email,
					avatar: user.avatar,
					ho: user.ho,
					ten: user.ten,
				};
				return acc;
			}, {});

			setUserMap(newUserMap);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				setError(err.response?.data?.message || err.message || 'Failed to fetch users');
			} else {
				setError('Unknown error occurred');
			}
			console.error('Error fetching users:', err);
		} finally {
			setLoading(false);
		}
	}, []);

	// Load users khi hook được mount
	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	// Lấy tên đầy đủ từ userId
	const getUserFullName = useCallback(
		(userId: string): string => {
			return userMap[userId]?.fullName || userId;
		},
		[userMap],
	);

	// Lấy username từ userId
	const getUserName = useCallback(
		(userId: string): string => {
			return userMap[userId]?.username || userId;
		},
		[userMap],
	);

	// Lấy thông tin cơ bản của user
	const getUserInfo = useCallback(
		(userId: string) => {
			return userMap[userId] || null;
		},
		[userMap],
	);

	// Lấy user đầy đủ từ userId
	const getUserById = useCallback(
		(userId: string): User.IRecord | null => {
			return users.find((user) => user.id === userId) || null;
		},
		[users],
	);

	// Tìm kiếm users theo tên
	const searchUsersByName = useCallback(
		(searchTerm: string): User.IRecord[] => {
			if (!searchTerm.trim()) return users;

			const lowerSearchTerm = searchTerm.toLowerCase();
			return users.filter(
				(user) =>
					`${user.ho} ${user.ten}`.toLowerCase().includes(lowerSearchTerm) ||
					user.username.toLowerCase().includes(lowerSearchTerm),
			);
		},
		[users],
	);

	// Lấy danh sách options cho Select/AutoComplete
	const getUserOptions = useCallback(() => {
		return users.map((user) => ({
			value: user.id,
			label: `${user.ho} ${user.ten}`,
			username: user.username,
			email: user.email,
			avatar: user.avatar,
		}));
	}, [users]);

	return {
		// Data
		users,
		userMap,
		loading,
		error,

		// Functions
		fetchUsers,
		getUserFullName,
		getUserName,
		getUserInfo,
		getUserById,
		searchUsersByName,
		getUserOptions,

		// Computed values
		userCount: users.length,
		hasUsers: users.length > 0,
	};
};

export default useUsers;

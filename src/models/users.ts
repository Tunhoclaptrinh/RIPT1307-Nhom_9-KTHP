import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { dangKy } from '../services/Users/index';
import { postAvatar, getAvatar, putAvatar, deleteAvatar } from '../services/Users/index';
export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, ipLocal);

	return {
		...objInt,
		dangKy,
		postAvatar,
		getAvatar,
		putAvatar,
		deleteAvatar
	};
};

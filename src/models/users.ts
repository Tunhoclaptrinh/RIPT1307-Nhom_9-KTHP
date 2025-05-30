import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { dangKy } from '../services/Users/index';

export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, ipLocal);
	// const dangXuat = () => {
	// 	localStorage.clear
	// }

	return {
		...objInt,
		dangKy,
	};
};

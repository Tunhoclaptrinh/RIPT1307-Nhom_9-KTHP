import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';
import { dangKy } from '../services/Users/index';

export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, ipLocal);

	return {
		...objInt,
		dangKy,
	};
};

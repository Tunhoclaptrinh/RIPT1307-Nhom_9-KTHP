import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

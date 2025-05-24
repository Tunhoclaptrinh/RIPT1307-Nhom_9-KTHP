import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<ToHop.IRecord>('toHop', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

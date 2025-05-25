import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<TinTuc.IRecord>('tinTuc', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

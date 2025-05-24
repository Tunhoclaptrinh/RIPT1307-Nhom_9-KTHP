import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<HeDaoTao.IRecord>('heDaoTao', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

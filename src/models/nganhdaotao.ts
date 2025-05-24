import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<NganhDaoTao.IRecord>('nganhDaoTao', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

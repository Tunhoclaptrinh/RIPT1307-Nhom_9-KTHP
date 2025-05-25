import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<FAQ.IRecord>('faq', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

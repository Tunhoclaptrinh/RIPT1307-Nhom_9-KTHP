import useInitModel from '@/hooks/useInitModel';
import { HoSo } from '@/services/HoSo/typing';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<HoSo.IRecord>('hoSo', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<HuongDanHS.IRecord>('huongDanHoSo', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

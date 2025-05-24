import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<PhuongThucXT.IRecord>('phuongThucXetTuyen', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

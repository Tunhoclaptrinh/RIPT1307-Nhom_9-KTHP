import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<DiemHocSinh.IRecord>('hocBa', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

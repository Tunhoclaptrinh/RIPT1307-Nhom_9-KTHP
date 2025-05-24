import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<LichTrinhTS.IRecord>('lichTrinhTuyenSinh', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

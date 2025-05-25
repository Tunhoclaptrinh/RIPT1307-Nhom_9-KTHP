import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<ThongKeTS.IRecord>('thongKeTuyenSinh', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

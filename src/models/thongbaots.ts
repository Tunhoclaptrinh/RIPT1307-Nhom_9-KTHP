import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<ThongBaoTS.IRecord>('thongBaoTuyenSinh', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<ThongTinHocTap.IRecord>('thongTinHocTap', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

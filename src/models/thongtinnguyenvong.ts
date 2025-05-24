import useInitModel from '@/hooks/useInitModel';
import { ipLocal } from '@/utils/ip';

export default () => {
	const objInt = useInitModel<ThongTinNguyenVong.IRecord>('thongTinNguyenVong', undefined, undefined, ipLocal);

	return {
		...objInt,
	};
};

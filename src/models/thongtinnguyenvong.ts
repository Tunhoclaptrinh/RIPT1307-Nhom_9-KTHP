import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<ThongTinNguyenVong.IRecord>('thongTinNguyenVong', undefined, undefined, 'http://localhost:3000');

	return {
		...objInt,
	};
};

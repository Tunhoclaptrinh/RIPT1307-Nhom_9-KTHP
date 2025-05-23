import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<ThongTinHocTap.IRecord>('thongTinHocTap', undefined, undefined, 'http://localhost:3000');

	return {
		...objInt,
	};
};

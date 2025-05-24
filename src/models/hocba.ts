import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<DiemHocSinh.IRecord>('hocBa', undefined, undefined, 'http://localhost:3000');

	return {
		...objInt,
	};
};

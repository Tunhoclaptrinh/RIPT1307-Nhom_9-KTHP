import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<PhuongThucXT.IRecord>('phuongThucXetTuyen', undefined, undefined, 'http://localhost:3001');

	return {
		...objInt,
	};
};

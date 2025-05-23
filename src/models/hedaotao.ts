import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<HeDaoTao.IRecord>('heDaoTao', undefined, undefined, 'http://localhost:3000');

	return {
		...objInt,
	};
};

import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<NganhDaoTao.IRecord>('nganhDaoTao', undefined, undefined, 'http://localhost:3000');

	return {
		...objInt,
	};
};

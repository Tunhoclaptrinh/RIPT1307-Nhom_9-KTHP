import useInitModel from '@/hooks/useInitModel';

export default () => {
	const objInt = useInitModel<User.IRecord>('users', undefined, undefined, 'http://localhost:3001');

	return {
		...objInt,
	};
};

import useInitModel from '@/hooks/useInitModel';
import { HoSo } from '@/services/HoSo/typing';

export default () => {
	const objInt = useInitModel<HoSo.IRecord>('hoSo', undefined, undefined, 'http://localhost:3000');

	return {
		...objInt,
	};
};

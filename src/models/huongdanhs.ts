import useInitModel from '@/hooks/useInitModel';

export default () => {
    const objInt = useInitModel<HuongDanHS.IRecord>('huongDanHoSo', undefined, undefined, 'http://localhost:3001');

    return {
        ...objInt,
    };
};

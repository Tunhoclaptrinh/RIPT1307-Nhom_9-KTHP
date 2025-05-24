import useInitModel from '@/hooks/useInitModel';

export default () => {
    const objInt = useInitModel<LichTrinhTS.IRecord>('lichTrinhTuyenSinh', undefined, undefined, 'http://localhost:3000');

    return {
        ...objInt,
    };
};
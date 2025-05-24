import useInitModel from '@/hooks/useInitModel';

export default () => {
    const objInt = useInitModel<ThongKeTS.IRecord>('thongKeTuyenSinh', undefined, undefined, 'http://localhost:3000');

    return {
        ...objInt,
    };
};

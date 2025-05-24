import useInitModel from '@/hooks/useInitModel';

export default () => {
    const objInt = useInitModel<ThongBaoTS.IRecord>('thongBaoTuyenSinh', undefined, undefined, 'http://localhost:3001');

    return {
        ...objInt,
    };
};

import useInitModel from '@/hooks/useInitModel';

export default () => {
    const objInt = useInitModel<TinTuc.IRecord>('tinTuc', undefined, undefined, 'http://localhost:3001');

    return {
        ...objInt,
    };
};

import useInitModel from '@/hooks/useInitModel';

export default () => {
    const objInt = useInitModel<ToHop.IRecord>('toHop', undefined, undefined, 'http://localhost:3000');

    return {
        ...objInt,
    };
};

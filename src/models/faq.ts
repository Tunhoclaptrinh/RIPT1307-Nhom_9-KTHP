import useInitModel from '@/hooks/useInitModel';

export default () => {
    const objInt = useInitModel<FAQ.IRecord>('faq', undefined, undefined, 'http://localhost:3001');

    return {
        ...objInt,
    };
};

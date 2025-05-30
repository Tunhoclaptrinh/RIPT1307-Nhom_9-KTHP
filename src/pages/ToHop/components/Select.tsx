import { Select } from 'antd';

import { useEffect } from 'react';
import { useModel } from 'umi';

const ToHopSelect = (
    props: { values?: string; onChange?: (val: string) => void; placeholder?: string },
    hasDefault?: boolean,
) => {
    const { values: value, onChange } = props;
    const { danhSach, getAllModel } = useModel('tohop');

    useEffect(() => {
        getAllModel().then((res) => {
            if ((hasDefault || !onChange) && onChange && res && res.length > 0) {
                onChange(res[0].id);
            }
        });
    }, []);

    return (
        <Select
            value={value}
            onChange={onChange}
            options={danhSach.map((item) => ({
                key: item.id,
                value: item.id,
                label: `${item.id} - ${item.monHoc.join(' - ')}`,
            }))}
            showSearch
            optionFilterProp='label'
            placeholder={props.placeholder ?? 'Chọn tổ hợp môn học'}
            style={{ width: '100%' }}
            showArrow
        />
    );
};

export default ToHopSelect;

import { Select } from 'antd';

import { useEffect } from 'react';
import { useModel } from 'umi';

const HeDaoTaoSelect = (
	props: { values?: string; onChange?: (val: string) => void; placeholder?: string },
	hasDefault?: boolean,
) => {
	const { values: value, onChange } = props;
	const { danhSach, getAllModel } = useModel('hedaotao');

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
				label: `${item.ten}`,
			}))}
			showSearch
			optionFilterProp='label'
			placeholder={props.placeholder ?? 'Chọn hệ đào tạo'}
			style={{ width: '100%' }}
			showArrow
		/>
	);
};

export default HeDaoTaoSelect;
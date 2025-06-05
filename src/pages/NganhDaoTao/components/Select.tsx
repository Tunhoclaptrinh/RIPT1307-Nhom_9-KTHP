import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const { Option } = Select;

interface NganhDaoTaoSelectProps {
	value?: string;
	onChange?: (val: string) => void;
	placeholder?: string;
	selectData?: NganhDaoTao.IRecord[];
	hasDefault?: boolean;
}

const NganhDaoTaoSelect: React.FC<NganhDaoTaoSelectProps> = ({
	value,
	onChange,
	placeholder,
	selectData,
	hasDefault,
}) => {
	const { danhSach, getAllModel } = useModel('nganhdaotao');

	useEffect(() => {
		if (!selectData && getAllModel) {
			getAllModel().then((res) => {
				if ((hasDefault || !onChange) && onChange && res && res.length > 0) {
					onChange(res[0].id);
				}
			});
		}
	}, [selectData, getAllModel, hasDefault, onChange]);

	const dataSource = selectData || danhSach;

	return (
		<Select
			value={value}
			onChange={onChange}
			placeholder={placeholder ?? 'Chọn ngành đào tạo'}
			showSearch
			optionFilterProp='children'
			filterOption={(input, option) => (option?.children?.toString().toLowerCase() || '').includes(input.toLowerCase())}
			style={{ width: '100%' }}
			showArrow
		>
			{dataSource.map((item) => (
				<Option key={item.ma} value={item.ma}>
					{item.ten} ({item.ma})
				</Option>
			))}
		</Select>
	);
};

export default NganhDaoTaoSelect;

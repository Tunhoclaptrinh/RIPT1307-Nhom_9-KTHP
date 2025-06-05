import { Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const { Option } = Select;

interface PhuongThucXTSelectProps {
	value?: string;
	onChange?: (val: string) => void;
	placeholder?: string;
	selectData?: PhuongThucXT.IRecord[];
	hasDefault?: boolean;
}

const PhuongThucXTSelect: React.FC<PhuongThucXTSelectProps> = ({
	value,
	onChange,
	placeholder,
	selectData,
	hasDefault,
}) => {
	const { danhSach, getAllModel } = useModel('phuongthucxt');

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
			placeholder={placeholder ?? 'Chọn phương thức xét tuyển'}
			showSearch
			optionFilterProp='children'
			filterOption={(input, option) => (option?.children?.toString().toLowerCase() || '').includes(input.toLowerCase())}
			style={{ width: '100%' }}
			showArrow
		>
			{dataSource.map((item) => (
				<Option key={item.id} value={item.id}>
					{item.ten}
				</Option>
			))}
		</Select>
	);
};

export default PhuongThucXTSelect;

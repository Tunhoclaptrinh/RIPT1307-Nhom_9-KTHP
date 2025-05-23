import React from 'react';
import { Select } from 'antd';
import { useAddress } from '@/hooks/useAddress';
import type { District } from '@/types/address';

interface DistrictsSelectProps {
	value?: string;
	onChange?: (value: string) => void;
	provinceCode?: string;
	placeholder?: string;
	disabled?: boolean;
}

const DistrictsSelect: React.FC<DistrictsSelectProps> = ({
	value,
	onChange,
	provinceCode,
	placeholder = 'Chọn quận/huyện',
	disabled,
}) => {
	const { districts, isLoading } = useAddress();

	return (
		<Select
			value={value}
			onChange={onChange}
			loading={isLoading}
			disabled={disabled || !provinceCode}
			showSearch
			placeholder={placeholder}
			optionFilterProp='children'
			style={{ width: '100%' }}
			filterOption={(input, option) =>
				(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
			}
		>
			{districts.map((district) => (
				<Select.Option key={district.id} value={district.id}>
					{`${district.typeText} ${district.name}`}
				</Select.Option>
			))}
		</Select>
	);
};

export default DistrictsSelect;

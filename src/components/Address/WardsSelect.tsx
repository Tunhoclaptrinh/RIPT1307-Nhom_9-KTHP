import React from 'react';
import { Select } from 'antd';
import { useAddress } from '@/hooks/useAddress';
import type { Ward } from '@/types/address';

interface WardsSelectProps {
	value?: string;
	onChange?: (value: string) => void;
	districtCode?: string;
	placeholder?: string;
	disabled?: boolean;
}

const WardsSelect: React.FC<WardsSelectProps> = ({
	value,
	onChange,
	districtCode,
	placeholder = 'Chọn phường/xã',
	disabled,
}) => {
	const { wards, isLoading } = useAddress();

	return (
		<Select
			value={value}
			onChange={onChange}
			loading={isLoading}
			disabled={disabled || !districtCode}
			showSearch
			placeholder={placeholder}
			optionFilterProp='children'
			style={{ width: '100%' }}
			filterOption={(input, option) =>
				(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
			}
		>
			{wards.map((ward) => (
				<Select.Option key={ward.id} value={ward.id}>
					{`${ward.typeText} ${ward.name}`}
				</Select.Option>
			))}
		</Select>
	);
};

export default WardsSelect;

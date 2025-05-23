import React from 'react';
import { Select } from 'antd';
import { useAddress } from '@/hooks/useAddress';

interface ProvincesSelectProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
}

const ProvincesSelect: React.FC<ProvincesSelectProps> = ({ value, onChange, placeholder = 'Chọn tỉnh/thành phố' }) => {
	const { provinces, isLoading } = useAddress();

	return (
		<Select
			value={value}
			onChange={onChange}
			loading={isLoading}
			showSearch
			placeholder={placeholder}
			optionFilterProp='children'
			filterOption={(input, option) =>
				(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
			}
		>
			{provinces.map((province) => (
				<Select.Option key={province.id} value={province.id}>
					{province.name}
				</Select.Option>
			))}
		</Select>
	);
};

export default ProvincesSelect;

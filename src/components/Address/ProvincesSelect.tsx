import React from 'react';
import { Select } from 'antd';
import { useAddress } from '@/hooks/useAddress';

interface ProvincesSelectProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
}

const ProvincesSelect: React.FC<ProvincesSelectProps> = ({ value, onChange, placeholder = 'Chọn tỉnh/thành phố' }) => {
	const { provinces, isLoading, setSelectedProvince } = useAddress();

	const handleChange = (selectedValue: string) => {
		// Cập nhật state trong hook
		setSelectedProvince(selectedValue);
		// Gọi onChange từ parent component
		onChange?.(selectedValue);
	};

	console.log('ProvincesSelect - provinces:', provinces, 'value:', value);

	return (
		<Select
			value={value}
			onChange={handleChange}
			loading={isLoading}
			showSearch
			placeholder={placeholder}
			optionFilterProp='children'
			style={{ width: '100%' }}
			filterOption={(input, option) =>
				(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
			}
			allowClear
		>
			{provinces.map((province) => (
				<Select.Option key={province.code || province.id} value={province.code || province.id}>
					{province.name}
				</Select.Option>
			))}
		</Select>
	);
};

export default ProvincesSelect;

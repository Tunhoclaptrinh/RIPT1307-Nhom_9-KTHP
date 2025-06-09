import React, { useEffect } from 'react';
import { Select } from 'antd';
import { useAddress } from '@/hooks/useAddress';

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
	const { districts, isLoading, setSelectedProvince, setSelectedDistrict, selectedProvince } = useAddress();

	// Khi provinceCode thay đổi từ props, cập nhật selectedProvince trong hook
	useEffect(() => {
		if (provinceCode !== selectedProvince) {
			setSelectedProvince(provinceCode);
		}
	}, [provinceCode, selectedProvince, setSelectedProvince]);

	const handleChange = (selectedValue: string) => {
		// Cập nhật state trong hook
		setSelectedDistrict(selectedValue);
		// Gọi onChange từ parent component
		onChange?.(selectedValue);
	};

	return (
		<Select
			value={value}
			onChange={handleChange}
			loading={isLoading}
			disabled={disabled || !provinceCode}
			showSearch
			placeholder={placeholder}
			optionFilterProp='children'
			style={{ width: '100%' }}
			filterOption={(input, option) =>
				(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
			}
			allowClear
		>
			{districts.map((district) => (
				<Select.Option key={district.code || district.id} value={district.code || district.id}>
					{district.typeText ? `${district.typeText} ${district.name}` : district.name}
				</Select.Option>
			))}
		</Select>
	);
};

export default DistrictsSelect;

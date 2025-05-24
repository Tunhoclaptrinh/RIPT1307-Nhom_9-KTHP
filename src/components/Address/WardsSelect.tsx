import React, { useEffect } from 'react';
import { Select } from 'antd';
import { useAddress } from '@/hooks/useAddress';

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
	const { wards, isLoading, setSelectedDistrict, selectedDistrict } = useAddress();

	// Khi districtCode thay đổi từ props, cập nhật selectedDistrict trong hook
	useEffect(() => {
		if (districtCode !== selectedDistrict) {
			setSelectedDistrict(districtCode);
		}
	}, [districtCode, selectedDistrict, setSelectedDistrict]);

	const handleChange = (selectedValue: string) => {
		// Gọi onChange từ parent component
		onChange?.(selectedValue);
	};

	console.log('WardsSelect - districtCode:', districtCode, 'wards:', wards, 'value:', value);

	return (
		<Select
			value={value}
			onChange={handleChange}
			loading={isLoading}
			disabled={disabled || !districtCode}
			showSearch
			placeholder={placeholder}
			optionFilterProp='children'
			style={{ width: '100%' }}
			filterOption={(input, option) =>
				(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
			}
			allowClear
		>
			{wards.map((ward) => (
				<Select.Option key={ward.code || ward.id} value={ward.code || ward.id}>
					{ward.typeText ? `${ward.typeText} ${ward.name}` : ward.name}
				</Select.Option>
			))}
		</Select>
	);
};

export default WardsSelect;

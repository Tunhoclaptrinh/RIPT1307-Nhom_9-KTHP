import React from 'react';
import { Select, Form, Space, Spin } from 'antd';
import { useAddress } from '@/hooks/useAddress';

interface AddressSelectProps {
	value?: {
		province?: string;
		district?: string;
		ward?: string;
	};
	onChange?: (value: { province?: string; district?: string; ward?: string }) => void;
}

const AddressSelect: React.FC<AddressSelectProps> = ({ value, onChange }) => {
	const {
		provinces,
		districts,
		wards,
		selectedProvince,
		selectedDistrict,
		selectedWard,
		setSelectedProvince,
		setSelectedDistrict,
		setSelectedWard,
		isLoading,
		error,
	} = useAddress();

	const handleProvinceChange = (code: string) => {
		setSelectedProvince(code);
		onChange?.({
			province: code,
			district: undefined,
			ward: undefined,
		});
	};

	const handleDistrictChange = (code: string) => {
		setSelectedDistrict(code);
		onChange?.({
			province: selectedProvince,
			district: code,
			ward: undefined,
		});
	};

	const handleWardChange = (code: string) => {
		setSelectedWard(code);
		onChange?.({
			province: selectedProvince,
			district: selectedDistrict,
			ward: code,
		});
	};

	if (error) {
		return <div style={{ color: 'red' }}>{error}</div>;
	}

	return (
		<Space direction='vertical' style={{ width: '100%' }} size='small'>
			<Form.Item>
				<Select
					placeholder='Chọn tỉnh/thành phố'
					value={selectedProvince}
					onChange={handleProvinceChange}
					loading={isLoading}
					showSearch
					filterOption={(input, option) =>
						(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
					}
				>
					{provinces.map((province) => (
						<Select.Option key={province.code} value={province.code}>
							{province.name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item>
				<Select
					placeholder='Chọn quận/huyện'
					value={selectedDistrict}
					onChange={handleDistrictChange}
					disabled={!selectedProvince}
					loading={isLoading}
					showSearch
					filterOption={(input, option) =>
						(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
					}
				>
					{districts.map((district) => (
						<Select.Option key={district.code} value={district.code}>
							{district.name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item>
				<Select
					placeholder='Chọn phường/xã'
					value={selectedWard}
					onChange={handleWardChange}
					disabled={!selectedDistrict}
					loading={isLoading}
					showSearch
					filterOption={(input, option) =>
						(option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
					}
				>
					{wards.map((ward) => (
						<Select.Option key={ward.code} value={ward.code}>
							{ward.name}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
		</Space>
	);
};

export default AddressSelect;

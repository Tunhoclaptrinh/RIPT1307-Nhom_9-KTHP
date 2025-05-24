import { useState, useEffect } from 'react';
import type { Province, District, Ward } from '@/services/base/typing.d.ts';

interface UseAddressReturn {
	provinces: Province[];
	districts: District[];
	wards: Ward[];
	isLoading: boolean;
	error?: string;
	selectedProvince?: string;
	selectedDistrict?: string;
	setSelectedProvince: (code?: string) => void;
	setSelectedDistrict: (code?: string) => void;
}

const API_URL = 'https://provinces.open-api.vn/api/';

export const useAddress = (): UseAddressReturn => {
	const [provinces, setProvinces] = useState<Province[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);
	const [wards, setWards] = useState<Ward[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [selectedProvince, setSelectedProvince] = useState<string>();
	const [selectedDistrict, setSelectedDistrict] = useState<string>();

	// Fetch provinces khi component mount
	useEffect(() => {
		const fetchProvinces = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`${API_URL}?depth=1`);
				const result = await response.json();
				console.log('Provinces Result:', result);
				setProvinces(
					result.map((p: any) => ({
						code: p.code,
						id: p.code,
						name: p.name,
						typeText: p.division_type,
					})),
				);
			} catch (err) {
				setError('Không thể tải danh sách tỉnh/thành phố');
				console.error('Provinces Error:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProvinces();
	}, []);

	// Fetch districts khi selectedProvince thay đổi
	useEffect(() => {
		const fetchDistricts = async () => {
			if (!selectedProvince) {
				setDistricts([]);
				setWards([]);
				return;
			}

			try {
				setIsLoading(true);
				const response = await fetch(`${API_URL}p/${selectedProvince}?depth=2`);
				const result = await response.json();
				console.log('Districts Result for province', selectedProvince, ':', result.districts);

				if (result.districts) {
					setDistricts(
						result.districts.map((d: any) => ({
							id: d.code,
							code: d.code,
							name: d.name,
							typeText: d.division_type,
						})),
					);
				} else {
					setDistricts([]);
				}
				setWards([]); // Reset wards khi province thay đổi
			} catch (err) {
				setError('Không thể tải danh sách quận/huyện');
				console.error('Districts Error:', err);
				setDistricts([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDistricts();
	}, [selectedProvince]);

	// Fetch wards khi selectedDistrict thay đổi
	useEffect(() => {
		const fetchWards = async () => {
			if (!selectedDistrict) {
				setWards([]);
				return;
			}

			try {
				setIsLoading(true);
				const response = await fetch(`${API_URL}d/${selectedDistrict}?depth=2`);
				const result = await response.json();
				console.log('Wards Result for district', selectedDistrict, ':', result.wards);

				if (result.wards) {
					setWards(
						result.wards.map((w: any) => ({
							id: w.code,
							code: w.code,
							name: w.name,
							typeText: w.division_type,
						})),
					);
				} else {
					setWards([]);
				}
			} catch (err) {
				setError('Không thể tải danh sách phường/xã');
				console.error('Wards Error:', err);
				setWards([]);
			} finally {
				setIsLoading(false);
			}
		};

		fetchWards();
	}, [selectedDistrict]);

	const handleSetSelectedProvince = (code?: string) => {
		setSelectedProvince(code);
		setSelectedDistrict(undefined); // Reset district khi province thay đổi
	};

	const handleSetSelectedDistrict = (code?: string) => {
		setSelectedDistrict(code);
	};

	return {
		provinces,
		districts,
		wards,
		isLoading,
		error,
		selectedProvince,
		selectedDistrict,
		setSelectedProvince: handleSetSelectedProvince,
		setSelectedDistrict: handleSetSelectedDistrict,
	};
};

import { useState, useEffect } from 'react';
import type { Province, District, Ward, ApiResponse } from '@/services/base/typing.d.ts';

interface UseAddressReturn {
	provinces: Province[];
	districts: District[];
	wards: Ward[];
	selectedProvince?: string;
	selectedDistrict?: string;
	selectedWard?: string;
	setSelectedProvince: (code: string) => void;
	setSelectedDistrict: (code: string) => void;
	setSelectedWard: (code: string) => void;
	isLoading: boolean;
	error?: string;
}

const API_URL = 'https://open.oapi.vn/location';

export const useAddress = (): UseAddressReturn => {
	const [provinces, setProvinces] = useState<Province[]>([]);
	const [districts, setDistricts] = useState<District[]>([]);
	const [wards, setWards] = useState<Ward[]>([]);
	const [selectedProvince, setSelectedProvince] = useState<string>();
	const [selectedDistrict, setSelectedDistrict] = useState<string>();
	const [selectedWard, setSelectedWard] = useState<string>();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>();

	// Fetch provinces
	useEffect(() => {
		const fetchProvinces = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(`${API_URL}/provinces?page=0&size=100`);
				const result: ApiResponse<Province> = await response.json();
				if (result.code === 'success') {
					setProvinces(result.data);
				}
			} catch (err) {
				setError('Không thể tải danh sách tỉnh/thành phố');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProvinces();
	}, []);

	// Fetch districts when province changes
	useEffect(() => {
		const fetchDistricts = async () => {
			if (!selectedProvince) {
				setDistricts([]);
				setWards([]);
				setSelectedDistrict(undefined);
				setSelectedWard(undefined);
				return;
			}

			try {
				setIsLoading(true);
				const response = await fetch(`${API_URL}/districts/${selectedProvince}?page=0&size=100&query=thanh`);
				const result: ApiResponse<District> = await response.json();
				if (result.code === 'success') {
					setDistricts(result.data);
					setWards([]);
					setSelectedDistrict(undefined);
					setSelectedWard(undefined);
				}
			} catch (err) {
				setError('Không thể tải danh sách quận/huyện');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDistricts();
	}, [selectedProvince]);

	// Fetch wards when district changes
	useEffect(() => {
		const fetchWards = async () => {
			if (!selectedDistrict) {
				setWards([]);
				setSelectedWard(undefined);
				return;
			}

			try {
				setIsLoading(true);
				const response = await fetch(`${API_URL}/wards/${selectedDistrict}?page=0&size=30`);
				const result: ApiResponse<Ward> = await response.json();
				if (result.code === 'success') {
					setWards(result.data);
					setSelectedWard(undefined);
				}
			} catch (err) {
				setError('Không thể tải danh sách phường/xã');
				console.error(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchWards();
	}, [selectedDistrict]);

	return {
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
	};
};

import { useState, useEffect, useCallback } from 'react';
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
	getAddressName: (address: any) => Promise<string>;
	loadDistrictsFor: (provinceCode: string) => Promise<District[]>;
	loadWardsFor: (districtCode: string) => Promise<Ward[]>;
}

const API_URL = 'https://provinces.open-api.vn/api/';

// Cache toàn cục để tránh load lại dữ liệu
const globalCache = {
	provinces: [] as Province[],
	districts: {} as Record<string, District[]>,
	wards: {} as Record<string, Ward[]>,
	provincesLoaded: false,
};

export const useAddress = (): UseAddressReturn => {
	const [provinces, setProvinces] = useState<Province[]>(globalCache.provinces);
	const [districts, setDistricts] = useState<District[]>([]);
	const [wards, setWards] = useState<Ward[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>();
	const [selectedProvince, setSelectedProvince] = useState<string>();
	const [selectedDistrict, setSelectedDistrict] = useState<string>();

	// Load provinces một lần duy nhất
	useEffect(() => {
		const fetchProvinces = async () => {
			if (globalCache.provincesLoaded && globalCache.provinces.length > 0) {
				setProvinces(globalCache.provinces);
				return;
			}

			try {
				setIsLoading(true);
				const response = await fetch(`${API_URL}?depth=1`);
				const result = await response.json();

				const provinceList = result.map((p: any) => ({
					code: p.code,
					id: p.code,
					name: p.name,
					typeText: p.division_type,
				}));

				globalCache.provinces = provinceList;
				globalCache.provincesLoaded = true;
				setProvinces(provinceList);
			} catch (err) {
				setError('Không thể tải danh sách tỉnh/thành phố');
				console.error('Provinces Error:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchProvinces();
	}, []);

	// Load districts cho một province cụ thể
	const loadDistrictsFor = useCallback(async (provinceCode: string): Promise<District[]> => {
		if (!provinceCode) return [];

		// Kiểm tra cache trước
		if (globalCache.districts[provinceCode]) {
			return globalCache.districts[provinceCode];
		}

		try {
			const response = await fetch(`${API_URL}p/${provinceCode}?depth=2`);
			const result = await response.json();

			if (result.districts) {
				const districtList = result.districts.map((d: any) => ({
					id: d.code,
					code: d.code,
					name: d.name,
					typeText: d.division_type,
				}));

				// Lưu vào cache
				globalCache.districts[provinceCode] = districtList;
				return districtList;
			}
			return [];
		} catch (err) {
			console.error('Districts Error:', err);
			return [];
		}
	}, []);

	// Load wards cho một district cụ thể
	const loadWardsFor = useCallback(async (districtCode: string): Promise<Ward[]> => {
		if (!districtCode) return [];

		// Kiểm tra cache trước
		if (globalCache.wards[districtCode]) {
			return globalCache.wards[districtCode];
		}

		try {
			const response = await fetch(`${API_URL}d/${districtCode}?depth=2`);
			const result = await response.json();

			if (result.wards) {
				const wardList = result.wards.map((w: any) => ({
					id: w.code,
					code: w.code,
					name: w.name,
					typeText: w.division_type,
				}));

				// Lưu vào cache
				globalCache.wards[districtCode] = wardList;
				return wardList;
			}
			return [];
		} catch (err) {
			console.error('Wards Error:', err);
			return [];
		}
	}, []);

	// Fetch districts khi selectedProvince thay đổi
	useEffect(() => {
		const fetchDistricts = async () => {
			if (!selectedProvince) {
				setDistricts([]);
				setWards([]);
				return;
			}

			const districtList = await loadDistrictsFor(selectedProvince);
			setDistricts(districtList);
			setWards([]); // Reset wards khi province thay đổi
		};

		fetchDistricts();
	}, [selectedProvince, loadDistrictsFor]);

	// Fetch wards khi selectedDistrict thay đổi
	useEffect(() => {
		const fetchWards = async () => {
			if (!selectedDistrict) {
				setWards([]);
				return;
			}

			const wardList = await loadWardsFor(selectedDistrict);
			setWards(wardList);
		};

		fetchWards();
	}, [selectedDistrict, loadWardsFor]);

	const handleSetSelectedProvince = useCallback((code?: string) => {
		setSelectedProvince(code);
		setSelectedDistrict(undefined); // Reset district khi province thay đổi
	}, []);

	const handleSetSelectedDistrict = useCallback((code?: string) => {
		setSelectedDistrict(code);
	}, []);

	// Hàm lấy tên địa chỉ đầy đủ - async để load dữ liệu cần thiết
	const getAddressName = useCallback(
		async (address: any): Promise<string> => {
			if (
				typeof address !== 'object' ||
				address === null ||
				!('tinh_ThanhPho' in address) ||
				!('quanHuyen' in address) ||
				!('xaPhuong' in address) ||
				!('diaChi' in address)
			) {
				return '';
			}

			try {
				// Đảm bảo provinces đã được load
				let provinceList = globalCache.provinces;
				if (provinceList.length === 0) {
					// Nếu chưa có trong cache, load ngay
					const response = await fetch(`${API_URL}?depth=1`);
					const result = await response.json();
					provinceList = result.map((p: any) => ({
						code: p.code,
						id: p.code,
						name: p.name,
						typeText: p.division_type,
					}));
					globalCache.provinces = provinceList;
					globalCache.provincesLoaded = true;
				}

				// Tìm tên tỉnh/thành phố
				const province = provinceList.find((p) => p.code === address.tinh_ThanhPho)?.name || '';

				// Load và tìm tên quận/huyện
				let district = '';
				if (address.tinh_ThanhPho) {
					const districts = await loadDistrictsFor(address.tinh_ThanhPho);
					district = districts.find((d) => d.code === address.quanHuyen)?.name || '';
				}

				// Load và tìm tên phường/xã
				let ward = '';
				if (address.quanHuyen) {
					const wards = await loadWardsFor(address.quanHuyen);
					ward = wards.find((w) => w.code === address.xaPhuong)?.name || '';
				}

				const detail = address.diaChi || '';

				return [detail, ward, district, province].filter(Boolean).join(', ');
			} catch (err) {
				console.error('Error getting address name:', err);
				return '';
			}
		},
		[loadDistrictsFor, loadWardsFor],
	);

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
		getAddressName,
		loadDistrictsFor,
		loadWardsFor,
	};
};

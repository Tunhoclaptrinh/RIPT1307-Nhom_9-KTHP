import { useState } from "react";
import { getfetchDistricts, getfetchProvinces, getfetchWards } from "@/services/DiaChi";
interface Province {
  id: number;
  name: string;
}
export default () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [thongTinHocTap, setThongTinHocTap] = useState<any>(null);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<Province[]>([]);
    const [wards, setWards] = useState<Province[]>([]);

    const fetchProvinces = async () => {
        const res = await getfetchProvinces();
        setProvinces(res);
    };

    const fetchDistricts = async (provinceId: number) => {
        const res = await getfetchDistricts(provinceId);
        setDistricts(res);
    };

    const fetchWards = async (districtId: number) => {
        const res = await getfetchWards(districtId);
        setWards(res);
    };

    return {
        modalVisible,
        setModalVisible,
        thongTinHocTap,
        setThongTinHocTap,
        provinces,
        districts,
        wards,
        fetchProvinces,
        fetchDistricts,
        fetchWards
    };
};

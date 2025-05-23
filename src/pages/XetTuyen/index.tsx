import { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import {
  fetchHeDaoTao,
  fetchPhuongThucXetTuyen,
  fetchToHop,
  fetchNganhDaoTao,
  fetchHoSoByUser
} from '@/services/XetTuyen';
import XetTuyenForm from './components/XetTuyenForm';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './index.less';
import dayjs from 'dayjs';

const XetTuyenPage = () => {
  const [form] = Form.useForm();
  const [heDaoTao, setHeDaoTao] = useState<any[]>([]);
  const [phuongThuc, setPhuongThuc] = useState<any[]>([]);
  const [nganh, setNganh] = useState<any[]>([]);
  const [toHop, setToHop] = useState<any[]>([]);
  const [trangThaiHoSo, setTrangThaiHoSo] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resHe, resPhuong, resNganh, resToHop] = await Promise.all([
          fetchHeDaoTao(),
          fetchPhuongThucXetTuyen(),
          fetchNganhDaoTao(),
          fetchToHop(),
        ]);
        setHeDaoTao(resHe.data);
        setPhuongThuc(resPhuong.data);
        setNganh(resNganh.data);
        setToHop(resToHop.data);
      } catch (error) {
        message.error('Không thể tải dữ liệu');
      }
    };

    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      form.setFieldsValue({
        ...parsed,
        ngaySinh: parsed.ngaySinh ? dayjs(parsed.ngaySinh) : null,
        hoKhauThuongTru: [
          parsed.hoKhauThuongTru?.tinh_ThanhPho,
          parsed.hoKhauThuongTru?.quanHuyen,
          parsed.hoKhauThuongTru?.xaPhuong,
        ],
      });

      fetchHoSoByUser(parsed.id).then((res) => {
        if (res.data && res.data.length > 0) {
          setTrangThaiHoSo('Đã nộp - ' + res.data[0].id);
        } else {
          setTrangThaiHoSo('Chưa nộp');
        }
      });
    }

    fetchData();
  }, [form]);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <XetTuyenForm
          heDaoTao={heDaoTao}
          phuongThuc={phuongThuc}
          nganh={nganh}
          toHop={toHop}
          form={form}
          trangThaiHoSo={trangThaiHoSo}
          setTrangThaiHoSo={setTrangThaiHoSo}
        />
      </div>
      <Footer />
    </div>
  );
};

export default XetTuyenPage;

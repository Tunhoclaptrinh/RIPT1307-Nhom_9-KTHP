import MyDatePicker from '@/components/MyDatePicker';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import { useState } from 'react';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import KetQuaXetTuyen from './components/KetQua';
import axios from 'axios';
import moment from 'moment';

const TraCuuTuyenSinhPublic = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const filledFields = Object.values(values).filter((value) => value).length;
    if (filledFields < 2) {
      message.error('Vui lòng nhập ít nhất 2 trường');
      return;
    }

    setLoading(true);
    try {
      const queryParams: any = {};
      if (values.ho) queryParams.ho = values.ho; // Updated to use "ho"
      if (values.ten) queryParams.ten = values.ten; // Updated to use "ten"
      if (values.ngaySinh) queryParams.ngaySinh = moment(values.ngaySinh).format('YYYY-MM-DD');
      if (values.soCCCD) queryParams.soCCCD = values.soCCCD;

      const response = await axios.get('http://localhost:3000/users', { params: queryParams });
      const users = response.data;
      const results = await Promise.all(
        users.map(async (user: any) => {
          const hoSoResponse = await axios.get(`http://localhost:3000/hoSo?userId=${user.id}`);
          const hoSo = hoSoResponse.data[0] || {};
          const nguyenVongIds = hoSo.nguyenVong || [];
          const nguyenVongData = await Promise.all(
            nguyenVongIds.map((nvId: string) =>
              axios.get(`http://localhost:3000/thongTinNguyenVong/${nvId}`).then((res) => res.data)
            )
          );
          const thongTinHocTapResponse = await axios.get(
            `http://localhost:3000/thongTinHocTap?hoBaId=${hoSo.thongTinCaNhanId || ''}`
          );
          const thongTinHocTap = thongTinHocTapResponse.data[0] || {};

          return { user, hoSo, nguyenVong: nguyenVongData, thongTinHocTap };
        })
      );

      setSearchResults(results);
      if (results.length === 0) {
        message.warning('Không tìm thấy thông tin phù hợp');
      }
    } catch (error) {
      console.error(error);
      message.error('Có lỗi xảy ra khi tra cứu, vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header subTitle="Hệ thống Tuyển sinh Đại học Trực tuyến" />
      <Row
        style={{
          backgroundImage: `url('/bg-vbcc.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          background: '#f5f5f5',
        }}
      >
        <Col style={{ margin: 'auto', paddingTop: 30, paddingBottom: 30, marginTop: 90 }} xs={24} lg={20}>
          <Card title="Thông tin tra cứu">
            <Form onFinish={onFinish} layout={'vertical'} form={form}>
              <Row gutter={[12, 12]}>
                <Col span={24} md={12}>
                  <Form.Item name="ho" label="Họ">
                    <Input placeholder="Nhập họ" />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="ten" label="Tên">
                    <Input placeholder="Nhập tên" />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="ngaySinh" label="Ngày sinh">
                    <MyDatePicker placeholder="Chọn ngày sinh" format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="soCCCD" label="Số CMND/CCCD">
                    <Input placeholder="Nhập số CMND/CCCD" />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ display: 'flex', justifySelf: 'end' }}>
                <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  style={{ minWidth: 180, margin: 'auto', marginTop: 20, height: 40 }}
                >
                  Tra cứu
                </Button>
              </Row>
            </Form>
          </Card>
          <div style={{ marginTop: 12 }}>
            <KetQuaXetTuyen searchResults={searchResults} loading={loading} />
          </div>
        </Col>
      </Row>
      <Footer />
    </>
  );
};

export default TraCuuTuyenSinhPublic;
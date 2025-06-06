import MyDatePicker from '@/components/MyDatePicker';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row, Space } from 'antd';
import { useState } from 'react';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import KetQuaXetTuyen from './components/KetQua';
import axios from 'axios';
import moment from 'moment';
import { ipLocal } from '@/utils/ip';

const TraCuuTuyenSinhPublic = () => {
  const [form] = Form.useForm();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    // Kiểm tra ít nhất 2 trường được nhập
    const filledFields = Object.entries(values).filter(([_, value]) => {
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }
      return value !== null && value !== undefined;
    }).length;

    if (filledFields < 2) {
      message.error('Vui lòng nhập ít nhất 2 trường thông tin để tra cứu');
      return;
    }

    setLoading(true);
    try {
      let users = [];

      if (values.id?.trim()) {
        // Nếu có ID người dùng, tìm trực tiếp
        try {
          const userResponse = await axios.get(`${ipLocal}/users/${values.id.trim()}`);
          if (userResponse?.data) {
            users = [userResponse.data];
          }
        } catch (error) {
          // Nếu không tìm thấy user theo ID, tiếp tục tìm trong toàn bộ danh sách
          const userResponse = await axios.get(`${ipLocal}/users`);
          users = userResponse.data.filter((user: any) => user.id === values.id.trim());
        }
      } else {
        // Lấy toàn bộ danh sách người dùng để lọc thủ công
        const userResponse = await axios.get(`${ipLocal}/users`);
        users = userResponse.data;
      }

      // Lọc người dùng theo các trường nhập
      const matchedUsers = users.filter((user: any) => {
        return Object.entries(values).every(([key, val]) => {
          if (!val) return true; // bỏ qua trường chưa nhập
          
          const stringVal = typeof val === 'string' ? val.trim() : val;
          if (!stringVal) return true;

          if (key === 'ngaySinh') {
            return moment(user[key]).format('YYYY-MM-DD') === moment(stringVal).format('YYYY-MM-DD');
          }
          
          if (key === 'maHoSo' || key === 'id') {
            return true; // kiểm tra sau trong logic hồ sơ
          }
          
          const userVal = user[key];
          if (typeof userVal === 'string' && typeof stringVal === 'string') {
            return userVal.toLowerCase().includes(stringVal.toLowerCase());
          }
          
          return userVal === stringVal;
        });
      });

      if (matchedUsers.length === 0) {
        setSearchResults([]);
        message.warning('Không tìm thấy thông tin người dùng phù hợp');
        return;
      }

      // Lấy thông tin chi tiết cho từng user
      const results = await Promise.all(
        matchedUsers.map(async (user: any) => {
          try {
            // Lấy hồ sơ theo userId
            const hoSoResponse = await axios.get(`${ipLocal}/hoSo?thongTinCaNhanId=${user.id}`);
            let hoSoList = hoSoResponse.data || [];

            // Lọc theo mã hồ sơ nếu có
            if (values.maHoSo?.trim()) {
              hoSoList = hoSoList.filter((h: any) => 
                h.id && h.id.toLowerCase().includes(values.maHoSo.trim().toLowerCase())
              );
            }

            // Nếu không có hồ sơ nào phù hợp, bỏ qua user này
            if (hoSoList.length === 0) {
              return null;
            }

            // Lấy hồ sơ đầu tiên (hoặc có thể lấy tất cả)
            const hoSo = hoSoList[0];
            const nguyenVongIds = hoSo.nguyenVong || [];

            // Lấy thông tin nguyện vọng
            const nguyenVongData = await Promise.all(
              nguyenVongIds.map(async (nvId: string) => {
                try {
                  const response = await axios.get(`${ipLocal}/thongTinNguyenVong/${nvId}`);
                  return response.data;
                } catch (error) {
                  console.warn(`Không tìm thấy nguyện vọng ${nvId}`);
                  return null;
                }
              })
            );

            // Lọc bỏ nguyện vọng null
            const validNguyenVong = nguyenVongData.filter(nv => nv !== null);

            // Lấy thông tin học tập
            let thongTinHocTap = {};
            
            // Thử lấy theo userId trước
            try {
              const thongTinHocTapResponse = await axios.get(
                `${ipLocal}/thongTinHocTap?userId=${user.id}`
              );
              if (thongTinHocTapResponse.data && thongTinHocTapResponse.data.length > 0) {
                thongTinHocTap = thongTinHocTapResponse.data[0];
              }
            } catch (error) {
              console.warn(`Không tìm thấy thông tin học tập cho user ${user.id}`);
            }

            // Nếu không tìm được theo userId và có thongTinHocTapId trong hồ sơ
            if (Object.keys(thongTinHocTap).length === 0 && hoSo.thongTinHocTapId) {
              try {
                const thongTinHocTapResponse = await axios.get(
                  `${ipLocal}/thongTinHocTap/${hoSo.thongTinHocTapId}`
                );
                thongTinHocTap = thongTinHocTapResponse.data || {};
              } catch (error) {
                console.warn(`Không tìm thấy thông tin học tập với ID ${hoSo.thongTinHocTapId}`);
              }
            }

            return { 
              user, 
              hoSo, 
              nguyenVong: validNguyenVong, 
              thongTinHocTap 
            };
          } catch (error) {
            console.error(`Lỗi khi lấy thông tin cho user ${user.id}:`, error);
            return null;
          }
        })
      );

      // Lọc bỏ kết quả null
      const validResults = results.filter(result => result !== null);
      
      setSearchResults(validResults);
      
      if (validResults.length === 0) {
        message.warning('Không tìm thấy hồ sơ xét tuyển phù hợp với thông tin đã nhập');
      } else {
        message.success(`Tìm thấy ${validResults.length} hồ sơ phù hợp`);
      }
    } catch (error) {
      console.error('Lỗi tra cứu:', error);
      message.error('Có lỗi xảy ra khi tra cứu thông tin. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setSearchResults([]);
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
          minHeight: '100vh',
        }}
      >
        <Col 
          style={{ 
            margin: 'auto', 
            paddingTop: 30, 
            paddingBottom: 30, 
            marginTop: 90 
          }} 
          xs={24} 
          lg={20}
        >
          <Card 
            title="Thông tin tra cứu kết quả xét tuyển"
            extra={
              <Space>
                <span style={{ fontSize: '12px', color: '#666' }}>
                  * Vui lòng nhập ít nhất 2 trường thông tin
                </span>
              </Space>
            }
          >
            <Form onFinish={onFinish} layout="vertical" form={form}>
              <Row gutter={[16, 16]}>
                <Col span={24} md={12}>
                  <Form.Item name="ho" label="Họ">
                    <Input placeholder="Nhập họ của thí sinh" allowClear />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="ten" label="Tên">
                    <Input placeholder="Nhập tên của thí sinh" allowClear />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="ngaySinh" label="Ngày sinh">
                    <MyDatePicker 
                      placeholder="Chọn ngày sinh" 
                      format="DD/MM/YYYY"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="soCCCD" label="Số CMND/CCCD">
                    <Input placeholder="Nhập số CMND/CCCD" allowClear />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="id" label="ID người dùng">
                    <Input placeholder="Nhập ID người dùng" allowClear />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="maHoSo" label="Mã hồ sơ">
                    <Input placeholder="Nhập mã hồ sơ xét tuyển" allowClear />
                  </Form.Item>
                </Col>
              </Row>
              <Row justify="center" style={{ marginTop: 20 }}>
                <Space size="middle">
                  <Button
                    icon={<ClearOutlined />}
                    onClick={handleReset}
                    size="large"
                    style={{ minWidth: 120 }}
                  >
                    Làm mới
                  </Button>
                  <Button
                    icon={<SearchOutlined />}
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    size="large"
                    style={{ minWidth: 180 }}
                  >
                    Tra cứu kết quả
                  </Button>
                </Space>
              </Row>
            </Form>
          </Card>
          
          <div style={{ marginTop: 16 }}>
            <KetQuaXetTuyen searchResults={searchResults} loading={loading} />
          </div>
        </Col>
      </Row>
      <Footer />
    </>
  );
};

export default TraCuuTuyenSinhPublic;
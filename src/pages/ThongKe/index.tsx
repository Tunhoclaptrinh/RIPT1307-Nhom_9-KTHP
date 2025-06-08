import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Modal, 
  Table, 
  Tag, 
  Select, 
  Tooltip, 
  Divider,
  Statistic,
  notification,
  Space
} from 'antd';
import { 
  EyeOutlined, 
  BarChartOutlined, 
  DownloadOutlined, 
  FileExcelOutlined,
  UserOutlined,
  TrophyOutlined,
  BookOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ColumnChart from '../../components/Chart/ColumnChart';
import DonutChart from '../../components/Chart/DonutChart';
import LineChart from '../../components/Chart/LineChart';

const { Option } = Select;
const API = 'http://localhost:3000';

type NganhDaoTao = { ma: string; ten: string; toHopXetTuyenId: string };
type NguyenVong = { id: string; maNganh: string; tongDiem?: number; ten: string };
type PhuongThuc = { id: string; ten: string };
type ToHop = { id: string; monHoc: string[] };
type HoSo = {
  id: string;
  thongTinLienHe?: {
    ten?: string;
    diaChi?: {
      diaChiCuThe?: string;
      xaPhuong?: string;
      quanHuyen?: string;
      tinh_ThanhPho?: string;
    };
  };
  tinhTrang?: string;
  ketQua?: {
    succes?: boolean;
    nguyenVong?: string;
    phuongThucId?: string;
    diem?: number;
  };
  nguyenVong?: string[];
  diem?: number;
};

const StatisticsPage = () => {
  const [hoso, setHoSo] = useState<HoSo[]>([]);
  const [nganhDaoTao, setNganhDaoTao] = useState<NganhDaoTao[]>([]);
  const [nguyenVong, setNguyenVong] = useState<NguyenVong[]>([]);
  const [phuongThuc, setPhuongThuc] = useState<PhuongThuc[]>([]);
  const [toHop, setToHop] = useState<ToHop[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [candidatesByToHop, setCandidatesByToHop] = useState<{ [toHop: string]: number[] }>({});
  const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'major' | 'status'>('major');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resHoSo, resNganh, resNguyenVong, resPhuongThuc, resToHop] = await Promise.all([
          axios.get(`${API}/hoSo`),
          axios.get(`${API}/nganhDaoTao`),
          axios.get(`${API}/thongTinNguyenVong`),
          axios.get(`${API}/phuongThucXetTuyen`),
          axios.get(`${API}/toHop`),
        ]);

        const hoso: HoSo[] = resHoSo.data;
        const nganhDaoTao: NganhDaoTao[] = resNganh.data;
        const nguyenVong: NguyenVong[] = resNguyenVong.data;
        const phuongThuc: PhuongThuc[] = resPhuongThuc.data;
        const toHop: ToHop[] = resToHop.data;

        const admittedByMajor: { [key: string]: { count: number; candidates: HoSo[] } } = {};
        const wishesByMajor: { [key: string]: number } = {};
        const wishesByScore: { [key: string]: number } = {
          '0-15': 0,
          '15-20': 0,
          '20-25': 0,
          '25-30': 0,
        };
        const admissionMethods: { [key: string]: number } = {};
        const profileStats = { total: hoso.length, approved: 0, pending: 0 };
        const profileStatus: { [key: string]: { count: number; candidates: HoSo[] } } = {
          'đã duyệt': { count: 0, candidates: [] },
          'chờ duyệt': { count: 0, candidates: [] },
          'từ chối': { count: 0, candidates: [] },
        };

        // Initialize statistics for each major
        nganhDaoTao.forEach((nganh) => {
          admittedByMajor[nganh.ten] = { count: 0, candidates: [] };
          wishesByMajor[nganh.ten] = 0;
        });

        // Initialize admission methods
        phuongThuc.forEach((pt) => {
          admissionMethods[pt.ten] = 0;
        });

        // Process hoso data
        hoso.forEach((h) => {
          let status: string;
          if (h.tinhTrang === 'đã duyệt') status = 'đã duyệt';
          else if (h.tinhTrang === 'từ chối') status = 'từ chối';
          else status = 'chờ duyệt';
          profileStats[status === 'đã duyệt' ? 'approved' : 'pending'] += 1;
          profileStatus[status].count += 1;
          profileStatus[status].candidates.push(h);

          if (h.ketQua?.succes && h.ketQua.nguyenVong) {
            const nv = nguyenVong.find((n) => n.id === h.ketQua!.nguyenVong);
            if (nv) {
              const nganh = nganhDaoTao.find((n) => n.ma === nv.maNganh);
              if (nganh) {
                admittedByMajor[nganh.ten].count += 1;
                admittedByMajor[nganh.ten].candidates.push({
                  ...h,
                  diem: h.ketQua!.diem,
                });
              }
            }
            // Count admitted candidates by admission method
            if (h.ketQua.phuongThucId) {
              const pt = phuongThuc.find((p) => p.id === h.ketQua!.phuongThucId);
              if (pt) {
                admissionMethods[pt.ten] += 1;
              }
            }
          }

          h.nguyenVong?.forEach((nvId) => {
            const nv = nguyenVong.find((n) => n.id === nvId);
            if (nv) {
              const nganh = nganhDaoTao.find((n) => n.ma === nv.maNganh);
              if (nganh) wishesByMajor[nganh.ten] += 1;

              const score = nv.tongDiem || 0;
              if (score <= 15) wishesByScore['0-15'] += 1;
              else if (score <= 20) wishesByScore['15-20'] += 1;
              else if (score <= 25) wishesByScore['20-25'] += 1;
              else wishesByScore['25-30'] += 1;
            }
          });
        });

        // Process candidates by toHop across score ranges
        const scoreRanges = ['0-15', '15-20', '20-25', '25-30'];
        const candidatesByToHop: { [toHop: string]: number[] } = {};
        toHop.forEach((th) => {
          candidatesByToHop[th.id] = scoreRanges.map(() => 0);
        });

        nguyenVong.forEach((nv) => {
          const nganh = nganhDaoTao.find((n) => n.ma === nv.maNganh);
          if (nganh) {
            const toHopId = nganh.toHopXetTuyenId;
            const score = nv.tongDiem || 0;
            let rangeIndex;
            if (score <= 15) rangeIndex = 0;
            else if (score <= 20) rangeIndex = 1;
            else if (score <= 25) rangeIndex = 2;
            else rangeIndex = 3;
            candidatesByToHop[toHopId][rangeIndex] += 1;
          }
        });

        setHoSo(hoso);
        setNganhDaoTao(nganhDaoTao);
        setNguyenVong(nguyenVong);
        setPhuongThuc(phuongThuc);
        setToHop(toHop);
        setCandidatesByToHop(candidatesByToHop);
        setStats({ admittedByMajor, wishesByMajor, wishesByScore, admissionMethods, profileStats, profileStatus });
      } catch (err) {
        console.error('Error fetching data:', err);
        notification.error({
          message: 'Lỗi tải dữ liệu',
          description: 'Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showCandidateList = (major: string) => {
    setSelectedMajor(major);
    setModalType('major');
    setModalVisible(true);
  };

  const showStatusList = (status: string) => {
    setSelectedStatus(status);
    setModalType('status');
    setModalVisible(true);
  };

  const handleSelectChange = (value: string, type: 'major' | 'status') => {
    if (type === 'major' && value && stats.admittedByMajor[value]?.count > 0) {
      showCandidateList(value);
    } else if (type === 'status' && value && stats.profileStatus[value]?.count > 0) {
      showStatusList(value);
    }
  };

  const exportToExcel = (major: string) => {
    const candidates = stats.admittedByMajor[major]?.candidates || [];
    
    if (candidates.length === 0) {
      notification.warning({
        message: 'Không có dữ liệu',
        description: `Ngành ${major} chưa có thí sinh đậu.`,
      });
      return;
    }

    const exportData = candidates.map((candidate: HoSo, index: number) => ({
      'STT': index + 1,
      'Họ và tên': candidate.thongTinLienHe?.ten || 'N/A',
      'Điểm': candidate.diem?.toFixed(1) || 'N/A',
      'Địa chỉ cụ thể': candidate.thongTinLienHe?.diaChi?.diaChiCuThe || '',
      'Xã/Phường': candidate.thongTinLienHe?.diaChi?.xaPhuong || '',
      'Quận/Huyện': candidate.thongTinLienHe?.diaChi?.quanHuyen || '',
      'Tỉnh/Thành phố': candidate.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
      'Tình trạng': candidate.tinhTrang || 'N/A',
      'ID hồ sơ': candidate.id
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 25 }, { wch: 10 }, { wch: 30 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách thí sinh');
    
    const fileName = `Danh_sach_thi_sinh_dau_${major.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    notification.success({
      message: 'Xuất Excel thành công',
      description: `Đã xuất danh sách thí sinh đậu ngành ${major}.`,
    });
  };

  const exportStatusToExcel = (status: string) => {
    const candidates = stats.profileStatus[status]?.candidates || [];
    
    if (candidates.length === 0) {
      notification.warning({
        message: 'Không có dữ liệu',
        description: `Không có hồ sơ ở trạng thái ${status}.`,
      });
      return;
    }

    const exportData = candidates.map((candidate: HoSo, index: number) => ({
      'STT': index + 1,
      'Họ và tên': candidate.thongTinLienHe?.ten || 'N/A',
      'Điểm': (candidate.ketQua?.diem ?? candidate.diem)?.toFixed(1) || 'N/A',
      'Địa chỉ cụ thể': candidate.thongTinLienHe?.diaChi?.diaChiCuThe || '',
      'Xã/Phường': candidate.thongTinLienHe?.diaChi?.xaPhuong || '',
      'Quận/Huyện': candidate.thongTinLienHe?.diaChi?.quanHuyen || '',
      'Tỉnh/Thành phố': candidate.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
      'Tình trạng': candidate.tinhTrang || 'N/A',
      'ID hồ sơ': candidate.id
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 25 }, { wch: 10 }, { wch: 30 },
      { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách hồ sơ');
    
    const fileName = `Danh_sach_ho_so_${status.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    notification.success({
      message: 'Xuất Excel thành công',
      description: `Đã xuất danh sách hồ sơ ở trạng thái ${status}.`,
    });
  };

  const exportAllMajors = () => {
    const majorsWithStudents = Object.keys(stats.admittedByMajor).filter(
      major => stats.admittedByMajor[major].count > 0
    );

    if (majorsWithStudents.length === 0) {
      notification.warning({
        message: 'Không có dữ liệu',
        description: 'Chưa có thí sinh đậu ở bất kỳ ngành nào.',
      });
      return;
    }

    const workbook = XLSX.utils.book_new();

    majorsWithStudents.forEach(major => {
      const candidates = stats.admittedByMajor[major].candidates;
      const exportData = candidates.map((candidate, index) => ({
        'STT': index + 1,
        'Họ và tên': candidate.thongTinLienHe?.ten || 'N/A',
        'Điểm': candidate.diem?.toFixed(1) || 'N/A',
        'Địa chỉ cụ thể': candidate.thongTinLienHe?.diaChi?.diaChiCuThe || '',
        'Xã/Phường': candidate.thongTinLienHe?.diaChi?.xaPhuong || '',
        'Quận/Huyện': candidate.thongTinLienHe?.diaChi?.quanHuyen || '',
        'Tỉnh/Thành phố': candidate.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
        'Tình trạng': candidate.tinhTrang || 'N/A',
        'ID hồ sơ': candidate.id
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet['!cols'] = [
        { wch: 5 }, { wch: 25 }, { wch: 10 }, { wch: 30 },
        { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }
      ];

      const sheetName = major.length > 31 ? major.substring(0, 28) + '...' : major;
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    const fileName = `Danh_sach_thi_sinh_dau_tat_ca_nganh_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    
    notification.success({
      message: 'Xuất Excel thành công',
      description: `Đã xuất danh sách thí sinh đậu tất cả ${majorsWithStudents.length} ngành.`,
    });
  };

  const majorsWithStudents = Object.keys(stats?.admittedByMajor || {}).filter(
    major => stats.admittedByMajor[major].count > 0
  );

  const statusesWithProfiles = Object.keys(stats?.profileStatus || {}).filter(
    status => stats.profileStatus[status].count > 0
  );

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Họ tên',
      dataIndex: ['thongTinLienHe', 'ten'],
      key: 'ten',
      render: (text: string) => text || 'N/A',
    },
    {
      title: 'Điểm',
      key: 'diem',
      width: 80,
      render: (record: HoSo) => {
        const diem = record.ketQua?.diem ?? record.diem;
        return (
          <Tag color="blue" style={{ fontWeight: 'bold' }}>
            {typeof diem === 'number' ? diem.toFixed(1) : 'N/A'}
          </Tag>
        );
      },
      sorter: (a: HoSo, b: HoSo) => {
        const diemA = a.ketQua?.diem ?? a.diem ?? 0;
        const diemB = b.ketQua?.diem ?? b.diem ?? 0;
        return diemA - diemB;
      },
    },
    {
      title: 'Địa chỉ',
      key: 'diaChi',
      render: (record: HoSo) =>
        record.thongTinLienHe?.diaChi
          ? `${record.thongTinLienHe.diaChi.diaChiCuThe || ''}, ${record.thongTinLienHe.diaChi.xaPhuong || ''}, ${record.thongTinLienHe.diaChi.quanHuyen || ''}, ${record.thongTinLienHe.diaChi.tinh_ThanhPho || ''}`
          : 'N/A',
      ellipsis: true,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrang',
      key: 'tinhTrang',
      width: 120,
      render: (text: string) => (
        <Tag 
          color={
            text === 'đã duyệt'
              ? 'green'
              : text === 'từ chối'
              ? 'red'
              : 'orange'
          }
          icon={
            text === 'đã duyệt'
              ? <CheckCircleOutlined />
              : undefined
          }
        >
          {text || 'N/A'}
        </Tag>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        fontSize: '16px' 
      }}>
        🔄 Đang tải dữ liệu thống kê...
      </div>
    );
  }

  if (!stats) return null;

  const totalAdmitted = Object.values(stats.admittedByMajor).reduce((sum: number, item: any) => sum + item.count, 0);

  return (
    <div className="statistics-page" style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
      {/* Header Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng hồ sơ"
              value={stats.profileStats.total}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã duyệt"
              value={stats.profileStats.approved}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Thí sinh đậu"
              value={totalAdmitted}
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Số ngành"
              value={Object.keys(stats.admittedByMajor).length}
              prefix={<BookOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChartOutlined style={{ color: '#1890ff' }} />
            <span> Thống kê tuyển sinh chi tiết</span>
          </div>
        }
        style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
      >
        <Row gutter={[20, 20]}>
          <Col span={12}>
            <Card 
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🎓 Thí sinh đậu theo ngành</span>
                </div>
              }
              style={{ height: '100%', borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <ColumnChart
                xAxis={Object.keys(stats.admittedByMajor)}
                yAxis={[Object.values(stats.admittedByMajor).map((item: any) => item.count)]}
                yLabel={['Số lượng thí sinh']}
                colors={['#1890ff']}
                height={300}
              />
              
              <Divider style={{ margin: '16px 0' }} />
              
              <div>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '16px'
                }}>
                    <span style={{ 
                        fontWeight: 600,
                        color: '#262626',
                        minWidth: 'fit-content'
                    }}>
                        Xem danh sách:
                    </span>

                    {majorsWithStudents.length > 0 ? (
                        <>
                        <Select
                            placeholder="Chọn ngành để xem danh sách"
                            style={{ minWidth: 280, flex: 1 }}
                            onChange={(value) => handleSelectChange(value, 'major')}
                            allowClear
                            size="large"
                        >
                            {majorsWithStudents.map((major) => (
                            <Option key={major} value={major}>
                                <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                                }}>
                                <span style={{ fontWeight: 500 }}>{major}</span>
                                <Tag color="blue" style={{ margin: 0, fontWeight: 'bold' }}>
                                    {stats.admittedByMajor[major].count}
                                </Tag>
                                </div>
                            </Option>
                            ))}
                        </Select>

                        <Space wrap>
                            <Tooltip title="Xuất danh sách thí sinh">
                            <Button
                                type="primary"
                                icon={<FileExcelOutlined />}
                                onClick={exportAllMajors}
                                style={{ 
                                background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 500
                                }}
                            >
                                Xuất Excel
                            </Button>
                            </Tooltip>
                        </Space>
                        </>
                    ) : (
                        <span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
                        Chưa có thí sinh đậu
                        </span>
                    )}
                </div>
              </div>
            </Card>
          </Col>
          
          <Col span={12}>
            <Card 
              title="📈 Số lượng nguyện vọng theo ngành"
              style={{ height: '100%', borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <DonutChart
                xAxis={Object.keys(stats.wishesByMajor)}
                yAxis={[Object.values(stats.wishesByMajor)]}
                yLabel={['Số lượng nguyện vọng']}
                colors={['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#eb2f96']}
                showTotal
                height={300}
              />
            </Card>
          </Col>
          
          <Col span={12}>
            <Card 
              title="📊 Nguyện vọng theo khoảng điểm"
              style={{ borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <ColumnChart
                xAxis={Object.keys(stats.wishesByScore)}
                yAxis={[Object.values(stats.wishesByScore)]}
                yLabel={['Số lượng nguyện vọng']}
                colors={['#52c41a']}
                height={300}
              />
            </Card>
          </Col>
          
          <Col span={12}>
            <Card  
              title="🎯 Phương thức xét tuyển"
              style={{ borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <DonutChart
                xAxis={Object.keys(stats.admissionMethods)}
                yAxis={[Object.values(stats.admissionMethods)]}
                yLabel={['Số lượng thí sinh']}
                colors={['#1890ff', '#52c41a', '#faad14']}
                showTotal
                height={300}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card 
              title="📋 Trạng thái hồ sơ"
              style={{ borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <DonutChart
                xAxis={Object.keys(stats.profileStatus)}
                yAxis={[Object.values(stats.profileStatus).map((item: any) => item.count)]}
                yLabel={['Số lượng hồ sơ']}
                colors={['#52c41a', '#ff4d4f', '#faad14']}
                showTotal
                height={300}
              />
              
              <Divider style={{ margin: '16px 0' }} />
              
              <div>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    flexWrap: 'wrap',
                    marginBottom: '16px'
                }}>
                    <span style={{ 
                        fontWeight: 600,
                        color: '#262626',
                        minWidth: 'fit-content'
                    }}>
                        Xem danh sách:
                    </span>

                    {statusesWithProfiles.length > 0 ? (
                        <>
                        <Select
                            placeholder="Chọn trạng thái để xem danh sách"
                            style={{ minWidth: 280, flex: 1 }}
                            onChange={(value) => handleSelectChange(value, 'status')}
                            allowClear
                            size="large"
                        >
                            {statusesWithProfiles.map((status) => (
                            <Option key={status} value={status}>
                                <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center' 
                                }}>
                                <span style={{ fontWeight: 500 }}>{status}</span>
                                <Tag color="blue" style={{ margin: 0, fontWeight: 'bold' }}>
                                    {stats.profileStatus[status].count}
                                </Tag>
                                </div>
                            </Option>
                            ))}
                        </Select>

                        <Space wrap>
                            <Tooltip title="Xuất danh sách hồ sơ">
                            <Button
                                type="primary"
                                icon={<FileExcelOutlined />}
                                onClick={() => selectedStatus && exportStatusToExcel(selectedStatus)}
                                style={{ 
                                background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                                border: 'none',
                                borderRadius: '6px',
                                fontWeight: 500
                                }}
                                disabled={!selectedStatus}
                            >
                                Xuất Excel
                            </Button>
                            </Tooltip>
                        </Space>
                        </>
                    ) : (
                        <span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>
                        Chưa có hồ sơ
                        </span>
                    )}
                </div>
              </div>
            </Card>
          </Col>
          <Col span={12}>
            <Card
              title="📈 Số lượng thí sinh đăng ký theo tổ hợp xét tuyển qua khoảng điểm"
              style={{ borderRadius: '8px' }}
              bodyStyle={{ padding: '16px' }}
            >
              <LineChart
                xAxis={['0-15', '15-20', '20-25', '25-30']}
                yAxis={Object.keys(candidatesByToHop).map(toHopId => candidatesByToHop[toHopId])}
                yLabel={Object.keys(candidatesByToHop)}
                colors={['#1890ff', '#52c41a', '#faad14', '#ff4d4f']}
                height={300}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Modal
        visible={modalVisible}
        title={
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingRight: '40px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {modalType === 'major' ? (
                <>
                  <TrophyOutlined style={{ color: '#faad14', fontSize: '20px' }} />
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>
                    Danh sách thí sinh đậu ngành {selectedMajor}
                  </span>
                  {selectedMajor && (
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                      {stats.admittedByMajor[selectedMajor]?.count || 0} thí sinh
                    </Tag>
                  )}
                </>
              ) : (
                <>
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                  <span style={{ fontSize: '18px', fontWeight: 600 }}>
                    Danh sách hồ sơ trạng thái {selectedStatus}
                  </span>
                  {selectedStatus && (
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                      {stats.profileStatus[selectedStatus]?.count || 0} hồ sơ
                    </Tag>
                  )}
                </>
              )}
            </div>
          </div>
        }
        onCancel={() => setModalVisible(false)}
        footer={
          <Space>
            <Button onClick={() => setModalVisible(false)}>
              Đóng
            </Button>
            <Button
              type="primary"
              icon={<FileExcelOutlined />}
              onClick={() => {
                if (modalType === 'major' && selectedMajor) {
                  exportToExcel(selectedMajor);
                } else if (modalType === 'status' && selectedStatus) {
                  exportStatusToExcel(selectedStatus);
                }
              }}
              style={{ 
                background: 'linear-gradient(135deg, #52c41a, #73d13d)',
                border: 'none'
              }}
            >
              Xuất Excel
            </Button>
          </Space>
        }
        width={900}
        style={{ top: 20 }}
      >
        <Table
          dataSource={
            modalType === 'major' && selectedMajor
              ? stats.admittedByMajor[selectedMajor]?.candidates
              : modalType === 'status' && selectedStatus
              ? stats.profileStatus[selectedStatus]?.candidates
              : []
          }
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 8,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} của ${total} ${modalType === 'major' ? 'thí sinh' : 'hồ sơ'}`,
            pageSizeOptions: ['5', '8', '10', '20'],
          }}
          scroll={{ x: 700 }}
          size="middle"
          style={{ marginTop: '16px' }}
        />
      </Modal>
    </div>
  );
};

export default StatisticsPage;
import { EyeOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import moment from 'moment';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';

interface KetQuaXetTuyenProps {
  searchResults: any[];
  loading: boolean;
}

const KetQuaXetTuyen = ({ searchResults, loading }: KetQuaXetTuyenProps) => {
  // Mock lookup for tổ hợp from db.json
  const toHopData: Record<string, string> = {
    A00: 'Toán, Lý, Hóa',
    A01: 'Toán, Lý, Anh',
    D01: 'Toán, Văn, Anh',
    C00: 'Văn, Sử, Địa',
  };

  const columns: IColumn<any>[] = [
    {
      title: 'Họ và tên',
      width: 120,
      render: (val: any, rec: any) =>
        `${rec?.user?.ho || ''} ${rec?.user?.ten || ''}` || 'N/A',
    },
    {
      title: 'Ngày sinh',
      width: 150,
      render: (val: any, rec: any) =>
        rec?.user?.ngaySinh
          ? moment(rec.user.ngaySinh).format('DD/MM/YYYY')
          : 'N/A',
    },
    {
      title: 'Số CCCD',
      width: 160,
      render: (val: any, rec: any) => rec?.user?.soCCCD || 'N/A',
    },
    {
      title: 'Đối tượng ƯT',
      align: 'center',
      width: 100,
      render: (val: any, rec: any) =>
        rec?.thongTinHocTap?.thongTinTHPT?.doiTuongUT || 'N/A',
    },
    {
      title: 'Tổng điểm XT',
      width: 120,
      render: (val: any, rec: any) => rec?.hoSo?.ketQua?.diem || 'N/A',
    },
    {
      title: 'Tổ hợp',
      width: 120,
      render: (val: any, rec: any) => {
        const nguyenVong = rec?.nguyenVong?.[0];
        if (nguyenVong) {
          const maNganh = nguyenVong.maNganh;
          const nganhDaoTao = [
            { ma: 'CNTT01', toHopXetTuyenId: 'A00' },
            { ma: 'KTPM01', toHopXetTuyenId: 'A01' },
            { ma: 'QTKD01', toHopXetTuyenId: 'D01' },
          ].find((nganh) => nganh.ma === maNganh);

          return nganhDaoTao
            ? toHopData[nganhDaoTao.toHopXetTuyenId as keyof typeof toHopData]
            : 'N/A';
        }
        return 'N/A';
      },
    },
    {
      title: 'Kết quả xét tuyển',
      width: 120,
      render: (val: any, rec: any) => {
        const ketQua = rec?.hoSo?.ketQua;
        if (ketQua?.succes) {
          const nguyenVong = rec?.nguyenVong?.find(
            (nv: any) => nv.id === ketQua.nguyenVong,
          );
          return nguyenVong
            ? `Trúng tuyển: ${nguyenVong.ten}`
            : 'Trúng tuyển';
        }
        return 'Không trúng tuyển';
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (val: any, rec: any) =>
        rec?.hoSo?.id ? (
          <ButtonExtend
            tooltip="Chi tiết"
            type="link"
            icon={<EyeOutlined />}
            onClick={() =>
              window.open(`/tra-cuu-van-bang/chi-tiet/${rec.hoSo.id}`, '_blank')
            }
          />
        ) : (
          <span style={{ color: '#999' }}>(Chưa có thông tin)</span>
        ),
    },
  ];

  return (
    <Card
      title="Kết quả xét tuyển">
      {searchResults.length === 0 && !loading ? (
        <div style={{ margin: 'auto' }}>
          <i style={{ color: 'red' }}>Không tồn tại thông tin!</i>
        </div>
      ) : (
        <TableStaticData
          loading={loading}
          columns={columns}
          data={searchResults}
          hasTotal
          addStt
          otherProps={{
            scroll: { y: 380 },
            pagination: false,
          }}
        />
      )}
    </Card>
  );
};

export default KetQuaXetTuyen;
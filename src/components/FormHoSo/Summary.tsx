import React from 'react';
import { Card, Descriptions } from 'antd';
import moment from 'moment';
import PhuongThucXTSelect from '@/pages/PhuongThucXT/components/Select';

const SummaryForm = ({ userId, formData, showHocBa }) => {
	return (
		<div>
			<Card title='Xem lại thông tin hồ sơ' style={{ marginBottom: 16 }}>
				<Descriptions column={2} bordered>
					<Descriptions.Item label='Họ và tên'>
						{formData.ho} {formData.ten}
					</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh'>
						{formData.ngaySinh ? moment(formData.ngaySinh).format('DD/MM/YYYY') : ''}
					</Descriptions.Item>
					<Descriptions.Item label='Email'>{formData.email}</Descriptions.Item>
					<Descriptions.Item label='Số điện thoại'>{formData.soDT}</Descriptions.Item>
					<Descriptions.Item label='Số CCCD'>{formData.soCCCD}</Descriptions.Item>
					<Descriptions.Item label='Giới tính'>{formData.gioiTinh}</Descriptions.Item>
				</Descriptions>
			</Card>

			{formData.thongTinTHPT && (
				<Card title='Thông tin trường THPT' style={{ marginBottom: 16 }}>
					<Descriptions column={2}>
						<Descriptions.Item label='Mã trường'>{formData.thongTinTHPT.maTruong}</Descriptions.Item>
						<Descriptions.Item label='Tỉnh/Thành phố'>{formData.thongTinTHPT.tinh_ThanhPho}</Descriptions.Item>
						<Descriptions.Item label='Khu vực ưu tiên'>{formData.thongTinTHPT.khuVucUT}</Descriptions.Item>
						<Descriptions.Item label='Đối tượng ưu tiên'>
							{formData.thongTinTHPT.doiTuongUT || 'Không'}
						</Descriptions.Item>
					</Descriptions>
				</Card>
			)}

			{formData.diemTHPT && formData.diemTHPT.length > 0 && (
				<Card title='Điểm THPT đã nhập' style={{ marginBottom: 16 }}>
					{formData.diemTHPT.map((diem, index) => (
						<div key={index} style={{ marginBottom: 8 }}>
							<strong>{diem.mon}</strong>: {diem.diem} điểm
						</div>
					))}
				</Card>
			)}

			{showHocBa && formData.diemMonHoc && formData.diemMonHoc.length > 0 && (
				<Card title='Điểm học bạ đã nhập' style={{ marginBottom: 16 }}>
					{formData.diemMonHoc.map((diem, index) => (
						<div key={index} style={{ marginBottom: 8 }}>
							<strong>{diem.mon}</strong> - {diem.hocKy}: {diem.diemTongKet} điểm
						</div>
					))}
				</Card>
			)}

			{formData.chungChi && formData.chungChi.length > 0 && (
				<Card title='Chứng chỉ đã nhập' style={{ marginBottom: 16 }}>
					{formData.chungChi.map((cc, index) => (
						<div key={index} style={{ marginBottom: 8 }}>
							<strong>{cc.loaiCC}</strong>: {cc.ketQua}
							{cc.minhChung && ` - Minh chứng: ${cc.minhChung}`}
						</div>
					))}
				</Card>
			)}

			{formData.nguyenVong && formData.nguyenVong.length > 0 && (
				<Card title='Nguyện vọng đã chọn' style={{ marginBottom: 16 }}>
					{formData.nguyenVong.map((nv, index) => (
						<Card key={index} type='inner' title={`Nguyện vọng ${index + 1}`} style={{ marginBottom: 8 }}>
							<Descriptions column={1} size='small'>
								<Descriptions.Item label='Ngành đào tạo'>{nv.ten}</Descriptions.Item>
								<Descriptions.Item label='Phương thức xét tuyển'>{nv.phuongThucId}</Descriptions.Item>
								<Descriptions.Item label='Điểm chưa ưu tiên'>{nv.diemChuaUT}</Descriptions.Item>
								<Descriptions.Item label='Điểm có ưu tiên'>{nv.diemCoUT}</Descriptions.Item>
								<Descriptions.Item label='Tổng điểm'>{nv.tongDiem}</Descriptions.Item>
								<Descriptions.Item label='Cơ sở đào tạo'>{nv.coSoDaoTao}</Descriptions.Item>
								{nv.ghiChu && <Descriptions.Item label='Ghi chú'>{nv.ghiChu}</Descriptions.Item>}
							</Descriptions>
						</Card>
					))}
				</Card>
			)}

			<Card title='Xác nhận nộp hồ sơ'>
				<p>
					Tôi xác nhận rằng tất cả thông tin đã cung cấp là chính xác và cam kết chịu trách nhiệm về tính xác thực của
					hồ sơ.
				</p>
				<p style={{ marginTop: 16, fontSize: '14px', color: '#666' }}>
					<strong>Lưu ý:</strong> Sau khi nộp hồ sơ, bạn sẽ không thể chỉnh sửa thông tin. Vui lòng kiểm tra kỹ trước
					khi nộp.
				</p>
			</Card>
		</div>
	);
};

export default SummaryForm;

import React from 'react';
import { Card, Descriptions, Divider, Image } from 'antd';
import moment from 'moment';
import { ipLocal } from '@/utils/ip';

interface SummaryFormProps {
	userId: string;
	formData: any;
	showHocBa: boolean;
	apiData: any;
}

const SummaryForm: React.FC<SummaryFormProps> = ({ userId, formData, showHocBa, apiData }) => {
	// Extract relevant data from formData and apiData
	const personalInfo = formData.personalInfo || {};
	const educationGrades = formData.educationGrades || {};
	const hocBa = formData.hocBa || {};
	const wishes = formData.wishes || [];
	const hoSo = apiData.hoSo || {};
	const thongTinBoSung = hoSo.thongTinBoSung || {};
	const thongTinLienHe = hoSo.thongTinLienHe || {};
	const thongTinHocTap = educationGrades || apiData.thongTinHocTap || {};
	const thongTinTHPT = formData.educationGrades?.thongTinTHPT || apiData.thongTinHocTap?.thongTinTHPT || {};
	const diemTHPT = thongTinHocTap.diemTHPT || [];
	const diemDGTD = thongTinHocTap.diemDGTD || {};
	const diemDGNL = thongTinHocTap.diemDGNL || {};
	const giaiHSG = thongTinHocTap.giaiHSG || {};
	const chungChi = thongTinHocTap.chungChi || [];
	const nguyenVong = wishes.length > 0 ? wishes : apiData.thongTinNguyenVong || [];

	return (
		<div>
			{/* Personal Information */}
			<Card title='Thông tin cá nhân' style={{ marginBottom: 16 }}>
				<Descriptions column={2} bordered>
					<Descriptions.Item label='Ảnh'>
						<div className='flex-shrink-0'>
							<Image
								width={150}
								height={150}
								src={`${ipLocal}${apiData.user.avatar}`}
								alt='Avatar'
								className='rounded-lg object-cover'
								fallback='https://via.placeholder.com/150?text=Avatar'
							/>
						</div>
					</Descriptions.Item>
					<Descriptions.Item label='Họ và tên'>
						{personalInfo.ho || ''} {personalInfo.ten || ''}
					</Descriptions.Item>
					<Descriptions.Item label='Ngày sinh'>
						{personalInfo.ngaySinh ? moment(personalInfo.ngaySinh).format('DD/MM/YYYY') : 'Chưa cung cấp'}
					</Descriptions.Item>
					<Descriptions.Item label='Email'>{personalInfo.email || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Số điện thoại'>{personalInfo.soDT || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Số CCCD'>{personalInfo.soCCCD || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Giới tính'>{personalInfo.gioiTinh || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Ngày cấp CCCD'>
						{personalInfo.ngayCap ? moment(personalInfo.ngayCap).format('DD/MM/YYYY') : 'Chưa cung cấp'}
					</Descriptions.Item>
					<Descriptions.Item label='Nơi cấp CCCD'>{personalInfo.noiCap || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Hộ khẩu thường trú'>
						{personalInfo.hoKhauThuongTru?.diaChi || ''}, {personalInfo.hoKhauThuongTru?.xaPhuong || ''},{' '}
						{personalInfo.hoKhauThuongTru?.quanHuyen || ''}, {personalInfo.hoKhauThuongTru?.tinh_ThanhPho || ''}
					</Descriptions.Item>
					<Descriptions.Item label='Thông tin liên hệ'>
						{thongTinLienHe.diaChi?.diaChiCuThe || ''}, {thongTinLienHe.diaChi?.xaPhuong || ''},{' '}
						{thongTinLienHe.diaChi?.quanHuyen || ''}, {thongTinLienHe.diaChi?.tinh_ThanhPho || ''}
					</Descriptions.Item>
					<Descriptions.Item label='Dân tộc'>{thongTinBoSung.danToc || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Quốc tịch'>{thongTinBoSung.quocTich || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Tôn giáo'>{thongTinBoSung.tonGiao || 'Chưa cung cấp'}</Descriptions.Item>
					<Descriptions.Item label='Nơi sinh'>
						{thongTinBoSung.noiSinh?.trongNuoc
							? `${thongTinBoSung.noiSinh?.xaPhuong || ''}, ${thongTinBoSung.noiSinh?.quanHuyen || ''}, ${
									thongTinBoSung.noiSinh?.tinh_ThanhPho || ''
							  }`
							: thongTinBoSung.noiSinh?.quocGia || 'Chưa cung cấp'}
					</Descriptions.Item>
				</Descriptions>
			</Card>

			{/* High School Information */}
			{thongTinTHPT && Object.keys(thongTinTHPT).length > 0 && (
				<Card title='Thông tin trường THPT' style={{ marginBottom: 16 }}>
					<Descriptions column={2} bordered>
						<Descriptions.Item label='Tên trường'>{thongTinTHPT.ten || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Mã trường'>{thongTinTHPT.maTruong || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Tỉnh/Thành phố'>
							{thongTinTHPT.tinh_ThanhPho || 'Chưa cung cấp'}
						</Descriptions.Item>
						<Descriptions.Item label='Quận/Huyện'>{thongTinTHPT.quanHuyen || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Xã/Phường'>{thongTinTHPT.xaPhuong || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Địa chỉ'>{thongTinTHPT.diaChi || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Khu vực ưu tiên'>{thongTinTHPT.khuVucUT || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Đối tượng ưu tiên'>
							{thongTinTHPT.doiTuongUT || 'Chưa cung cấp'}
						</Descriptions.Item>
						<Descriptions.Item label='Đã tốt nghiệp'>{thongTinTHPT.daTotNghiep ? 'Có' : 'Không'}</Descriptions.Item>
						<Descriptions.Item label='Năm tốt nghiệp'>{thongTinTHPT.namTotNghiep || 'Chưa cung cấp'}</Descriptions.Item>
					</Descriptions>
				</Card>
			)}

			{/* THPT Scores */}
			<Card title='Điểm THPT đã nhập' style={{ marginBottom: 16 }}>
				{diemTHPT.length > 0 ? (
					<Descriptions column={1} bordered>
						{diemTHPT.map((diem: any, index: number) => (
							<Descriptions.Item key={index} label={diem.mon}>
								{diem.diem} điểm
							</Descriptions.Item>
						))}
					</Descriptions>
				) : (
					<p>Chưa nhập điểm THPT.</p>
				)}
			</Card>

			{/* Academic Transcript (Học bạ) */}
			{showHocBa && (
				<Card title='Điểm học bạ đã nhập' style={{ marginBottom: 16 }}>
					{hocBa.diemMonHoc && hocBa.diemMonHoc.length > 0 ? (
						<Descriptions column={1} bordered>
							{hocBa.diemMonHoc.map((diem: any, index: number) => (
								<Descriptions.Item key={index} label={`${diem.mon} - ${diem.hocKy}`}>
									{diem.diemTongKet} điểm
								</Descriptions.Item>
							))}
							<Descriptions.Item label='Loại hạnh kiểm'>{hocBa.loaiHanhKiem || 'Chưa cung cấp'}</Descriptions.Item>
							<Descriptions.Item label='Minh chứng'>{hocBa.minhChung || 'Không bắt buộc'}</Descriptions.Item>
						</Descriptions>
					) : (
						<p>Chưa nhập điểm học bạ.</p>
					)}
				</Card>
			)}

			{/* DGTD Scores */}
			<Card title='Điểm đánh giá tư duy (DGTD)' style={{ marginBottom: 16 }}>
				{diemDGTD.mon && diemDGTD.mon.length > 0 ? (
					<Descriptions column={1} bordered>
						{diemDGTD.mon.map((mon: any, index: number) => (
							<Descriptions.Item key={index} label={mon.ten}>
								{mon.diem} điểm
							</Descriptions.Item>
						))}
						<Descriptions.Item label='Tổng điểm'>{diemDGTD.tongDiem || 0}</Descriptions.Item>
						<Descriptions.Item label='Minh chứng'>{diemDGTD.minhChung || 'Không bắt buộc'}</Descriptions.Item>
					</Descriptions>
				) : (
					<p>Chưa nhập điểm DGTD.</p>
				)}
			</Card>

			{/* DGNL Scores */}
			<Card title='Điểm đánh giá năng lực (DGNL)' style={{ marginBottom: 16 }}>
				{diemDGNL.mon && diemDGNL.mon.length > 0 ? (
					<Descriptions column={1} bordered>
						{diemDGNL.mon.map((mon: any, index: number) => (
							<Descriptions.Item key={index} label={mon.ten}>
								{mon.diem} điểm
							</Descriptions.Item>
						))}
						<Descriptions.Item label='Tổng điểm'>{diemDGNL.tongDiem || 0}</Descriptions.Item>
						<Descriptions.Item label='Minh chứng'>{diemDGNL.minhChung || 'Không bắt buộc'}</Descriptions.Item>
					</Descriptions>
				) : (
					<p>Chưa nhập điểm DGNL.</p>
				)}
			</Card>

			{/* Academic Awards (Giải HSG) */}
			<Card title='Giải học sinh giỏi' style={{ marginBottom: 16 }}>
				{giaiHSG.giaiHsgCap ? (
					<Descriptions column={1} bordered>
						<Descriptions.Item label='Cấp giải'>{giaiHSG.giaiHsgCap || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Môn'>{giaiHSG.mon || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Loại giải'>{giaiHSG.loaiGiai || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Năm'>{giaiHSG.nam || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Nơi cấp'>{giaiHSG.noiCap || 'Chưa cung cấp'}</Descriptions.Item>
						<Descriptions.Item label='Minh chứng'>{giaiHSG.minhChung || 'Không bắt buộc'}</Descriptions.Item>
					</Descriptions>
				) : (
					<p>Chưa nhập thông tin giải học sinh giỏi.</p>
				)}
			</Card>

			{/* Certificates (Chứng chỉ) */}
			<Card title='Chứng chỉ đã nhập' style={{ marginBottom: 16 }}>
				{chungChi.length > 0 ? (
					<Descriptions column={1} bordered>
						{chungChi.map((cc: any, index: number) => (
							<Descriptions.Item key={index} label={cc.loaiCC}>
								{cc.ketQua} {cc.minhChung && `(Minh chứng: ${cc.minhChung})`}
							</Descriptions.Item>
						))}
					</Descriptions>
				) : (
					<p>Chưa nhập chứng chỉ.</p>
				)}
			</Card>

			{/* Admission Preferences (Nguyện vọng) */}
			<Card title='Nguyện vọng đã chọn' style={{ marginBottom: 16 }}>
				{nguyenVong.length > 0 ? (
					nguyenVong.map((nv: any, index: number) => (
						<Card key={index} type='inner' title={`Nguyện vọng ${index + 1}`} style={{ marginBottom: 8 }}>
							<Descriptions column={1} size='small' bordered>
								<Descriptions.Item label='Ngành đào tạo'>{nv.ten || 'Chưa cung cấp'}</Descriptions.Item>
								<Descriptions.Item label='Phương thức xét tuyển'>
									{apiData.phuongThucXetTuyen.find((pt: any) => pt.id === nv.phuongThucId)?.ten || nv.phuongThucId}
								</Descriptions.Item>
								<Descriptions.Item label='Điểm chưa ưu tiên'>{nv.diemChuaUT || 0}</Descriptions.Item>
								<Descriptions.Item label='Điểm có ưu tiên'>{nv.diemCoUT || 0}</Descriptions.Item>
								<Descriptions.Item label='Điểm ưu tiên đối tượng'>{nv.diemDoiTuongUT || 0}</Descriptions.Item>
								<Descriptions.Item label='Điểm ưu tiên khu vực'>{nv.diemKhuVucUT || 0}</Descriptions.Item>
								<Descriptions.Item label='Tổng điểm'>{nv.tongDiem || 0}</Descriptions.Item>
								<Descriptions.Item label='Cơ sở đào tạo'>{nv.coSoDaoTao || 'Chưa cung cấp'}</Descriptions.Item>
								{nv.ghiChu && <Descriptions.Item label='Ghi chú'>{nv.ghiChu}</Descriptions.Item>}
							</Descriptions>
						</Card>
					))
				) : (
					<p>Chưa nhập nguyện vọng.</p>
				)}
			</Card>

			{/* Application Status */}
			{hoSo.tinhTrang && (
				<Card title='Tình trạng hồ sơ' style={{ marginBottom: 16 }}>
					<Descriptions column={1} bordered>
						<Descriptions.Item label='Tình trạng'>{hoSo.tinhTrang || 'Chưa nộp'}</Descriptions.Item>
						{hoSo.ketQua && (
							<>
								<Descriptions.Item label='Kết quả'>
									{hoSo.ketQua.success || hoSo.ketQua.succes ? 'Đạt' : 'Không đạt'}
								</Descriptions.Item>
								{hoSo.ketQua.nguyenVong && (
									<Descriptions.Item label='Nguyện vọng trúng tuyển'>
										{nguyenVong.find((nv: any) => nv.id === hoSo.ketQua.nguyenVong)?.ten || hoSo.ketQua.nguyenVong}
									</Descriptions.Item>
								)}
								{hoSo.ketQua.nguyenVongDo && (
									<Descriptions.Item label='Nguyện vọng trúng tuyển'>
										{nguyenVong.find((nv: any) => nv.id === hoSo.ketQua.nguyenVongDo)?.ten || hoSo.ketQua.nguyenVongDo}
									</Descriptions.Item>
								)}
								<Descriptions.Item label='Điểm trúng tuyển'>{hoSo.ketQua.diem || 'Không có'}</Descriptions.Item>
								<Descriptions.Item label='Phương thức xét tuyển'>
									{apiData.phuongThucXetTuyen.find((pt: any) => pt.id === hoSo.ketQua.phuongThucId)?.ten ||
										hoSo.ketQua.phuongThucId}
								</Descriptions.Item>
							</>
						)}
					</Descriptions>
				</Card>
			)}

			{/* Confirmation */}
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

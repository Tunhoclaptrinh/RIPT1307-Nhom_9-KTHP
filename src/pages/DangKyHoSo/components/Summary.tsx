import React from 'react';
import { Card, Typography, Button, Descriptions, Space } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface SummaryProps {
	userId: string;
	formData: any;
	showHocBa: boolean;
	apiData: any;
	onSubmit: () => void;
	onPrev: () => void;
}

const Summary: React.FC<SummaryProps> = ({ userId, formData, showHocBa, apiData, onSubmit, onPrev }) => {
	const personalInfo = formData.personalInfo || {};
	const educationGrades = formData.educationGrades || {};
	const wishes = formData.wishes || [];
	const hoSoInfo = formData.hoSoInfo || {};

	return (
		<Card title='Tóm tắt hồ sơ'>
			<Descriptions title='Thông tin cá nhân' bordered column={1}>
				<Descriptions.Item label='Họ và tên'>{`${personalInfo.ho || ''} ${personalInfo.ten || ''}`}</Descriptions.Item>
				<Descriptions.Item label='Số CCCD'>{personalInfo.soCCCD || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Email'>{personalInfo.email || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Số điện thoại'>{personalInfo.soDT || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Giới tính'>{personalInfo.gioiTinh || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Ngày sinh'>{personalInfo.ngaySinh || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Hộ khẩu thường trú'>{`
          ${personalInfo.hoKhauThuongTru?.tinh_ThanhPho || ''},
          ${personalInfo.hoKhauThuongTru?.quanHuyen || ''},
          ${personalInfo.hoKhauThuongTru?.xaPhuong || ''},
          ${personalInfo.hoKhauThuongTru?.diaChi || ''}
        `}</Descriptions.Item>
				<Descriptions.Item label='Dân tộc'>{hoSoInfo.thongTinBoSung?.danToc || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Quốc tịch'>{hoSoInfo.thongTinBoSung?.quocTich || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Tôn giáo'>{hoSoInfo.thongTinBoSung?.tonGiao || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Nơi sinh'>{`
          ${
						hoSoInfo.thongTinBoSung?.noiSinh?.trongNuoc
							? hoSoInfo.thongTinBoSung.noiSinh.tinh_ThanhPho
							: hoSoInfo.thongTinBoSung.noiSinh.quocGia || 'Chưa cập nhật'
					}
        `}</Descriptions.Item>
				<Descriptions.Item label='Người liên hệ'>{hoSoInfo.thongTinLienHe?.ten || 'Chưa cập nhật'}</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ liên hệ'>{`
          ${hoSoInfo.thongTinLienHe?.diaChi?.tinh_ThanhPho || ''},
          ${hoSoInfo.thongTinLienHe?.diaChi?.quanHuyen || ''},
          ${hoSoInfo.thongTinLienHe?.diaChi?.xaPhuong || ''},
          ${hoSoInfo.thongTinLienHe?.diaChi?.diaChiCuThe || ''}
        `}</Descriptions.Item>
			</Descriptions>

			<Descriptions title='Thông tin học tập' bordered column={1}>
				<Descriptions.Item label='Tên trường THPT'>
					{educationGrades.thongTinTHPT?.ten || 'Chưa cập nhật'}
				</Descriptions.Item>
				<Descriptions.Item label='Mã trường'>
					{educationGrades.thongTinTHPT?.maTruong || 'Chưa cập nhật'}
				</Descriptions.Item>
				<Descriptions.Item label='Địa chỉ trường'>{`
          ${educationGrades.thongTinTHPT?.tinh_ThanhPho || ''},
          ${educationGrades.thongTinTHPT?.quanHuyen || ''},
          ${educationGrades.thongTinTHPT?.xaPhuong || ''},
          ${educationGrades.thongTinTHPT?.diaChi || ''}
        `}</Descriptions.Item>
				<Descriptions.Item label='Năm tốt nghiệp'>
					{educationGrades.thongTinTHPT?.namTotNghiep || 'Chưa cập nhật'}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm học bạ'>
					{educationGrades.diemHocBa?.length > 0
						? educationGrades.diemHocBa.map((item: any, index: number) => (
								<div key={index}>{`${item.monHoc || ''}: ${item.diem || ''} (${item.hocKy || ''})`}</div>
						  ))
						: 'Chưa cập nhật'}
				</Descriptions.Item>
				<Descriptions.Item label='Điểm DGNL/DGTD'>
					{educationGrades.diemDGNL_DGTD?.length > 0
						? educationGrades.diemDGNL_DGTD.map((item: any, index: number) => (
								<div key={index}>{`${item.loaiDiem || ''}: ${item.diem || ''}`}</div>
						  ))
						: 'Chưa cập nhật'}
				</Descriptions.Item>
				<Descriptions.Item label='Giải học sinh giỏi'>
					{educationGrades.giaiHSG?.length > 0
						? educationGrades.giaiHSG.map((item: any, index: number) => (
								<div key={index}>{`${item.tenGiai || ''} (${item.capDo || ''}, ${item.nam || ''})`}</div>
						  ))
						: 'Chưa cập nhật'}
				</Descriptions.Item>
				<Descriptions.Item label='Chứng chỉ'>
					{educationGrades.chungChi?.length > 0
						? educationGrades.chungChi.map((item: any, index: number) => (
								<div key={index}>{`${item.tenChungChi || ''}: ${item.diem || ''}`}</div>
						  ))
						: 'Chưa cập nhật'}
				</Descriptions.Item>
			</Descriptions>

			<Descriptions title='Nguyện vọng' bordered column={1}>
				{wishes.length > 0 ? (
					wishes.map((wish: any, index: number) => (
						<Descriptions.Item key={index} label={`Nguyện vọng ${index + 1}`}>
							{`
                  Phương thức: ${
										apiData.phuongThucXetTuyen.find((pt: any) => pt.id === wish.phuongThucXetTuyenId)?.name || ''
									},
                  Ngành: ${apiData.nganhDaoTao.find((ng: any) => ng.id === wish.nganhDaoTaoId)?.tenNganh || ''},
                  Tổ hợp: ${apiData.toHop.find((th: any) => th.id === wish.toHopId)?.tenToHop || ''}
                `}
						</Descriptions.Item>
					))
				) : (
					<Descriptions.Item label='Nguyện vọng'>Chưa cập nhật</Descriptions.Item>
				)}
			</Descriptions>

			{showHocBa && (
				<Descriptions title='Học bạ' bordered column={1}>
					<Descriptions.Item label='Điểm học bạ'>
						{formData.hocBa?.diemHocBa?.length > 0
							? formData.hocBa.diemHocBa.map((item: any, index: number) => (
									<div key={index}>{`${item.monHoc || ''}: ${item.diem || ''} (${item.hocKy || ''})`}</div>
							  ))
							: 'Chưa cập nhật'}
					</Descriptions.Item>
				</Descriptions>
			)}

			<div style={{ textAlign: 'center', marginTop: '32px' }}>
				<Space size='middle'>
					<Button size='large' onClick={onPrev} style={{ minWidth: '100px' }}>
						Quay lại
					</Button>
					<Button
						type='primary'
						size='large'
						icon={<CheckCircleOutlined />}
						onClick={onSubmit}
						style={{ minWidth: '150px' }}
					>
						Nộp hồ sơ
					</Button>
				</Space>
			</div>
		</Card>
	);
};

export default Summary;

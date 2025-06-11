import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Select, Tooltip, Divider, Statistic, notification, Space, Tag } from 'antd';
import {
	BarChartOutlined,
	FileExcelOutlined,
	UserOutlined,
	TrophyOutlined,
	BookOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import * as XLSX from 'xlsx';
import ColumnChart from '../../components/Chart/ColumnChart';
import DonutChart from '../../components/Chart/DonutChart';
import AdmissionMethodChart from './components/AdmissionMethodChart';
import CandidateModal from './components/CandidateModal';
import CandidatesByToHopChart from './components/CandidatesByToHopChart';
import ProfileStatusChart from './components/ProfileStatusChart';
import WishesByScoreChart from './components/WishesByScoreChart';
import { ipLocal } from '@/utils/ip';
import { formatNguyenVong, formatThiSinh } from '@/utils/utils';

const { Option } = Select;

type ModalType = 'major' | 'status';
type ChartMode = 'wishes' | 'admitted';

// Type guards
const isValidHoSo = (item: any): item is ThongKe.HoSo => {
	return item && typeof item.id === 'string';
};

const isValidNganhDaoTao = (item: any): item is ThongKe.NganhDaoTao => {
	return (
		item && typeof item.ma === 'string' && typeof item.ten === 'string' && typeof item.toHopXetTuyenId === 'string'
	);
};

const isValidNguyenVong = (item: any): item is ThongKe.NguyenVong => {
	return (
		item && typeof item.id === 'string' && typeof item.maNganh === 'string' && typeof item.phuongThucId === 'string'
	);
};

const isValidPhuongThuc = (item: any): item is ThongKe.PhuongThuc => {
	return item && typeof item.id === 'string' && typeof item.ten === 'string';
};

const isValidToHop = (item: any): item is ThongKe.ToHop => {
	return item && typeof item.id === 'string' && Array.isArray(item.monHoc);
};

const StatisticsPage: React.FC = () => {
	const [hoso, setHoSo] = useState<ThongKe.HoSo[]>([]);
	const [nganhDaoTao, setNganhDaoTao] = useState<ThongKe.NganhDaoTao[]>([]);
	const [nguyenVong, setNguyenVong] = useState<ThongKe.NguyenVong[]>([]);
	const [phuongThuc, setPhuongThuc] = useState<ThongKe.PhuongThuc[]>([]);
	const [toHop, setToHop] = useState<ThongKe.ToHop[]>([]);
	const [stats, setStats] = useState<ThongKe.Stats | null>(null);
	const [candidatesByToHop, setCandidatesByToHop] = useState<Record<string, number>>({});
	const [selectedMajor, setSelectedMajor] = useState<string | null>(null);
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const [modalType, setModalType] = useState<ModalType>('major');
	const [loading, setLoading] = useState<boolean>(true);
	const [chartMode, setChartMode] = useState<ChartMode>('wishes');

	useEffect(() => {
		const fetchData = async (): Promise<void> => {
			try {
				setLoading(true);
				const [resHoSo, resNganh, resNguyenVong, resPhuongThuc, resToHop] = await Promise.all([
					axios.get(`${ipLocal}/hoSo`),
					axios.get(`${ipLocal}/nganhDaoTao`),
					axios.get(`${ipLocal}/thongTinNguyenVong`),
					axios.get(`${ipLocal}/phuongThucXetTuyen`),
					axios.get(`${ipLocal}/toHop`),
				]);

				// Validate data with type guards
				const hosoData: ThongKe.HoSo[] = Array.isArray(resHoSo.data) ? resHoSo.data.filter(isValidHoSo) : [];
				const nganhDaoTaoData: ThongKe.NganhDaoTao[] = Array.isArray(resNganh.data)
					? resNganh.data.filter(isValidNganhDaoTao)
					: [];
				const nguyenVongData: ThongKe.NguyenVong[] = Array.isArray(resNguyenVong.data)
					? resNguyenVong.data.filter(isValidNguyenVong)
					: [];
				const phuongThucData: ThongKe.PhuongThuc[] = Array.isArray(resPhuongThuc.data)
					? resPhuongThuc.data.filter(isValidPhuongThuc)
					: [];
				const toHopData: ThongKe.ToHop[] = Array.isArray(resToHop.data) ? resToHop.data.filter(isValidToHop) : [];

				if (
					!hosoData.length ||
					!nganhDaoTaoData.length ||
					!nguyenVongData.length ||
					!phuongThucData.length ||
					!toHopData.length
				) {
					notification.error({
						message: 'Dữ liệu không đầy đủ',
						description: 'Một hoặc nhiều API trả về dữ liệu rỗng. Vui lòng kiểm tra JSON-server.',
					});
					setLoading(false);
					return;
				}

				const admittedByMajor: Record<string, ThongKe.MajorStats> = {};
				const wishesByMajor: Record<string, number> = {};
				const wishesByScore: Record<string, number> = {
					'0-15': 0,
					'15-20': 0,
					'20-25': 0,
					'25-30': 0,
				};
				const wishesByAdmissionMethod: Record<string, number> = {};
				const admittedByAdmissionMethod: Record<string, number> = {};
				const profileStats = { total: hosoData.length, approved: 0, pending: 0 };
				const profileStatus: Record<string, ThongKe.StatusStats> = {
					'đã duyệt': { count: 0, candidates: [] },
					'chờ duyệt': { count: 0, candidates: [] },
					'từ chối': { count: 0, candidates: [] },
				};

				// Initialize data structures
				nganhDaoTaoData.forEach((nganh) => {
					admittedByMajor[nganh.ten] = { count: 0, candidates: [] };
					wishesByMajor[nganh.ten] = 0;
				});

				phuongThucData.forEach((pt) => {
					wishesByAdmissionMethod[pt.ten] = 0;
					admittedByAdmissionMethod[pt.ten] = 0;
				});

				const candidatesByToHopData: Record<string, number> = {};
				toHopData.forEach((th) => {
					candidatesByToHopData[th.id] = 0;
				});

				// Process data
				hosoData.forEach((h) => {
					// Determine status with type safety
					let status: string;
					if (h.tinhTrang === 'đã duyệt') status = 'đã duyệt';
					else if (h.tinhTrang === 'từ chối') status = 'từ chối';
					else status = 'chờ duyệt';

					// Update profile stats
					if (status === 'đã duyệt') {
						profileStats.approved += 1;
					} else {
						profileStats.pending += 1;
					}

					// Ensure status exists in profileStatus
					if (!profileStatus[status]) {
						profileStatus[status] = { count: 0, candidates: [] };
					}
					profileStatus[status].count += 1;
					profileStatus[status].candidates.push(h);

					// Process admitted candidates - FIX: Check if ketQua exists
					if (h.ketQua?.succes && h.ketQua.nguyenVongDo) {
						const nv = nguyenVongData.find((n) => n.id === h.ketQua!.nguyenVongDo);
						if (nv) {
							const nganh = nganhDaoTaoData.find((n) => n.ma === nv.maNganh);
							if (nganh && admittedByMajor[nganh.ten]) {
								admittedByMajor[nganh.ten].count += 1;
								admittedByMajor[nganh.ten].candidates.push({
									...h,
									diem: h.ketQua?.diem, // FIX: Use optional chaining
								});
							}

							// Process admission method - FIX: Check if ketQua and phuongThucId exist
							if (h.ketQua?.phuongThucId) {
								const pt = phuongThucData.find((p) => p.id === h.ketQua!.phuongThucId!);
								if (pt) {
									admittedByAdmissionMethod[pt.ten] = (admittedByAdmissionMethod[pt.ten] || 0) + 1;
								}
							}
						}
					}

					// Process wishes
					if (h.nguyenVong && Array.isArray(h.nguyenVong)) {
						h.nguyenVong.forEach((nvId) => {
							const nv = nguyenVongData.find((n) => n.id === nvId);
							if (nv) {
								const nganh = nganhDaoTaoData.find((n) => n.ma === nv.maNganh);
								if (nganh) {
									wishesByMajor[nganh.ten] = (wishesByMajor[nganh.ten] || 0) + 1;
									candidatesByToHopData[nganh.toHopXetTuyenId] =
										(candidatesByToHopData[nganh.toHopXetTuyenId] || 0) + 1;
								}

								// Process score ranges
								const score = nv.tongDiem || 0;
								if (score <= 15) wishesByScore['0-15'] += 1;
								else if (score <= 20) wishesByScore['15-20'] += 1;
								else if (score <= 25) wishesByScore['20-25'] += 1;
								else wishesByScore['25-30'] += 1;

								// Process admission method for wishes
								const pt = phuongThucData.find((p) => p.id === nv.phuongThucId);
								if (pt) {
									wishesByAdmissionMethod[pt.ten] = (wishesByAdmissionMethod[pt.ten] || 0) + 1;
								}
							}
						});
					}
				});

				setHoSo(hosoData);
				setNganhDaoTao(nganhDaoTaoData);
				setNguyenVong(nguyenVongData);
				setPhuongThuc(phuongThucData);
				setToHop(toHopData);
				setCandidatesByToHop(candidatesByToHopData);
				setStats({
					admittedByMajor,
					wishesByMajor,
					wishesByScore,
					wishesByAdmissionMethod,
					admittedByAdmissionMethod,
					profileStats,
					profileStatus,
				});
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

	const showCandidateList = (major: string): void => {
		setSelectedMajor(major);
		setModalType('major');
		setModalVisible(true);
	};

	const showStatusList = (status: string): void => {
		setSelectedStatus(status);
		setModalType('status');
		setModalVisible(true);
	};

	const handleSelectChange = (value: string, type: ModalType): void => {
		if (type === 'major' && value && stats && stats.admittedByMajor[value] && stats.admittedByMajor[value].count > 0) {
			showCandidateList(value);
		} else if (
			type === 'status' &&
			value &&
			stats &&
			stats.profileStatus[value] &&
			stats.profileStatus[value].count > 0
		) {
			showStatusList(value);
		}
	};

	const exportToExcel = (major: string): void => {
		const candidates = stats?.admittedByMajor[major]?.candidates || [];

		if (candidates.length === 0) {
			notification.warning({
				message: 'Không có dữ liệu',
				description: `Ngành ${major} chưa có thí sinh đậu.`,
			});
			return;
		}

		const exportData = candidates.map((candidate: ThongKe.HoSo, index: number) => ({
			STT: index + 1,
			'Họ và tên': candidate.thongTinLienHe?.ten || 'N/A',
			Điểm: candidate.diem?.toFixed(1) || 'N/A',
			'Địa chỉ cụ thể': candidate.thongTinLienHe?.diaChi?.diaChiCuThe || '',
			'Xã/Phường': candidate.thongTinLienHe?.diaChi?.xaPhuong || '',
			'Quận/Huyện': candidate.thongTinLienHe?.diaChi?.quanHuyen || '',
			'Tỉnh/Thành phố': candidate.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
			'Tình trạng': candidate.tinhTrang || 'N/A',
			'ID hồ sơ': candidate.id,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();

		worksheet['!cols'] = [
			{ wch: 5 },
			{ wch: 25 },
			{ wch: 10 },
			{ wch: 30 },
			{ wch: 20 },
			{ wch: 20 },
			{ wch: 20 },
			{ wch: 15 },
			{ wch: 15 },
		];

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách thí sinh');

		const fileName = `Danh_sach_thi_sinh_dau_${major.replace(/\s+/g, '_')}_${
			new Date().toISOString().split('T')[0]
		}.xlsx`;
		XLSX.writeFile(workbook, fileName);

		notification.success({
			message: 'Xuất Excel thành công',
			description: `Đã xuất danh sách thí sinh đậu ngành ${major}.`,
		});
	};

	const exportStatusToExcel = (status: string): void => {
		const candidates = stats?.profileStatus[status]?.candidates || [];

		if (candidates.length === 0) {
			notification.warning({
				message: 'Không có dữ liệu',
				description: `Không có hồ sơ ở trạng thái ${status}.`,
			});
			return;
		}

		const exportData = candidates.map((candidate: ThongKe.HoSo, index: number) => ({
			STT: index + 1,
			'Họ và tên': candidate.thongTinLienHe?.ten || 'N/A',
			Điểm: (candidate.ketQua?.diem ?? candidate.diem)?.toFixed(1) || 'N/A',
			'Địa chỉ cụ thể': candidate.thongTinLienHe?.diaChi?.diaChiCuThe || '',
			'Xã/Phường': candidate.thongTinLienHe?.diaChi?.xaPhuong || '',
			'Quận/Huyện': candidate.thongTinLienHe?.diaChi?.quanHuyen || '',
			'Tỉnh/Thành phố': candidate.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
			'Tình trạng': candidate.tinhTrang || 'N/A',
			'ID hồ sơ': candidate.id,
		}));

		const worksheet = XLSX.utils.json_to_sheet(exportData);
		const workbook = XLSX.utils.book_new();

		worksheet['!cols'] = [
			{ wch: 5 },
			{ wch: 25 },
			{ wch: 10 },
			{ wch: 30 },
			{ wch: 20 },
			{ wch: 20 },
			{ wch: 20 },
			{ wch: 15 },
			{ wch: 15 },
		];

		XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh sách hồ sơ');

		const fileName = `Danh_sach_ho_so_${status.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
		XLSX.writeFile(workbook, fileName);

		notification.success({
			message: 'Xuất Excel thành công',
			description: `Đã xuất danh sách hồ sơ ở trạng thái ${status}.`,
		});
	};

	const exportAllMajors = (): void => {
		// FIX: Add null check for stats
		if (!stats) {
			notification.warning({
				message: 'Không có dữ liệu',
				description: 'Dữ liệu thống kê chưa được tải.',
			});
			return;
		}

		const majorsWithStudents = Object.keys(stats.admittedByMajor).filter(
			(major) => stats.admittedByMajor[major].count > 0,
		);

		if (majorsWithStudents.length === 0) {
			notification.warning({
				message: 'Không có dữ liệu',
				description: 'Chưa có thí sinh đậu ở bất kỳ ngành nào.',
			});
			return;
		}

		const workbook = XLSX.utils.book_new();

		majorsWithStudents.forEach((major) => {
			const candidates = stats.admittedByMajor[major].candidates || [];
			const exportData = candidates.map((candidate: ThongKe.HoSo, index: number) => ({
				STT: index + 1,
				'Họ và tên': candidate.thongTinLienHe?.ten || 'N/A',
				Điểm: candidate.diem?.toFixed(1) || 'N/A',
				'Địa chỉ cụ thể': candidate.thongTinLienHe?.diaChi?.diaChiCuThe || '',
				'Xã/Phường': candidate.thongTinLienHe?.diaChi?.xaPhuong || '',
				'Quận/Huyện': candidate.thongTinLienHe?.diaChi?.quanHuyen || '',
				'Tỉnh/Thành phố': candidate.thongTinLienHe?.diaChi?.tinh_ThanhPho || '',
				'Tình trạng': candidate.tinhTrang || 'N/A',
				'ID hồ sơ': candidate.id,
			}));

			const worksheet = XLSX.utils.json_to_sheet(exportData);
			worksheet['!cols'] = [
				{ wch: 5 },
				{ wch: 25 },
				{ wch: 10 },
				{ wch: 30 },
				{ wch: 20 },
				{ wch: 20 },
				{ wch: 20 },
				{ wch: 15 },
				{ wch: 15 },
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

	if (loading) {
		return (
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					height: '400px',
					fontSize: '16px',
				}}
			>
				🔄 Đang tải dữ liệu thống kê...
			</div>
		);
	}

	if (!stats) return null;

	const totalAdmitted = Object.values(stats.admittedByMajor).reduce(
		(sum: number, item: ThongKe.MajorStats) => sum + item.count,
		0,
	);

	// FIX: Add null check for stats
	const majorsWithStudents = Object.keys(stats?.admittedByMajor || {}).filter(
		(major) => stats?.admittedByMajor[major].count > 0,
	);

	const statusesWithProfiles = Object.keys(stats?.profileStatus || {}).filter(
		(status) => stats?.profileStatus[status].count > 0,
	);

	return (
		<div className='statistics-page' style={{ background: '#f5f5f5', minHeight: '100vh', padding: '20px' }}>
			{/* Statistics Cards */}
			<Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
				<Col span={6}>
					<Card>
						<Statistic
							title='Tổng hồ sơ'
							value={stats.profileStats.total}
							prefix={<UserOutlined style={{ color: '#1890ff' }} />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Đã duyệt'
							value={stats.profileStats.approved}
							prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
							valueStyle={{ color: '#52c41a' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Thí sinh đậu'
							value={totalAdmitted}
							prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
							valueStyle={{ color: '#faad14' }}
						/>
					</Card>
				</Col>
				<Col span={6}>
					<Card>
						<Statistic
							title='Số ngành'
							value={Object.keys(stats.admittedByMajor).length}
							prefix={<BookOutlined style={{ color: '#722ed1' }} />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Charts Section */}
			<Card
				title={
					<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
						<BarChartOutlined style={{ color: '#1890ff' }} />
						<span> Thống kê tuyển sinh chi tiết</span>
					</div>
				}
				style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
			>
				<Row gutter={[20, 20]} style={{ display: 'flex', flexWrap: 'wrap' }}>
					{/* Admitted by Major Chart */}
					<Col span={12} style={{ display: 'flex' }}>
						<Card
							title={
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<span>🎓 Thí sinh đậu theo ngành</span>
								</div>
							}
							style={{ borderRadius: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}
							bodyStyle={{ padding: '16px', flex: 1 }}
						>
							<ColumnChart
								xAxis={Object.keys(stats.admittedByMajor)}
								yAxis={[Object.values(stats.admittedByMajor).map((item: ThongKe.MajorStats) => item.count)]}
								yLabel={['Số lượng thí sinh']}
								colors={['#1890ff']}
								height={300}
								formatY={formatThiSinh}
							/>
							<Divider style={{ margin: '16px 0' }} />
							<div>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: '12px',
										flexWrap: 'wrap',
										marginBottom: '16px',
									}}
								>
									<span style={{ fontWeight: 600, color: '#262626', minWidth: 'fit-content' }}>Xem danh sách:</span>
									{majorsWithStudents.length > 0 ? (
										<>
											<Select
												placeholder='Chọn ngành để xem danh sách'
												style={{ minWidth: 280, flex: 1 }}
												onChange={(value) => handleSelectChange(value, 'major')}
												allowClear
												size='large'
											>
												{majorsWithStudents.map((major) => (
													<Option key={major} value={major}>
														<div
															style={{
																display: 'flex',
																justifyContent: 'space-between',
																alignItems: 'center',
															}}
														>
															<span style={{ fontWeight: 500 }}>{major}</span>
															<Tag color='blue' style={{ margin: 0, fontWeight: 'bold' }}>
																{stats.admittedByMajor[major].count}
															</Tag>
														</div>
													</Option>
												))}
											</Select>
											<Space wrap>
												<Tooltip title='Xuất danh sách thí sinh'>
													<Button
														type='primary'
														icon={<FileExcelOutlined />}
														onClick={exportAllMajors}
														style={{
															background: 'linear-gradient(135deg, #52c41a, #73d13d)',
															border: 'none',
															borderRadius: '6px',
															fontWeight: 500,
														}}
													>
														Xuất Excel
													</Button>
												</Tooltip>
											</Space>
										</>
									) : (
										<span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>Chưa có thí sinh đậu</span>
									)}
								</div>
							</div>
						</Card>
					</Col>

					{/* Wishes by Major Chart */}
					<Col span={12} style={{ display: 'flex' }}>
						<Card
							title='📈 Số lượng nguyện vọng theo ngành'
							style={{ borderRadius: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}
							bodyStyle={{ padding: '16px', flex: 1 }}
						>
							<DonutChart
								xAxis={Object.keys(stats.wishesByMajor)}
								yAxis={[Object.values(stats.wishesByMajor)]}
								yLabel={['Số lượng nguyện vọng']}
								colors={['#1890ff', '#52c41a', '#faad14', '#ff4d4f', '#722ed1', '#eb2f96']}
								showTotal
								height={300}
								formatY={formatNguyenVong}
							/>
						</Card>
					</Col>
				</Row>

				<Row gutter={[20, 20]} style={{ display: 'flex', flexWrap: 'wrap' }}>
					{/* Wishes by Score Chart */}
					<Col span={12} style={{ display: 'flex' }}>
						<WishesByScoreChart stats={stats} />
					</Col>

					{/* Admission Method Chart */}
					<Col span={12} style={{ display: 'flex' }}>
						<AdmissionMethodChart stats={stats} chartMode={chartMode} onChartModeChange={setChartMode} />
					</Col>
				</Row>

				<Row gutter={[20, 20]} style={{ display: 'flex', flexWrap: 'wrap' }}>
					{/* Candidates by ToHop Chart */}
					<Col span={12} style={{ display: 'flex' }}>
						<CandidatesByToHopChart candidatesByToHop={candidatesByToHop} />
					</Col>

					{/* Profile Status Chart */}
					<Col span={12} style={{ display: 'flex' }}>
						<ProfileStatusChart
							stats={stats}
							statusesWithProfiles={statusesWithProfiles}
							selectedStatus={selectedStatus}
							onStatusSelect={(status) => {
								setSelectedStatus(status);
								handleSelectChange(status, 'status');
							}}
							onExportStatus={exportStatusToExcel}
						/>
					</Col>
				</Row>
			</Card>

			{/* Candidate Modal */}
			<CandidateModal
				visible={modalVisible}
				modalType={modalType}
				selectedMajor={selectedMajor}
				selectedStatus={selectedStatus}
				stats={stats}
				onClose={() => setModalVisible(false)}
				onExportMajor={exportToExcel}
				onExportStatus={exportStatusToExcel}
			/>
		</div>
	);
};

export default StatisticsPage;

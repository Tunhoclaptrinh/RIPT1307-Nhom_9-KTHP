import React, { useState } from 'react';
import { Popconfirm, Tag, Space, Typography, Popover, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import TableBase from '@/components/Table';
import { IColumn } from '@/components/Table/typing';
import { useModel } from 'umi';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import ThongTinHocTapForm from './components/Form';
import ThongTinHocTapDetail from './components/Detail';
import UserDetail from '../Users/components/Detail'; // Import UserDetail modal
import useUsers from '@/hooks/useUsers'; // Import hook
import { ipLocal } from '@/utils/ip';

const { Text } = Typography;

const ThongTinHocTapPage = () => {
	const { handleEdit, handleView, deleteModel, getExportFieldsModel, postExportModel } = useModel('thongtinhoctap');
	const { getUserFullName, getUserInfo, getUserById, loading: usersLoading } = useUsers();
	const [extendedModalVisible, setExtendedModalVisible] = useState(false);
	const [userDetailModalVisible, setUserDetailModalVisible] = useState(false); // Modal xem thông tin user
	const [selectedRecord, setSelectedRecord] = useState<ThongTinHocTap.IRecord | undefined>();
	const [selectedUser, setSelectedUser] = useState<User.IRecord | undefined>(); // User được chọn

	// Hàm xử lý mở modal mở rộng
	const onOpenExtendedModal = (record: ThongTinHocTap.IRecord) => {
		setSelectedRecord(record);
		setExtendedModalVisible(true);
	};

	// Hàm đóng
	const onCloseExtendedModal = () => {
		setExtendedModalVisible(false);
	};

	// Hàm chuyển sang chế độ edit
	const onEditFromView = () => {
		setExtendedModalVisible(false);
		if (selectedRecord) {
			handleEdit(selectedRecord);
		}
	};

	// Hàm xử lý click vào thông tin user
	const handleUserClick = (userId: string) => {
		const user = getUserById(userId);
		if (user) {
			setSelectedUser(user);
			setUserDetailModalVisible(true);
		}
	};

	// Hàm đóng modal user detail
	const handleCloseUserDetail = () => {
		setUserDetailModalVisible(false);
		setSelectedUser(undefined);
	};

	// Render user info với avatar và tên - có thể click
	const renderUserInfo = (userId: string) => {
		const userInfo = getUserInfo(userId);
		const fullName = getUserFullName(userId);

		if (usersLoading) {
			return <Text type='secondary'>Đang tải...</Text>;
		}

		return (
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					gap: 8,
					cursor: 'pointer',
					padding: '4px 8px',
					borderRadius: '6px',
					transition: 'all 0.3s ease',
				}}
				onClick={() => handleUserClick(userId)}
				onMouseEnter={(e) => {
					e.currentTarget.style.backgroundColor = '#f0f9ff';
					e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.backgroundColor = 'transparent';
					e.currentTarget.style.boxShadow = 'none';
				}}
				title='Click để xem thông tin chi tiết'
			>
				<Avatar size='small' src={`${ipLocal}${userInfo?.avatar}`} icon={<UserOutlined />} />
				<div>
					<div style={{ fontWeight: 500, color: '#1890ff' }}>{fullName}</div>
					{userInfo?.username && (
						<Text type='secondary' style={{ fontSize: '12px' }}>
							@{userInfo.username}
						</Text>
					)}
					<div style={{ margin: 0 }}>
						<Text type='secondary' style={{ fontSize: '12px' }}>
							ID:{userId}
						</Text>
					</div>
				</div>
			</div>
		);
	};

	// Helper function để render trạng thái tốt nghiệp
	const renderTrangThaiTotNghiep = (daTotNghiep: boolean, namTotNghiep: string | Date) => {
		if (daTotNghiep) {
			return (
				<div>
					<Tag color='green'>Đã tốt nghiệp</Tag>
					<br />
					<Text type='secondary'>Năm: {moment(namTotNghiep).format('YYYY')}</Text>
				</div>
			);
		}
		return <Tag color='orange'>Chưa tốt nghiệp</Tag>;
	};

	// Helper function để render điểm THPT
	const renderDiemTHPT = (diemTHPT: ThongTinHocTap.IDiemTHPT[]) => {
		if (!diemTHPT || diemTHPT.length === 0) {
			return <Text type='secondary'>Chưa có điểm</Text>;
		}

		return (
			<div style={{ maxHeight: 300, overflowY: 'auto' }}>
				{diemTHPT.map((diem, index) => (
					<div key={index} style={{ marginBottom: 4 }}>
						<Text strong>{diem.mon}</Text>: <Text type='success'>{diem.diem}</Text>
					</div>
				))}
			</div>
		);
	};

	// Helper function để render điểm ĐGTD chi tiết
	const renderDiemDGTD = (diemDGTD: ThongTinHocTap.IDiemDGTD) => {
		if (!diemDGTD || !diemDGTD.mon || diemDGTD.mon.length === 0) {
			return <Text type='secondary'>Chưa có điểm</Text>;
		}

		return (
			<div style={{ maxHeight: 300, overflowY: 'auto' }}>
				<div style={{ marginBottom: 4 }}>
					<Text strong>Tổng điểm:</Text> <Text type='success'>{diemDGTD.tongDiem}</Text>
				</div>
				{diemDGTD.mon.map((mon, index) => (
					<div key={index} style={{ marginBottom: 4 }}>
						<Text strong>{mon.ten}</Text>: <Text type='success'>{mon.diem}</Text>
					</div>
				))}
			</div>
		);
	};

	// Helper function để render điểm ĐGNL chi tiết
	const renderDiemDGNL = (diemDGNL: ThongTinHocTap.IDiemDGNL) => {
		if (!diemDGNL || !diemDGNL.mon || diemDGNL.mon.length === 0) {
			return <Text type='secondary'>Chưa có điểm</Text>;
		}

		return (
			<div style={{ maxHeight: 300, overflowY: 'auto' }}>
				<div style={{ marginBottom: 4 }}>
					<Text strong>Tổng điểm:</Text> <Text type='success'>{diemDGNL.tongDiem}</Text>
				</div>
				{diemDGNL.mon.map((mon, index) => (
					<div key={index} style={{ marginBottom: 4 }}>
						<Text strong>{mon.ten}</Text>: <Text type='success'>{mon.diem}</Text>
					</div>
				))}
			</div>
		);
	};

	// Helper function để render khu vực ưu tiên
	const renderKhuVucUT = (khuVuc: ThongTinHocTap.KhuVucUT) => {
		const colorMap: Record<string, string> = {
			kv1: 'red',
			kv2: 'orange',
			kv2NT: 'blue',
			kv3: 'green',
		};
		return <Tag color={colorMap[khuVuc] || 'default'}>{khuVuc.toUpperCase()}</Tag>;
	};

	// Helper function để render đối tượng ưu tiên
	const renderDoiTuongUT = (doiTuong: ThongTinHocTap.DoiTuongUT) => {
		const colorMap: Record<string, string> = {
			'hộ nghèo': 'volcano',
			'cận nghèo': 'orange',
		};
		return <Tag color={colorMap[doiTuong] || 'default'}>{doiTuong}</Tag>;
	};

	const columns: IColumn<ThongTinHocTap.IRecord>[] = [
		{
			title: 'Thí sinh',
			dataIndex: 'userId',
			width: 200,
			sortable: true,
			filterType: 'string',
			render: (userId: string) => renderUserInfo(userId),
		},
		{
			title: 'Thông tin trường THPT',
			width: 250,
			render: (_, record) => (
				<div>
					<div>
						<Text strong>Tên:</Text> {record.thongTinTHPT.ten}
					</div>
					<div>
						<Text strong>Mã trường:</Text> {record.thongTinTHPT.maTruong}
					</div>
					<div>
						<Text strong>Tỉnh/TP:</Text> {record.thongTinTHPT.tinh_ThanhPho}
					</div>
				</div>
			),
		},
		{
			title: 'Trạng thái tốt nghiệp',
			width: 150,
			filterType: 'select',
			filterIcon: [
				{ text: 'Đã tốt nghiệp', value: true },
				{ text: 'Chưa tốt nghiệp', value: false },
			],
			render: (_, record) =>
				renderTrangThaiTotNghiep(record.thongTinTHPT.daTotNghiep, record.thongTinTHPT.namTotNghiep),
		},
		{
			title: 'Ưu tiên',
			width: 120,
			render: (_, record) => (
				<div>
					{renderKhuVucUT(record.thongTinTHPT.khuVucUT)}
					<br />
					{renderDoiTuongUT(record.thongTinTHPT.doiTuongUT)}
				</div>
			),
		},
		{
			title: 'Điểm THPT',
			dataIndex: 'diemTHPT',
			width: 200,
			render: (diemTHPT: ThongTinHocTap.IDiemTHPT[]) => {
				if (!diemTHPT || diemTHPT.length === 0) {
					return <Text type='secondary'>Chưa có điểm</Text>;
				}

				const summary =
					diemTHPT
						.slice(0, 3)
						.map((diem) => `${diem.mon}: ${diem.diem}`)
						.join(', ') + (diemTHPT.length > 3 ? ', ...' : '');

				return (
					<Popover content={renderDiemTHPT(diemTHPT)} title='Chi tiết điểm THPT' trigger='click'>
						<div
							style={{
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
								maxWidth: '180px',
								cursor: 'pointer',
							}}
						>
							{summary}
						</div>
					</Popover>
				);
			},
		},
		{
			title: 'Điểm ĐGTD',
			width: 100,
			render: (_, record) => (
				<Popover content={renderDiemDGTD(record.diemDGTD)} title='Chi tiết điểm ĐGTD' trigger='click'>
					<div style={{ cursor: 'pointer', textAlign: 'center' }}>
						<Text strong type='success'>
							{record.diemDGTD?.tongDiem || 0}
						</Text>
					</div>
				</Popover>
			),
		},
		{
			title: 'Điểm ĐGNL',
			width: 100,
			render: (_, record) => (
				<Popover content={renderDiemDGNL(record.diemDGNL)} title='Chi tiết điểm ĐGNL' trigger='click'>
					<div style={{ cursor: 'pointer', textAlign: 'center' }}>
						<Text strong type='success'>
							{record.diemDGNL?.tongDiem || 0}
						</Text>
					</div>
				</Popover>
			),
		},
		{
			title: 'Giải HSG',
			width: 150,
			render: (_, record) => {
				if (!record.giaiHSG) {
					return <Text type='secondary'>Không có</Text>;
				}
				return (
					<div>
						<Tag color='gold'>{record.giaiHSG.loaiGiai}</Tag>
						<br />
						<Text type='secondary'>
							{record.giaiHSG.mon} - {record.giaiHSG.giaiHsgCap}
						</Text>
					</div>
				);
			},
		},
		{
			title: 'Chứng chỉ',
			width: 120,
			render: (_, record) => {
				if (!record.chungChi || record.chungChi.length === 0) {
					return <Text type='secondary'>Không có</Text>;
				}
				return (
					<div>
						{record.chungChi.slice(0, 2).map((cc, index) => (
							<Tag key={index} color='blue' style={{ marginBottom: 2 }}>
								{cc.loaiCC}
							</Tag>
						))}
						{record.chungChi.length > 2 && <Text type='secondary'>+{record.chungChi.length - 2}</Text>}
					</div>
				);
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (_, record) => (
				<Space>
					<ButtonExtend
						tooltip='Xem chi tiết'
						onClick={() => onOpenExtendedModal(record)}
						type='link'
						icon={<EyeOutlined />}
					/>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(record.id)}
						title='Bạn có chắc chắn muốn xóa thông tin học tập này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<TableBase
				columns={columns}
				modelName='thongtinhoctap'
				title='Quản lý thông tin học tập'
				Form={ThongTinHocTapForm}
				widthDrawer={1000}
				buttons={{ create: true, import: true, export: true, filter: true, reload: true }}
				deleteMany
				rowSelection
				// Cấu hình export
				exportConfig={{
					fileName: 'DanhSachThongTinHocTap.xlsx',
					getExportFieldsModel,
					postExportModel,
					maskCloseableForm: false,
				}}
			/>
			<ThongTinHocTapDetail
				isVisible={extendedModalVisible}
				onClose={onCloseExtendedModal}
				record={selectedRecord}
				onEdit={onEditFromView}
			/>
			<UserDetail
				isVisible={userDetailModalVisible}
				onClose={handleCloseUserDetail}
				record={selectedUser}
				title='thí sinh'
				hideFooter
			/>
		</div>
	);
};

export default ThongTinHocTapPage;

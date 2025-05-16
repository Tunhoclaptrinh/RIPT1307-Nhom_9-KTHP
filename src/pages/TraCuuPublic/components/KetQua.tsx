import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
// import type { PhuLucVanBang } from '@/services/VanBang/PhuLucVanBang/typing';
import { EyeOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

const KetQuaVanBang = () => {
	// const { formSubmiting, thongTinTraCuu } = useModel('vbcc.phulucvanbang');

	// const columns: IColumn<PhuLucVanBang.IThongTinTraCuu>[] = [
	const columns: any[] = [
		{
			title: 'Họ và tên',
			width: 120,
			// render: (val, rec) => rec?.DuLieu?.soVaoSoBang,
		},
		{
			title: 'Số hiệu văn bằng',
			width: 150,
			// render: (val, rec) => rec?.DuLieu?.soHieuVanBang,
		},
		{
			title: 'Họ tên',
			width: 160,
			// render: (val, rec) => rec?.DuLieu?.hoTen,
		},
		{
			title: 'Ngày sinh',
			align: 'center',
			width: 100,
			// render: (val, rec) => rec?.DuLieu?.ngaySinh && moment(rec?.DuLieu?.ngaySinh).format('DD/MM/YYYY'),
		},
		{
			title: 'Mã SV',
			width: 120,
			// render: (val, rec) => rec?.DuLieu?.maSinhVien,
		},
		// {
		// 	title: 'Tập tin',
		// 	align: 'center',
		// 	width: 120,
		// 	render: (val, rec) =>
		// 		rec?.DuLieu?.urlIpfs ? (
		// 			<a href={rec?.DuLieu?.urlIpfs} target='_blank' rel='noreferrer'>
		// 				Xem chi tiết
		// 			</a>
		// 		) : (
		// 			<i>(Chưa upload)</i>
		// 		),
		// },
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			// render: (val, rec) => (
			// 	<ButtonExtend
			// 		disabled={!rec?.DuLieu?.idVanBang}
			// 		tooltip={!rec?.DuLieu?.idVanBang ? 'Chưa có thông tin văn bằng' : 'Chi tiết'}
			// 		type='link'
			// 		icon={<EyeOutlined />}
			// 		onClick={() => window.open(`/tra-cuu-van-bang/chi-tiet/${rec?.DuLieu?.idVanBang}`, '_blank')}
			// 	/>
			// ),
		},
	];

	return (
		// <Card title='Thông tin phụ lục văn bằng'>
		// 	{!!thongTinTraCuu?.Error ? (
		// 		<div style={{ margin: 'auto' }}>
		// 			<i style={{ color: 'red' }}>Không tồn tại thông tin văn bằng!</i>
		// 		</div>
		// 	) : (
		// 		<TableStaticData
		// 			loading={formSubmiting}
		// 			columns={columns}
		// 			data={thongTinTraCuu ?? []}
		// 			addStt
		// 			hasTotal
		// 			otherProps={{
		// 				scroll: { y: 380 },
		// 				pagination: false,
		// 			}}
		// 		/>
		// 	)}
		// </Card>
		<Card title='Kết quả xét tuyển sinh'>
			<TableStaticData
				// loading={formSubmiting}
				columns={columns}
				// data={thongTinTraCuu ?? []}
				addStt
				hasTotal
				otherProps={{
					scroll: { y: 380 },
					pagination: false,
				}}
				data={[]}
			/>
		</Card>
	);
};

export default KetQuaVanBang;

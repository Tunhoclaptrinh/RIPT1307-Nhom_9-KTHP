import React from 'react';
import { Card, Select, Space, Button, Tooltip, Tag, Divider } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import DonutChart from '../../../components/Chart/DonutChart';
import { formatHoSo } from '@/utils/utils';

const { Option } = Select;

interface ProfileStatusChartProps {
	stats: ThongKe.Stats;
	statusesWithProfiles: string[];
	selectedStatus: string | null;
	onStatusSelect: (status: string) => void;
	onExportStatus: (status: string) => void;
}

const ProfileStatusChart: React.FC<ProfileStatusChartProps> = ({
	stats,
	statusesWithProfiles,
	selectedStatus,
	onStatusSelect,
	onExportStatus,
}) => {
	return (
		<Card
			title='📋 Trạng thái hồ sơ'
			style={{ borderRadius: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}
			bodyStyle={{ padding: '16px', flex: 1 }}
		>
			<DonutChart
				xAxis={Object.keys(stats.profileStatus)}
				yAxis={[Object.values(stats.profileStatus).map((item: any) => item.count)]}
				yLabel={['Số lượng hồ sơ']}
				colors={['#52c41a', '#ff4d4f', '#faad14']}
				formatY={formatHoSo}
				showTotal
				height={300}
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
					{statusesWithProfiles.length > 0 ? (
						<>
							<Select
								placeholder='Chọn trạng thái để xem danh sách'
								style={{ minWidth: 280, flex: 1 }}
								onChange={onStatusSelect}
								allowClear
								size='large'
							>
								{statusesWithProfiles.map((status) => (
									<Option key={status} value={status}>
										<div
											style={{
												display: 'flex',
												justifyContent: 'space-between',
												alignItems: 'center',
											}}
										>
											<span style={{ fontWeight: 500 }}>{status}</span>
											<Tag color='blue' style={{ margin: 0, fontWeight: 'bold' }}>
												{stats.profileStatus[status].count}
											</Tag>
										</div>
									</Option>
								))}
							</Select>
							<Space wrap>
								<Tooltip title='Xuất danh sách hồ sơ'>
									<Button
										type='primary'
										icon={<FileExcelOutlined />}
										onClick={() => selectedStatus && onExportStatus(selectedStatus)}
										style={{
											background: 'linear-gradient(135deg, #52c41a, #73d13d)',
											border: 'none',
											borderRadius: '6px',
											fontWeight: 500,
										}}
										disabled={!selectedStatus}
									>
										Xuất Excel
									</Button>
								</Tooltip>
							</Space>
						</>
					) : (
						<span style={{ color: '#8c8c8c', fontStyle: 'italic' }}>Chưa có hồ sơ</span>
					)}
				</div>
			</div>
		</Card>
	);
};

export default ProfileStatusChart;

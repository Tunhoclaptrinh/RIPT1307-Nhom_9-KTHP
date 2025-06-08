// components/AdmissionMethodChart.tsx
import React from 'react';
import { Card, Switch } from 'antd';
import DonutChart from '../../../components/Chart/DonutChart';

interface AdmissionMethodChartProps {
	stats: ThongKe.Stats;
	chartMode: 'wishes' | 'admitted';
	onChartModeChange: (mode: 'wishes' | 'admitted') => void;
}

const AdmissionMethodChart: React.FC<AdmissionMethodChartProps> = ({ stats, chartMode, onChartModeChange }) => {
	return (
		<Card
			title='🎯 Phương thức xét tuyển'
			style={{
				borderRadius: '8px',
				flex: 1,
				display: 'flex',
				flexDirection: 'column',
			}}
			bodyStyle={{ padding: '16px', flex: 1 }}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<span>Phương thức xét tuyển</span>
				<Switch
					checkedChildren='Nguyện vọng trúng tuyển'
					unCheckedChildren='Tổng nguyện vọng'
					checked={chartMode === 'admitted'}
					onChange={(checked) => onChartModeChange(checked ? 'admitted' : 'wishes')}
				/>
			</div>
			<DonutChart
				xAxis={Object.keys(chartMode === 'wishes' ? stats.wishesByAdmissionMethod : stats.admittedByAdmissionMethod)}
				yAxis={[
					Object.values(chartMode === 'wishes' ? stats.wishesByAdmissionMethod : stats.admittedByAdmissionMethod),
				]}
				yLabel={[chartMode === 'wishes' ? 'Số lượng nguyện vọng' : 'Số lượng nguyện vọng trúng tuyển']}
				colors={['#1890ff', '#52c41a', '#faad14']}
				showTotal
				height={300}
			/>
		</Card>
	);
};

export default AdmissionMethodChart;

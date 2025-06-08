// components/WishesByScoreChart.tsx
import React from 'react';
import { Card } from 'antd';
import LineChart from '../../../components/Chart/LineChart';

interface WishesByScoreChartProps {
	stats: ThongKe.Stats;
}

const WishesByScoreChart: React.FC<WishesByScoreChartProps> = ({ stats }) => {
	return (
		<Card
			title='📊 Nguyện vọng theo khoảng điểm'
			style={{ borderRadius: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}
			bodyStyle={{ padding: '16px', flex: 1 }}
		>
			<LineChart
				xAxis={Object.keys(stats.wishesByScore)}
				yAxis={[Object.values(stats.wishesByScore)]}
				yLabel={['Số lượng nguyện vọng']}
				colors={['#52c41a']}
				height={300}
			/>
		</Card>
	);
};

export default WishesByScoreChart;

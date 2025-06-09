import React from 'react';
import { Card } from 'antd';
import ColumnChart from '../../../components/Chart/ColumnChart';
import { formatThiSinh } from '@/utils/utils';

interface CandidatesByToHopChartProps {
	candidatesByToHop: { [toHop: string]: number };
}

const CandidatesByToHopChart: React.FC<CandidatesByToHopChartProps> = ({ candidatesByToHop }) => {
	return (
		<Card
			title='📈 Số lượng thí sinh đăng ký theo tổ hợp xét tuyển'
			style={{ borderRadius: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}
			bodyStyle={{ padding: '16px', flex: 1 }}
		>
			<ColumnChart
				xAxis={Object.keys(candidatesByToHop)}
				yAxis={[Object.values(candidatesByToHop)]}
				yLabel={['Số lượng thí sinh']}
				colors={['#1890ff']}
				formatY={formatThiSinh}
				height={300}
			/>
		</Card>
	);
};

export default CandidatesByToHopChart;

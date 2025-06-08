import { tienVietNam } from '@/utils/utils';
import Chart from 'react-apexcharts';
import { type DataChartType } from '.';
import './style.less';
import vi from './vi.json';

const DonutChart = (props: DataChartType) => {
	const { xAxis, yAxis, height, colors, formatY, showTotal, width, otherOptions } = props;

	const options = {
		chart: {
			defaultLocale: 'vi',
			locales: [vi],
			toolbar: { show: true },
		},
		labels: xAxis,
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 300,
					},
					legend: {
						position: 'bottom',
						horizontalAlign: 'center',
					},
				},
			},
		],
		tooltip: {
			y: {
				formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)),
			},
		},
		colors,
		fill: {
			colors,
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: showTotal,
						total: {
							show: showTotal,
							label: 'Tổng số',
							formatter: (w: any) => {
								const val = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
								return formatY ? formatY(val) : tienVietNam(val);
							},
						},
					},
				},
			},
		},
	};

	const series = yAxis?.[0] || [];

	return (
		<Chart
			options={{ ...options, ...otherOptions }}
			series={series}
			type='donut'
			style={{display: 'flex', justifyContent: 'space-between'}}
			height={height ?? 350}
			width={width}
		/>
	);
};

export default DonutChart;

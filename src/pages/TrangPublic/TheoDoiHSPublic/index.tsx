import React, { useState, useEffect } from 'react';
import {
	Card,
	Row,
	Col,
	Spin,
	message,
	Badge,
	Steps,
	Timeline,
	Descriptions,
	Button,
	Space,
	Typography,
	Alert,
	Tag,
} from 'antd';
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	ExclamationCircleOutlined,
	FileTextOutlined,
	UserOutlined,
	CalendarOutlined,
	TrophyOutlined,
	ReloadOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { ipLocal } from '@/utils/ip';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import TheoDoiHoSoBody from './Body';

const { Step } = Steps;

interface HoSoData {
	user: any;
	hoSo: any;
	nguyenVong: any[];
	thongTinHocTap: any;
	phuongThucXetTuyen: any[];
}

const TheoDoiHoSo = () => {
	return (
		<>
			<Header subTitle='Theo dõi hồ sơ xét tuyển' />
			<div
				style={{
					marginTop: 90,
					background: '#f5f5f5',
					minHeight: '100vh',
					padding: '20px 0',
				}}
			>
				<TheoDoiHoSoBody />
			</div>
			<Footer />
		</>
	);
};

export default TheoDoiHoSo;

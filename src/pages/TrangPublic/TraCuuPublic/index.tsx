import MyDatePicker from '@/components/MyDatePicker';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Card, Col, Form, Input, message, Row } from 'antd';
import { useModel } from 'umi';
import Footer from '../../../components/Footer';
import Header from '../../../components/Header';
import KetQuaVanBang from './components/KetQua';
import rules from '@/utils/rules';

const TraCuuTuyenSinhPublic = () => {
	const [form] = Form.useForm();
	// const { formSubmiting, traCuuPhuLucVanBanModel } = useModel('vbcc.phulucvanbang');

	// const onFinish = async (values: any) => {
	// 	const filledFields = Object.values(values).filter((value) => value).length;
	// 	if (filledFields < 2) {
	// 		message.error('Vui lòng nhập ít nhất 2 trường');
	// 		return;
	// 	}

	// try {
	// 	await traCuuPhuLucVanBanModel(values);
	// } catch (error) {
	// 	message.error('Có lỗi xảy ra khi tra cứu, vui lòng thử lại sau');
	// }
	// };

	return (
		<>
			<Header subTitle='Hệ thống Tuyển sinh Đại học Trực tuyến' />
			<Row
				style={{
					// eslint-disable-next-line quotes
					backgroundImage: `url('/bg-vbcc.png')`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					background: '#f5f5f5',
				}}
			>
				<Col style={{ margin: 'auto', paddingTop: 30, paddingBottom: 30, marginTop: 90 }} xs={24} lg={20}>
					<Card title='Thông tin tra cứu'>
						<Form
							// onFinish={onFinish}
							layout={'vertical'}
							// form={form}
						>
							<Row gutter={[12, 12]}>
								<Col span={24} md={12}>
									<Form.Item name='hoTen' label='Họ tên'>
										<Input placeholder='Nhập họ tên' />
									</Form.Item>
								</Col>
								<Col span={24} md={12}>
									<Form.Item name='ngaySinh' label='Ngày sinh'>
										<MyDatePicker placeholder='Chọn ngày sinh' format='DD/MM/YYYY' />
									</Form.Item>
								</Col>
								<Col span={24} md={12}>
									<Form.Item name='soCCCD' label='Số CMND/CCCD'>
										<Input placeholder='Nhập số CMND/CCCD' />
									</Form.Item>
								</Col>
								<Col span={24} md={12}>
									<Form.Item name='soBaoDanh' label='Số báo danh'>
										<Input placeholder='Nhập số báo danh' />
									</Form.Item>
								</Col>
							</Row>
							<Row style={{ display: 'flex', justifySelf: 'end' }}>
								<Button
									icon={<SearchOutlined />}
									type='primary'
									htmlType='submit'
									// loading={formSubmiting}
									size='large'
									style={{ minWidth: 180, margin: 'auto', marginTop: 20, height: 40 }}
								>
									Tra cứu
								</Button>
							</Row>
						</Form>
					</Card>

					<div style={{ marginTop: 12 }}>
						<KetQuaVanBang />
					</div>
				</Col>
			</Row>
			<Footer />
		</>
	);
};

export default TraCuuTuyenSinhPublic;

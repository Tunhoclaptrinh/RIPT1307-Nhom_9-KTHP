import React from 'react';
import {
	Button,
	Card,
	Form,
	Input,
	Select,
	InputNumber,
	Space,
	Divider,
	AutoComplete,
	Avatar,
	Typography,
	Row,
	Col,
} from 'antd';
import { useIntl, useModel } from 'umi';
import { PlusOutlined, MinusCircleOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import useUsers from '@/hooks/useUsers';

import axios from 'axios';
import { ipLocal } from '@/utils/ip';
import FormItemUrlOrUpload from '@/components/Upload/FormItemUrlOrUpload';

const { Option } = Select;
const { Text } = Typography;

interface DiemHocSinhFormProps {
	title?: string;
	userId?: string;
	hideFooter?: boolean;
}

const DiemHocSinhForm: React.FC<DiemHocSinhFormProps> = ({ title = 'điểm học sinh', hideFooter, userId }) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } = useModel('hocba');
	const { users, getUserFullName, getUserInfo, loading: usersLoading } = useUsers();
	const [form] = Form.useForm();
	const intl = useIntl();
	const [selectedUserId, setSelectedUserId] = React.useState<string>('');
	const [searchValue, setSearchValue] = React.useState<string>('');

	// Danh sách môn học có thể chọn
	const monHocOptions = [
		'Toán',
		'Ngữ văn',
		'Tiếng Anh',
		'Vật lý',
		'Hóa học',
		'Sinh học',
		'Lịch sử',
		'Địa lý',
		'GDCD',
		'Tin học',
		'Thể dục',
		'Âm nhạc',
		'Mỹ thuật',
	];

	// Danh sách học kỳ
	const hocKyOptions = ['1', '2'];

	// Danh sách năm học
	const currentYear = new Date().getFullYear();
	const namHocOptions = Array.from({ length: 5 }, (_, i) => {
		const year = currentYear - i;
		return `${year}-${year + 1}`;
	});

	// Danh sách khối lớp
	const khoiLopOptions = ['10', '11', '12'];

	// Lọc học sinh với khả năng tìm kiếm theo nhiều tiêu chí
	const getFilteredStudents = React.useMemo(() => {
		if (!searchValue.trim()) {
			return users;
		}

		const searchTerm = searchValue.toLowerCase().trim();

		return users.filter((user) => {
			const fullName = `${user.ho} ${user.ten}`.toLowerCase();
			const username = user.username.toLowerCase();
			const userId = user.id.toLowerCase();
			const email = user.email.toLowerCase();
			const soCCCD = user.soCCCD?.toLowerCase() || '';

			return (
				fullName.includes(searchTerm) ||
				username.includes(searchTerm) ||
				userId.includes(searchTerm) ||
				email.includes(searchTerm) ||
				soCCCD.includes(searchTerm)
			);
		});
	}, [users, searchValue]);

	// Tạo options cho Select với thông tin đầy đủ
	const studentOptions = getFilteredStudents.map((user) => ({
		value: user.id,
		label: `${user.ho} ${user.ten}`,
		user: user,
	}));

	// Custom filter function cho Select
	const filterOption = (input: string, option: any) => {
		if (!input) return true;

		const searchTerm = input.toLowerCase();
		const user = option.user;

		const fullName = `${user.ho || ''} ${user.ten || ''}`.toLowerCase();
		const username = (user.username || '').toLowerCase();
		const userId = (user.id || '').toLowerCase();
		const email = (user.email || '').toLowerCase();
		const soCCCD = (user.soCCCD || '').toLowerCase();

		return (
			fullName.includes(searchTerm) ||
			username.includes(searchTerm) ||
			userId.includes(searchTerm) ||
			email.includes(searchTerm) ||
			soCCCD.includes(searchTerm)
		);
	};

	// Reset form khi đóng/mở form
	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedUserId('');
			setSearchValue('');
		} else if (record) {
			form.setFieldsValue({
				...record,
				diemMonHoc:
					record.diemMonHoc && record.diemMonHoc.length > 0
						? record.diemMonHoc
						: [{ mon: '', hocKy: '1', diemTongKet: 0 }],
			});
			setSelectedUserId(record.userId || '');
		} else {
			form.setFieldsValue({
				diemMonHoc: [{ mon: '', hocKy: '1', diemTongKet: 0 }],
				loaiHanhKiem: 'trung bình',
				namHoc: namHocOptions[0],
				khoiLop: '10',
			});
		}
	}, [record, visibleForm, namHocOptions]);

	// Hàm xử lý upload file
	const handleUploadFile = async (file: File, userId: string) => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('userId', userId);
		formData.append('type', 'proof'); // Minh chứng thuộc loại proof

		try {
			const response = await axios.post(`${ipLocal}/upload`, formData, {
				headers: { 'Content-Type': 'multipart/form-data' },
			});
			return response.data.fileUrl; // Trả về URL của file từ server
		} catch (error) {
			console.error('Upload file error:', error);
			throw new Error('Failed to upload file');
		}
	};

	const onFinish = async (values: DiemHocSinh.IRecord) => {
		try {
			// Lọc bỏ các môn học trống
			const filteredValues = {
				...values,
				diemMonHoc: values.diemMonHoc.filter((item) => item.mon && item.hocKy && item.diemTongKet !== undefined),
			};

			// Nếu có file upload trong minhChung
			if (values.minhChung?.fileList?.length) {
				const file = values.minhChung.fileList[0].originFileObj;
				if (file && selectedUserId) {
					const fileUrl = await handleUploadFile(file, selectedUserId);
					filteredValues.minhChung = fileUrl; // Gán URL file vào minhChung
				}
			}

			if (edit) {
				await putModel(record?.id ?? '', filteredValues);
			} else {
				await postModel(filteredValues);
			}
			setVisibleForm(false);
		} catch (error) {
			console.error('Form submission error:', error);
		}
	};

	// Render thông tin học sinh đã chọn
	const renderSelectedStudent = () => {
		if (!selectedUserId) return null;

		const userInfo = getUserInfo(selectedUserId);
		const fullName = getUserFullName(selectedUserId);
		const selectedUser = users.find((user) => user.id === selectedUserId);

		if (!userInfo || !selectedUser) return null;

		return (
			<Card size='small' style={{ marginTop: 8, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
				<Row align='middle' gutter={16}>
					<Col>
						<Avatar src={userInfo.avatar} icon={<UserOutlined />} />
					</Col>
					<Col flex={1}>
						<div>
							<Text strong style={{ color: '#52c41a' }}>
								{fullName}
							</Text>
							<br />
							<Text type='secondary' style={{ fontSize: '14px' }}>
								Mã HS: {selectedUser.id} | @{userInfo.username}
							</Text>
							{selectedUser.email && (
								<>
									<br />
									<Text type='secondary' style={{ fontSize: '12px' }}>
										Email: {selectedUser.email}
									</Text>
								</>
							)}
							{selectedUser.soCCCD && (
								<>
									<br />
									<Text type='secondary' style={{ fontSize: '12px' }}>
										CCCD: {selectedUser.soCCCD}
									</Text>
								</>
							)}
						</div>
					</Col>
				</Row>
			</Card>
		);
	};

	// Render option cho Select với thông tin chi tiết
	const renderStudentOption = (user: any) => {
		return (
			<div style={{ padding: '8px 0' }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
					<Avatar size='small' src={user.avatar} icon={<UserOutlined />} />
					<div style={{ flex: 1 }}>
						<div style={{ fontWeight: 500, color: '#1890ff' }}>
							{user.ho} {user.ten}
						</div>
						<div style={{ fontSize: '12px', color: '#666' }}>
							<span>Mã: {user.id}</span>
							<span style={{ margin: '0 8px' }}>•</span>
							<span>@{user.username}</span>
							{user.email && (
								<>
									<span style={{ margin: '0 8px' }}>•</span>
									<span>{user.email}</span>
								</>
							)}
						</div>
						{user.soCCCD && <div style={{ fontSize: '11px', color: '#999' }}>CCCD: {user.soCCCD}</div>}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div>
			<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`}>
				<Form
					form={form}
					layout='vertical'
					onFinish={onFinish}
					autoComplete='off'
					initialValues={{
						diemMonHoc: [{ mon: '', hocKy: '1', diemTongKet: 0 }],
						loaiHanhKiem: 'trung bình',
						namHoc: namHocOptions[0],
						khoiLop: '10',
					}}
				>
					{edit && (
						<Form.Item label='ID Học Bạ' name='id'>
							<Input disabled />
						</Form.Item>
					)}

					{/* Thông tin cơ bản */}
					<Divider orientation='left'>Thông tin cơ bản</Divider>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Học sinh' name='userId' rules={[...rules.required]}>
								<Select
									showSearch
									placeholder='Tìm kiếm theo tên, mã HS, username, email, CCCD...'
									loading={usersLoading}
									filterOption={filterOption}
									onChange={(value) => setSelectedUserId(value)}
									disabled={edit}
									suffixIcon={<SearchOutlined />}
									optionLabelProp='label'
									style={{ width: '100%' }}
									dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
									notFoundContent={usersLoading ? 'Đang tải...' : 'Không tìm thấy học sinh phù hợp'}
								>
									{studentOptions.map((option) => (
										<Option key={option.value} value={option.value} label={option.label} user={option.user}>
											{renderStudentOption(option.user)}
										</Option>
									))}
								</Select>
							</Form.Item>

							{renderSelectedStudent()}

							{!edit && (
								<div
									style={{
										marginTop: 8,
										padding: '8px 12px',
										backgroundColor: '#f0f9ff',
										borderRadius: '6px',
										border: '1px solid #d6f7ff',
									}}
								>
									<Text type='secondary' style={{ fontSize: '12px' }}>
										<SearchOutlined style={{ marginRight: 4 }} />
										Có thể tìm kiếm theo: Tên học sinh, Mã học sinh, Username (@), Email, hoặc số CCCD
									</Text>
								</div>
							)}
						</Col>

						<Col span={6}>
							<Form.Item label='Năm học' name='namHoc'>
								<Select placeholder='Chọn năm học'>
									{namHocOptions.map((nam) => (
										<Option key={nam} value={nam}>
											{nam}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>

						<Col span={6}>
							<Form.Item label='Khối lớp' name='khoiLop'>
								<Select placeholder='Chọn khối'>
									{khoiLopOptions.map((khoi) => (
										<Option key={khoi} value={khoi}>
											Khối {khoi}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
					</Row>

					{/* Điểm các môn học */}
					<Divider orientation='left'>Điểm các môn học</Divider>
					<Form.List name='diemMonHoc'>
						{(fields, { add, remove }) => (
							<>
								{fields.map(({ key, name, ...restField }) => (
									<Card
										key={key}
										size='small'
										style={{ marginBottom: 16 }}
										title={`Môn học ${name + 1}`}
										extra={
											fields.length > 1 && (
												<MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ff4d4f', fontSize: 16 }} />
											)
										}
									>
										<Row gutter={16}>
											<Col span={8}>
												<Form.Item {...restField} name={[name, 'mon']} label='Môn học' rules={[...rules.required]}>
													<Select placeholder='Chọn môn học'>
														{monHocOptions.map((mon) => (
															<Option key={mon} value={mon}>
																{mon}
															</Option>
														))}
													</Select>
												</Form.Item>
											</Col>

											<Col span={4}>
												<Form.Item {...restField} name={[name, 'hocKy']} label='Học kỳ' rules={[...rules.required]}>
													<Select placeholder='HK'>
														{hocKyOptions.map((hk) => (
															<Option key={hk} value={hk}>
																HK{hk}
															</Option>
														))}
													</Select>
												</Form.Item>
											</Col>

											<Col span={6}>
												<Form.Item
													{...restField}
													name={[name, 'diemTongKet']}
													label='Điểm tổng kết'
													rules={[
														...rules.required,
														{
															type: 'number',
															min: 0,
															max: 10,
															message: 'Điểm phải từ 0 đến 10',
														},
													]}
												>
													<InputNumber
														min={0}
														max={10}
														step={0.1}
														precision={1}
														placeholder='0.0'
														style={{ width: '100%' }}
													/>
												</Form.Item>
											</Col>

											<Col span={6}>
												<Form.Item {...restField} name={[name, 'ghiChu']} label='Ghi chú'>
													<Input placeholder='Ghi chú (tùy chọn)' />
												</Form.Item>
											</Col>
										</Row>
									</Card>
								))}
								<Form.Item>
									<Button
										type='dashed'
										onClick={() => add({ mon: '', hocKy: '1', diemTongKet: 0, ghiChu: '' })}
										block
										icon={<PlusOutlined />}
									>
										Thêm môn học
									</Button>
								</Form.Item>
							</>
						)}
					</Form.List>

					{/* Đánh giá và nhận xét */}
					<Divider orientation='left'>Đánh giá và nhận xét</Divider>

					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label='Loại hạnh kiểm' name='loaiHanhKiem' rules={[...rules.required]}>
								<Select placeholder='Chọn loại hạnh kiểm'>
									<Option value='tốt'>Tốt</Option>
									<Option value='khá'>Khá</Option>
									<Option value='trung bình'>Trung bình</Option>
									<Option value='yếu'>Yếu</Option>
									<Option value='kém'>Kém</Option>
								</Select>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item label='Xếp loại học lực' name='xepLoaiHocLuc'>
								<Select placeholder='Chọn xếp loại học lực'>
									<Option value='giỏi'>Giỏi</Option>
									<Option value='khá'>Khá</Option>
									<Option value='trung bình'>Trung bình</Option>
									<Option value='yếu'>Yếu</Option>
									<Option value='kém'>Kém</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item label='Nhận xét của giáo viên chủ nhiệm' name='nhanXetGiaoVien'>
						<Input.TextArea placeholder='Nhập nhận xét về học sinh...' rows={3} showCount maxLength={500} />
					</Form.Item>

					{/* Minh chứng */}
					<FormItemUrlOrUpload
						form={form}
						initValue={record?.minhChung}
						field='minhChung'
						accept='.pdf,.doc,.docx'
						isRequired={true}
						label='Minh chứng, tài liệu đính kèm'
					/>

					{!hideFooter && (
						<div className='form-actions' style={{ marginTop: 24, textAlign: 'center' }}>
							<Space>
								<Button loading={formSubmiting} htmlType='submit' type='primary'>
									{edit
										? intl.formatMessage({ id: 'global.button.luulai' })
										: intl.formatMessage({ id: 'global.button.themmoi' })}
								</Button>
								<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
							</Space>
						</div>
					)}
				</Form>
			</Card>
		</div>
	);
};

export default DiemHocSinhForm;

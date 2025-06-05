import React from 'react';
import { Button, Card, Form, InputNumber, Row, Col, Space, Select, Avatar, Typography, Divider } from 'antd';
import { useModel, useIntl } from 'umi';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import useUsers from '@/hooks/useUsers';
import PhuongThucXTSelect from '@/pages/PhuongThucXT/components/Select';
import NganhDaoTaoSelect from '@/pages/NganhDaoTao/components/Select';

interface ThongTinNguyenVongFormProps {
	title?: string;
	userId: string;
	hideFooter?: boolean;
}

const { Text } = Typography;
const { Option } = Select;

const ThongTinNguyenVongForm: React.FC<ThongTinNguyenVongFormProps> = ({
	title = 'thông tin nguyện vọng',
	hideFooter,
	userId,
}) => {
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('thongtinnguyenvong');
	const { users, getUserFullName, getUserInfo, loading: usersLoading } = useUsers();
	const [form] = Form.useForm();
	const intl = useIntl();
	const [selectedUserId, setSelectedUserId] = React.useState<string>('');

	// Lọc học sinh với khả năng tìm kiếm
	const [searchValue, setSearchValue] = React.useState<string>('');
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

	const studentOptions = getFilteredStudents.map((user) => ({
		value: user.id,
		label: `${user.ho} ${user.ten}`,
		user,
	}));

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

	// Reset form
	React.useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
			setSelectedUserId('');
			setSearchValue('');
		} else if (record?.id) {
			form.setFieldsValue(record);
			setSelectedUserId(record.userId || '');
		}
	}, [record?.id, visibleForm, form]);

	const onFinish = async (values: ThongTinNguyenVong.IRecord) => {
		try {
			if (edit) {
				await putModel(record?.id ?? '', values);
			} else {
				await postModel({ ...values, userId: selectedUserId });
			}
			setVisibleForm(false);
		} catch (error) {
			console.error('Form submission error:', error);
		}
	};

	// Render thông tin thí sinh đã chọn
	const renderSelectedStudent = () => {
		if (!selectedUserId) return null;

		const userInfo = getUserInfo(selectedUserId);
		const fullName = getUserFullName(selectedUserId);
		const selectedUser = users.find((user) => user.id === selectedUserId);

		if (!userInfo || !selectedUser) return null;

		return (
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
		);
	};

	// Render option cho Select
	const renderStudentOption = (user: any) => (
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

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title}`} style={{ maxWidth: 1200, margin: '0 auto' }}>
			<Form form={form} layout='vertical' onFinish={onFinish} autoComplete='off'>
				<Divider orientation='left'>Thông tin cơ bản</Divider>
				<Row gutter={16}>
					<Col span={12}>
						{/* Chọn học sinh với tìm kiếm nâng cao */}
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
								dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
								notFoundContent={usersLoading ? 'Đang tải...' : 'Không tìm thấy học sinh phù hợp'}
							>
								{studentOptions.map((option) => (
									<Option key={option.value} value={option.value} label={option.label} user={option.user}>
										{renderStudentOption(option.user)}
									</Option>
								))}
							</Select>
						</Form.Item>

						{/* Hiển thị thông tin học sinh đã chọn */}
						{renderSelectedStudent()}

						{/* Hướng dẫn tìm kiếm */}
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

					<Col span={12}>
						<Form.Item label='Tên nguyện vọng' name='ten' rules={[...rules.required]}>
							<NganhDaoTaoSelect />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label='Thứ tự nguyện vọng' name='thuTuNV' rules={[...rules.required]}>
							<InputNumber min={1} placeholder='Nhập thứ tự nguyện vọng' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Phương thức xét tuyển' name='phuongThucId' rules={[...rules.required]}>
							<PhuongThucXTSelect placeholder='Chọn phương thức xét tuyển' />
						</Form.Item>
					</Col>
				</Row>
				<Divider orientation='left'>Điểm số</Divider>
				<Row gutter={16}>
					<Col span={8}>
						<Form.Item label='Điểm chưa ưu tiên' name='diemChuaUT' rules={[...rules.required]}>
							<InputNumber
								min={0}
								step={0.1}
								precision={1}
								placeholder='Nhập điểm chưa ưu tiên'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Điểm có ưu tiên' name='diemCoUT' rules={[...rules.required]}>
							<InputNumber
								min={0}
								step={0.1}
								precision={1}
								placeholder='Nhập điểm có ưu tiên'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Tổng điểm' name='tongDiem' rules={[...rules.required]}>
							<InputNumber min={0} step={0.1} precision={1} placeholder='Nhập tổng điểm' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
				</Row>
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item label='Điểm đối tượng ưu tiên' name='diemDoiTuongUT'>
							<InputNumber
								min={0}
								step={0.1}
								precision={1}
								placeholder='Nhập điểm đối tượng ưu tiên (tùy chọn)'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Điểm khu vực ưu tiên' name='diemKhuVucUT'>
							<InputNumber
								min={0}
								step={0.1}
								precision={1}
								placeholder='Nhập điểm khu vực ưu tiên (tùy chọn)'
								style={{ width: '100%' }}
							/>
						</Form.Item>
					</Col>
				</Row>
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
	);
};

export default ThongTinNguyenVongForm;
